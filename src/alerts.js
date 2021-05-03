const { Octokit } = require("@octokit/core");


class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
  }
}

const throwsNon200 = (response) => {
  if (response.status >= 400)
    throw new HTTPResponseError(response);
  return response;
}

const getOwner = (repoUrl) => {
  const args = repoUrl.split('/');
  return args.length > 0 ? args[0] : '';
}

const getRepo = (repoUrl) => {
  const args = repoUrl.split('/');
  return args.length > 1 ? args[1] : '';

}

/**
 * Returns alerts from Github code-scanning associated to a repo url
 *
 * @param {string} repoUrl The repository url as owner/repo
 * @param {string} token The token to authenticate to Github API
 *
 * @returns {Promise<HttpScanResult>}
 */
const alerts = (repoUrl, token) => {
  console.warn(`fetch Github code scanning alerts for ${repoUrl}`);
  const octokit = new Octokit({ auth: token });
  return octokit.request('GET /repos/{owner}/{repo}/code-scanning/alerts', {
    owner: getOwner(repoUrl),
    repo: getRepo(repoUrl)
  })
    .then(throwsNon200)
    .then(response => response.data);
};

module.exports = alerts;