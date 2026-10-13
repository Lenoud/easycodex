const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("thread history reads never resume a thread writer", async () => {
  const { readThreadSnapshot } = require("./thread-read");
  const calls = [];

  await assert.rejects(
    () =>
      readThreadSnapshot({
        threadId: "thread-in-use",
        liveBridge: null,
        request: async (method) => {
          calls.push(method);
          throw new Error("thread/read unavailable");
        },
        historyFromThread: () => [],
      }),
    /thread\/read unavailable/,
  );

  assert.deepEqual(calls, ["thread/read"]);
});

test("Codex bridge leaves the default model to the current app-server config", () => {
  const server = read("scripts/start-phone.js");

  assert.doesNotMatch(server, /isClaudeProvider \? "sonnet" : "gpt-5\.4"/);
  assert.doesNotMatch(server, /\["gpt-5\.5", "gpt-5\.4", "gpt-5\.3-codex"/);
});

test("web client is Simplified Chinese and builds its Codex model choices dynamically", () => {
  const shell = read("src/ui/Shell.jsx");
  const client = read("public/main.js");
  const document = read("public/index.html");

  assert.match(document, /<html lang="zh-CN">/);
  assert.doesNotMatch(shell, /data-model-choice="gpt-5\.[45]"/);
  assert.match(shell, /id="modelChoices"/);
  assert.match(client, /renderModelChoices/);
  assert.doesNotMatch(client, /ja-JP/);
});
