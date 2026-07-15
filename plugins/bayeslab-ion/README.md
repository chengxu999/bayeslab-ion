# Bayeslab ION Plugin

This Codex and Claude plugin combines the production Bayeslab ION remote MCP
server with a focused research workflow.

The server exposes published report lookup, period-aware comparison, industry
methodology, and isolated analysis jobs. OAuth binds access to the signed-in
GoodZ account. Creating an analysis job consumes usage credits; reading or
polling should not create a second job. The initial credit reservation is not a
spending cap: final charges follow actual provider usage. Completed reports are
read with `get_analysis_job_report` in bounded pages.

See https://bayeslab.xyz/agents/codex and
https://bayeslab.xyz/agents/claude for setup and product details.
