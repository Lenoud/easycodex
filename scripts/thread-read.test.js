const test = require("node:test");
const assert = require("node:assert/strict");

const { findLiveBridge, liveBridgeSnapshot, readThreadSnapshot } = require("./thread-read");

test("liveBridgeSnapshot returns ready in-memory bridge history", () => {
  assert.deepEqual(
    liveBridgeSnapshot(
      {
        ready: true,
        threadId: "thread-123",
        history: [{ type: "status", text: "ready" }],
      },
      "thread-123",
    ),
    {
      threadId: "thread-123",
      ready: true,
      history: [{ type: "status", text: "ready" }],
      source: "live-bridge",
    },
  );
});

test("findLiveBridge finds bridges by promoted thread id", () => {
  const bridge = { threadId: "thread-123", requestedThreadId: null };
  const bridges = new Map([["thread-123", bridge]]);

  assert.equal(findLiveBridge(bridges, "thread-123"), bridge);
});

test("findLiveBridge finds starting bridges by requested thread id", () => {
  const bridge = { threadId: null, requestedThreadId: "thread-123" };
  const bridges = new Map([["connection-temp-key", bridge]]);

  assert.equal(findLiveBridge(bridges, "thread-123"), bridge);
});

test("readThreadSnapshot does not call app-server for a live bridge thread", async () => {
  let calls = 0;
  const snapshot = await readThreadSnapshot({
    threadId: "thread-123",
    liveBridge: {
      ready: true,
      threadId: "thread-123",
      history: [{ type: "assistant", text: "hello" }],
    },
    request: async () => {
      calls += 1;
      throw new Error("should not call app-server");
    },
    historyFromThread: () => [],
  });

  assert.equal(calls, 0);
  assert.equal(snapshot.source, "live-bridge");
  assert.equal(snapshot.ready, true);
  assert.deepEqual(snapshot.history, [{ type: "assistant", text: "hello" }]);
});

test("readThreadSnapshot does not call app-server while an existing bridge is still starting", async () => {
  let calls = 0;
  const snapshot = await readThreadSnapshot({
    threadId: "thread-123",
    liveBridge: {
      ready: false,
      requestedThreadId: "thread-123",
      threadId: null,
      history: [],
    },
    request: async () => {
      calls += 1;
      throw new Error("should not call app-server while bridge is starting");
    },
    historyFromThread: () => [],
  });

  assert.equal(calls, 0);
  assert.equal(snapshot.source, "live-bridge");
  assert.equal(snapshot.ready, false);
  assert.deepEqual(snapshot.history, []);
});

test("readThreadSnapshot reports a failed bridge read without resuming", async () => {
  const calls = [];

  await assert.rejects(
    () =>
      readThreadSnapshot({
        threadId: "thread-123",
        liveBridge: { ready: false, startupFailed: true, requestedThreadId: "thread-123", threadId: null, history: [] },
        request: async (method) => {
          calls.push(method);
          throw new Error("stale cache");
        },
        historyFromThread: () => [],
      }),
    /stale cache/,
  );

  assert.deepEqual(calls, ["thread/read"]);
});

test("readThreadSnapshot never resumes a non-live thread while reading history", async () => {
  const calls = [];

  await assert.rejects(
    () =>
      readThreadSnapshot({
        threadId: "thread-456",
        liveBridge: null,
        request: async (method) => {
          calls.push(method);
          throw new Error("no rollout found");
        },
        historyFromThread: () => [],
      }),
    /no rollout found/,
  );

  assert.deepEqual(calls, ["thread/read"]);
});

test("readThreadSnapshot never resumes after an upstream read failure", async () => {
  const calls = [];

  await assert.rejects(
    () =>
      readThreadSnapshot({
        threadId: "thread-123",
        liveBridge: { ready: false, startupFailed: true, requestedThreadId: "thread-123", threadId: null, history: [] },
        request: async (method) => {
          calls.push(method);
          throw new Error("not found");
        },
        historyFromThread: () => [],
      }),
    /not found/,
  );

  assert.deepEqual(calls, ["thread/read"]);
});
