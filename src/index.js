const fs = require("fs");
const core = require("@actions/core");

const alerts = require("./alerts");

async function run() {
  try {
    const repo = core.getInput("repo");
    const token = core.getInput("token");
    core.setSecret(token);
    const output = core.getInput("output");
    core.info(`Fetching code scanning alerts from Github on ${repo} ...`);
    const results = await alerts(repo, token);
    fs.writeFileSync(output, JSON.stringify(results));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();