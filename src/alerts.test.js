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
        }
      ]
    };
    nock('https://api.github.com', {
      reqheaders: {
        accept: "application/vnd.github.v3+json",
        authorization: "token test-token",
        "accept-encoding": "gzip,deflate",
        connection: "close"
      }
    })
      .get('/repos/octocat/hello-world/code-scanning/alerts?state=open')
      .reply(200, response.data);

    const results = await alerts("octocat/hello-world", "test-token");
    expect(results).toEqual({ url: "https://github.com/octocat/hello-world", grade: "F", alerts: response.data });
  });

  test("should return error 403 forbidden", async () => {
    nock('https://api.github.com', {
      reqheaders: {
        accept: "application/vnd.github.v3+json",
        authorization: "token wrong-token",
        "accept-encoding": "gzip,deflate",
        connection: "close"
      }
    })
      .get('/repos/octocat/hello-world/code-scanning/alerts?state=open')
      .reply(403, {
        statusText: "Forbidden"
      });

    await expect(alerts("octocat/hello-world", "wrong-token")).rejects.toThrow("Forbidden");

  });
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
