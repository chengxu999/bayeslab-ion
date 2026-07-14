# Connect Bayeslab ION to Claude

Use this production remote MCP endpoint in every Claude client:

```text
https://mcp.bayeslab.xyz/api/mcp
```

Authentication uses OAuth 2.1 with PKCE. Sign in with the GoodZ account that
owns your Bayeslab ION access. No API key or OAuth client secret is required
for the standard connector flow.

## Claude plugin

Install the public plugin to get the remote MCP connector together with the ION
research workflow:

```bash
claude plugin marketplace add chengxu999/bayeslab-ion
claude plugin install bayeslab-ion@bayeslab
```

Open `/mcp`, select `bayeslab-ion`, and complete the browser sign-in. The plugin
uses the same production endpoint and account permissions as the custom
connector below.

## Claude Web and Claude Desktop

1. Open `Customize > Connectors`.
2. Select `Add custom connector`.
3. Name it `Bayeslab ION`.
4. Enter `https://mcp.bayeslab.xyz/api/mcp` as the remote MCP URL.
5. Select `Add`, then `Connect` and complete the browser sign-in.
6. Enable Bayeslab ION for the conversation from the connectors menu.

Team and Enterprise owners add the same URL from the organization connector
settings before members connect their own accounts.

## Claude Code

Add the Streamable HTTP server:

```bash
claude mcp add --transport http bayeslab-ion https://mcp.bayeslab.xyz/api/mcp
```

Open `/mcp` in Claude Code, select `bayeslab-ion`, and complete authentication
in the browser.

## Verify the connection

Start with read-only prompts:

```text
Use Bayeslab ION to list the available screening periods.
```

```text
Find the latest published ION report for PTBA.JK. Separate reported evidence,
valuation conclusions, and unresolved risks.
```

For a new company analysis, first ask Claude to resolve the industry slug and
summarize the request. Calling `create_analysis_job` consumes usage credits, so
Claude should wait for explicit approval before creating the job. Poll with
`get_analysis_job` without `includeReport` until the job completes, then request
the full report once.

External jobs are isolated and never refresh or overwrite canonical published
ION reports.

## Troubleshooting

- `401 Unauthorized`: reconnect the connector and finish OAuth.
- Entitlement error: confirm the signed-in GoodZ account has active ION access.
- Credit error: add credits or reduce concurrent analysis requests.
- Long-running job: retrieve the existing job by ID instead of submitting a
  duplicate.

Anthropic's current remote MCP instructions are available in its
[custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
