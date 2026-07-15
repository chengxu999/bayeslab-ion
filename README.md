# Bayeslab ION

Bayeslab ION brings industry-specific public-equity research into Codex,
Claude, and other remote MCP clients. It can read published ION reports and,
with paid access, queue isolated company analyses that do not alter the
reviewed report library.

- Product: https://bayeslab.xyz/
- MCP and API: https://mcp.bayeslab.xyz/mcp
- Codex guide: https://bayeslab.xyz/agents/codex
- Claude guide: https://bayeslab.xyz/agents/claude

## Install in Codex

Add the public Bayeslab marketplace, then install the plugin:

```bash
codex plugin marketplace add chengxu999/bayeslab-ion --ref main
codex plugin add bayeslab-ion@bayeslab
```

Codex opens the Bayeslab ION OAuth flow during installation. Sign in with the
GoodZ account that owns your ION access.

To connect only the MCP server without the research skill:

```bash
codex mcp add bayeslab-ion --url https://mcp.bayeslab.xyz/api/mcp
codex mcp login bayeslab-ion
```

## Install in Claude

Add the public Bayeslab marketplace, then install the plugin in Claude Code:

```bash
claude plugin marketplace add chengxu999/bayeslab-ion
claude plugin install bayeslab-ion@bayeslab
```

Open `/mcp` and complete the GoodZ OAuth sign-in when prompted. The same
production endpoint also works as a custom connector in Claude Web and Claude
Desktop. See [the Claude connector guide](docs/claude-connector.md).

## What the plugin does

- Finds companies and categories in the published ION research library.
- Reads company overviews, chained analysis, valuation, addons, and period
  history.
- Explains industry methodology without exposing private prompt text.
- Queues a new industry-scoped analysis only after explicit user approval,
  because the operation consumes usage credits. The initial reservation is not
  a spending cap; the final charge follows actual provider usage.
- Polls long-running work compactly and reads completed Markdown reports in
  bounded pages.

## Example prompts

- `Find the latest published ION view on PTBA.JK and summarize the valuation evidence.`
- `Compare how ACG Metals changed across available ION periods.`
- `Show the thermal-coal methodology before we decide whether to analyze BANPU.BK.`
- `Run a new copper-mining analysis for a company after showing me the ticker, industry, and credit-consuming action for approval.`

## Access and safety

Bayeslab ION uses OAuth 2.1 with PKCE. Report access and analysis creation are
enforced by the subscription and credit entitlements attached to the signed-in
GoodZ account. A newly queued analysis is isolated from canonical reports and
never refreshes or overwrites reviewed ION output.

Review the [Privacy Policy](https://bayeslab.xyz/privacy) and
[Terms of Service](https://bayeslab.xyz/terms). Support is available at
support@bayeslab.xyz.
