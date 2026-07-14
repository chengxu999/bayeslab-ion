# Claude Connectors Directory Submission

This checklist prepares the production Bayeslab ION remote MCP server for the
Claude Connectors Directory. The copyable listing fields are in
[`claude-directory-listing.json`](claude-directory-listing.json).

## Submission access

Remote MCP submissions are created in the Claude.ai organization admin portal.
The submitting account must be an Owner, Primary Owner, or delegated directory
manager in a Team or Enterprise organization.

Submission portal:
https://claude.ai/admin-settings/directory/submissions

## Listing fields

- Name: `Bayeslab ION`
- Slug: `bayeslab-ion`
- Tagline: `Industry-specific equity research for investors`
- Categories: `Finance`, `Data & Analytics`
- Server: `https://mcp.bayeslab.xyz/api/mcp`
- Transport: Streamable HTTP
- Authentication: OAuth 2.1 with PKCE and dynamic client registration
- Documentation: https://bayeslab.xyz/agents/claude
- Privacy: https://bayeslab.xyz/privacy
- Support: support@bayeslab.xyz
- Icon: `plugins/bayeslab-ion/assets/bayeslab-ion.png`

The description and four review prompts are stored in the JSON listing file to
avoid copy drift.

## Tool review

The public connector exposes 13 tools.

Read-only:

- `get_project_info`
- `list_categories`
- `list_companies`
- `get_company_overview`
- `get_company_analysis`
- `get_company_addons`
- `get_company_l3`
- `get_company_period_history`
- `list_periods`
- `get_category_methodology`
- `list_analysis_jobs`
- `get_analysis_job`

Write:

- `create_analysis_job` creates an isolated job and consumes usage credits. It
  does not alter or overwrite canonical published reports.

Every public tool must retain a title plus explicit read/write, destructive,
idempotent, and open-world annotations in the production MCP contract.

## Reviewer account

Create a dedicated GoodZ account for Anthropic review. Do not share an owner or
personal account. The reviewer account must have:

- active `ion.report.read`, `ion.analysis.create`, and `ion.api_key.create`
  entitlements;
- enough credits for at least two complete analysis jobs;
- access to populated published reports and completed historical jobs;
- credentials delivered only through the secure submission portal.

Remove or rotate the reviewer credentials after review.

## Pre-submission verification

- [ ] Public GitHub repository is available at
  `https://github.com/chengxu999/bayeslab-ion`.
- [ ] `node --test` passes in the public repository.
- [ ] Codex installs `bayeslab-ion@bayeslab` from the Git repository.
- [ ] OAuth metadata returns the canonical MCP resource and PKCE `S256`.
- [ ] A Claude custom connector completes OAuth with the reviewer account.
- [ ] Every read-only tool succeeds with valid input.
- [ ] `create_analysis_job` reserves credits once and returns a job ID.
- [ ] Polling remains compact until one final `includeReport: true` call.
- [ ] The external report remains isolated from canonical published reports.
- [ ] Invalid inputs and entitlement failures return actionable errors.
- [ ] Documentation, privacy, terms, and support URLs return `200`.
- [ ] The reviewer account instructions work from a clean browser session.

Official references:

- https://claude.com/docs/connectors/building/submission
- https://claude.com/docs/connectors/building/review-criteria
