const nock = require('nock');

const alerts = require("./alerts");


describe("fetch alerts from a Github repository", () => {

  beforeEach(() => {
    nock.disableNetConnect();
  });

  test("should return alerts", async () => {
    const response = {
      "data": [
        {
          "number": 4,
          "created_at": "2020-02-13T12:29:18Z",
          "url": "https://api.github.com/repos/octocat/hello-world/code-scanning/alerts/4",
          "html_url": "https://github.com/octocat/hello-world/code-scanning/4",
          "state": "open",
          "dismissed_by": null,
          "dismissed_at": null,
          "dismissed_reason": null,
          "rule": {
            "id": "js/zipslip",
            "severity": "error",
            "description": "Arbitrary file write during zip extraction",
            "name": "js/zipslip"
          },
          "tool": {
            "name": "CodeQL",
            "guid": null,
            "version": "2.4.0"
          },
          "most_recent_instance": {
            "ref": "refs/heads/main",
            "analysis_key": ".github/workflows/codeql-analysis.yml:CodeQL-Build",
            "environment": "{}",
            "state": "open",
            "commit_sha": "39406e42cb832f683daa691dd652a8dc36ee8930",
            "message": {
              "text": "This path depends on a user-provided value."
            },
            "location": {
              "path": "spec-main/api-session-spec.ts",
              "start_line": 917,
              "end_line": 917,
              "start_column": 7,
              "end_column": 18
            },
            "classifications": [
              "test"
            ]
          },
          "instances_url": "https://api.github.com/repos/octocat/hello-world/code-scanning/alerts/4/instances"
        },
        {
          "number": 3,
          "created_at": "2020-02-13T12:29:18Z",
          "url": "https://api.github.com/repos/octocat/hello-world/code-scanning/alerts/3",
          "html_url": "https://github.com/octocat/hello-world/code-scanning/3",
          "state": "dismissed",
          "dismissed_by": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat",
            "followers_url": "https://api.github.com/users/octocat/followers",
            "following_url": "https://api.github.com/users/octocat/following{/other_user}",
            "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
            "organizations_url": "https://api.github.com/users/octocat/orgs",
            "repos_url": "https://api.github.com/users/octocat/repos",
            "events_url": "https://api.github.com/users/octocat/events{/privacy}",
            "received_events_url": "https://api.github.com/users/octocat/received_events",
            "type": "User",
            "site_admin": false
          },
          "dismissed_at": "2020-02-14T12:29:18Z",
          "dismissed_reason": "false positive",
          "rule": {
            "id": "js/zipslip",
            "severity": "error",
            "description": "Arbitrary file write during zip extraction",
            "name": "js/zipslip"
          },
          "tool": {
            "name": "CodeQL",
            "guid": null,
            "version": "2.4.0"
          },
          "most_recent_instance": {
            "ref": "refs/heads/main",
            "analysis_key": ".github/workflows/codeql-analysis.yml:CodeQL-Build",
            "environment": "{}",
            "state": "open",
            "commit_sha": "39406e42cb832f683daa691dd652a8dc36ee8930",
            "message": {
              "text": "This path depends on a user-provided value."
            },
            "location": {
              "path": "lib/ab12-gen.js",
              "start_line": 917,
              "end_line": 917,
              "start_column": 7,
              "end_column": 18
            },
            "classifications": []
          },
          "instances_url": "https://api.github.com/repos/octocat/hello-world/code-scanning/alerts/3/instances"
        }
      ]
    };
    nock('https://api.github.com', {
      reqheaders: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "octokit-core.js/3.4.0 Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/16.5.3",
        authorization: "token test-token",
        "accept-encoding": "gzip,deflate",
        connection: "close"
      }
    })
      .get('/repos/octocat/hello-world/code-scanning/alerts')
      .query({ state: 'open' })
      .reply(200, response.data);

    const results = await alerts("octocat/hello-world", "test-token", "open");
    expect(results).toEqual({ url: "https://github.com/octocat/hello-world", grade: "F", alerts: response.data });
  });

  test("should return error 403 forbidden", async () => {
    nock('https://api.github.com', {
      reqheaders: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "octokit-core.js/3.4.0 Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/16.5.3",
        authorization: "token wrong-token",
        "accept-encoding": "gzip,deflate",
        connection: "close"
      }
    })
      .get('/repos/octocat/hello-world/code-scanning/alerts')
      .query({ state: 'open' })
      .reply(403, {
        statusText: "Forbidden"
      });

    await expect(alerts("octocat/hello-world", "wrong-token", "open")).rejects.toThrow("Forbidden");

  });
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
