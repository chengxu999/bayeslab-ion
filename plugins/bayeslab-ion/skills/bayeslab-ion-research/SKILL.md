---
name: bayeslab-ion-research
description: Use Bayeslab ION to find published company research, inspect industry-specific chained analysis and valuation, compare screening periods, or queue an isolated paid company analysis. Trigger for requests that mention Bayeslab, ION, an ION report, ION methodology, ION valuation, ION period history, or running a company through ION.
---

# Bayeslab ION Research

Use the Bayeslab ION MCP tools as a structured research system. Distinguish
published, reviewed ION output from a newly requested external analysis job.

## Choose The Workflow

### Published research

Use this path when the user asks what ION already says about a company.

1. Resolve the company with `list_companies` or `get_company_overview`.
2. Read `periodStage` as the current screening status for the selected period.
3. Use `get_company_analysis` for the chained L1/L2 report.
4. Use `get_company_addons` only when governance or beneficial ownership detail
   is relevant.
5. Use `get_company_period_history` for change over time.
6. State the period and distinguish ION conclusions from your own inference.

Do not treat deprecated `overallStatus` or `finalVerdict` fields as the source
of truth. A manual Good Idea designation is editorial judgment and is separate
from the automated valuation score.

### Industry context

Use `list_categories` to resolve the category slug, then
`get_category_methodology` to explain the industry's decision rules. Do not
claim access to Bayeslab's private prompt text.

### New analysis

`create_analysis_job` is a paid action that consumes usage credits. Before
calling it:

1. Resolve and show the exact ticker, company name, industry slug, and optional
   notes.
2. Explain that the run creates a new isolated result and places an initial
   credit reservation. The final charge follows actual provider usage and may
   exceed the initial reservation when sufficient credits remain.
3. Obtain explicit user approval for the credit-consuming action.

Never infer approval from a request to read, compare, or summarize an existing
report. Never submit duplicate jobs to speed up a run. External analysis never
refreshes or overwrites canonical published ION reports.

After creation, preserve the returned job ID. Poll `get_analysis_job` with
`includeReport` omitted or false until the status is terminal. After completion,
call `get_analysis_job_report` with offset 0. Append the returned content, then
request each `nextOffset` until `hasMore` is false. `includeReport: true` is only
a compatibility shortcut for the first page; it does not return the whole
report.

## Output Standard

For an investment readout, prefer this order:

1. Identity, industry, and screening period.
2. ION status and bottom-line conclusion.
3. Business-quality evidence.
4. Management and capital-allocation evidence.
5. Valuation assumptions, result, and safety margin.
6. Key risks, missing evidence, and unresolved questions.
7. Whether the content is a published report or an isolated external job.

Do not invent current prices, filings, citations, or financial figures that the
tool output does not provide. Keep tool polling compact and request each report
page at most once.
