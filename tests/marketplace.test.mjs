import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const endpoint = "https://mcp.bayeslab.xyz/api/mcp";

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function assertFile(relativePath) {
  const value = await stat(path.join(root, relativePath));
  assert.equal(value.isFile(), true, `${relativePath} must be a file`);
}

async function readPngSize(relativePath) {
  const value = await readFile(path.join(root, relativePath));
  assert.equal(value.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: value.readUInt32BE(16),
    height: value.readUInt32BE(20),
  };
}

test("publishes one installable Bayeslab marketplace entry", async () => {
  const marketplace = await readJson(".agents/plugins/marketplace.json");

  assert.equal(marketplace.name, "bayeslab");
  assert.deepEqual(marketplace.plugins, [
    {
      name: "bayeslab-ion",
      source: { source: "local", path: "./plugins/bayeslab-ion" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Finance",
    },
  ]);
});

test("publishes one installable Claude marketplace entry", async () => {
  const marketplace = await readJson(".claude-plugin/marketplace.json");

  assert.equal(marketplace.name, "bayeslab");
  assert.equal(
    marketplace.description,
    "Bayeslab investment-research plugins for Claude."
  );
  assert.deepEqual(marketplace.owner, {
    name: "Bayeslab",
    email: "support@bayeslab.xyz",
  });
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, "bayeslab-ion");
  assert.equal(marketplace.plugins[0].source, "./plugins/bayeslab-ion");
  assert.equal(marketplace.plugins[0].version, "0.1.0");
  assert.equal(marketplace.plugins[0].license, "MIT");
  assert.equal(marketplace.plugins[0].category, "Finance");
});

test("plugin manifest points only to packaged content", async () => {
  const relativeRoot = "plugins/bayeslab-ion";
  const manifest = await readJson(`${relativeRoot}/.codex-plugin/plugin.json`);

  assert.equal(manifest.name, "bayeslab-ion");
  assert.equal(manifest.version, "0.1.0");
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.skills, "./skills/");
  assert.equal(manifest.mcpServers, "./.mcp.json");
  assert.equal(manifest.interface.displayName, "Bayeslab ION");
  assert.equal(manifest.interface.category, "Finance");
  assert.deepEqual(manifest.interface.capabilities, ["Interactive", "Read", "Write"]);
  assert.equal(manifest.interface.websiteURL, "https://bayeslab.xyz/");
  assert.equal(manifest.interface.privacyPolicyURL, "https://bayeslab.xyz/privacy");
  assert.equal(manifest.interface.termsOfServiceURL, "https://bayeslab.xyz/terms");
  assert.equal(manifest.interface.composerIcon, "./assets/bayeslab-ion-small.png");
  assert.equal(manifest.interface.logo, "./assets/bayeslab-ion.png");

  await assertFile(`${relativeRoot}/.mcp.json`);
  await assertFile(`${relativeRoot}/skills/bayeslab-ion-research/SKILL.md`);
  assert.deepEqual(
    await readPngSize(`${relativeRoot}/assets/bayeslab-ion.png`),
    { width: 360, height: 360 }
  );
  assert.deepEqual(
    await readPngSize(`${relativeRoot}/assets/bayeslab-ion-small.png`),
    { width: 64, height: 64 }
  );
});

test("Claude plugin reuses the packaged skill and MCP configuration", async () => {
  const relativeRoot = "plugins/bayeslab-ion";
  const manifest = await readJson(`${relativeRoot}/.claude-plugin/plugin.json`);

  assert.equal(manifest.name, "bayeslab-ion");
  assert.equal(manifest.version, "0.1.0");
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.homepage, "https://bayeslab.xyz/agents/claude");
  assert.equal(manifest.repository, "https://github.com/chengxu999/bayeslab-ion");
  await assertFile(`${relativeRoot}/.mcp.json`);
  await assertFile(`${relativeRoot}/skills/bayeslab-ion-research/SKILL.md`);
});

test("plugin connects to the canonical production MCP resource", async () => {
  const config = await readJson("plugins/bayeslab-ion/.mcp.json");

  assert.deepEqual(config, {
    mcpServers: {
      "bayeslab-ion": {
        type: "http",
        url: endpoint,
      },
    },
  });
});

test("skill distinguishes report reads from credit-consuming analysis", async () => {
  const skill = await readText(
    "plugins/bayeslab-ion/skills/bayeslab-ion-research/SKILL.md"
  );

  assert.match(skill, /^---\nname: bayeslab-ion-research\n/m);
  assert.match(skill, /published ION report/i);
  assert.match(skill, /explicit user approval/i);
  assert.match(skill, /consumes usage credits/i);
  assert.match(
    skill,
    /never\s+refreshes or overwrites canonical published ION reports/i
  );
  assert.match(skill, /includeReport/i);
});

test("public docs cover Codex marketplace and Claude connector setup", async () => {
  const readme = await readText("README.md");
  const claude = await readText("docs/claude-connector.md");

  assert.match(readme, /codex plugin marketplace add chengxu999\/bayeslab-ion --ref main/);
  assert.match(readme, /codex plugin add bayeslab-ion@bayeslab/);
  assert.match(readme, /claude plugin marketplace add chengxu999\/bayeslab-ion/);
  assert.match(readme, /claude plugin install bayeslab-ion@bayeslab/);
  assert.match(readme, new RegExp(endpoint.replaceAll("/", "\\/")));
  assert.match(claude, /Customize > Connectors/);
  assert.match(claude, /claude plugin marketplace add chengxu999\/bayeslab-ion/);
  assert.match(claude, /claude mcp add --transport http bayeslab-ion/);
  assert.match(claude, new RegExp(endpoint.replaceAll("/", "\\/")));
});

test("distribution files contain no committed credentials or legacy endpoint", async () => {
  const files = [
    "README.md",
    "docs/claude-connector.md",
    ".claude-plugin/marketplace.json",
    "plugins/bayeslab-ion/README.md",
    "plugins/bayeslab-ion/.claude-plugin/plugin.json",
    "plugins/bayeslab-ion/.mcp.json",
    "plugins/bayeslab-ion/skills/bayeslab-ion-research/SKILL.md",
  ];
  const content = (await Promise.all(files.map(readText))).join("\n");

  assert.doesNotMatch(content, /github_pat_|ghp_|sk_(?:test|live)_|gk_secret_|gist_/);
  assert.doesNotMatch(content, /screener\.manus\.space/);
});

test("Claude directory listing is complete and within portal limits", async () => {
  const listing = await readJson("docs/claude-directory-listing.json");
  const expectedTools = [
    "create_analysis_job",
    "get_analysis_job",
    "get_category_methodology",
    "get_company_addons",
    "get_company_analysis",
    "get_company_l3",
    "get_company_overview",
    "get_company_period_history",
    "get_project_info",
    "list_analysis_jobs",
    "list_categories",
    "list_companies",
    "list_periods",
  ];

  assert.equal(listing.name, "Bayeslab ION");
  assert.ok(listing.name.length <= 100);
  assert.ok(listing.tagline.length <= 55);
  assert.ok(listing.description.length <= 2000);
  assert.equal(listing.slug, "bayeslab-ion");
  assert.equal(listing.server.url, endpoint);
  assert.equal(listing.server.transport, "streamable-http");
  assert.equal(listing.server.authentication, "oauth-2.1-pkce-dcr");
  assert.equal(listing.documentationUrl, "https://bayeslab.xyz/agents/claude");
  assert.equal(listing.privacyPolicyUrl, "https://bayeslab.xyz/privacy");
  assert.equal(listing.supportContact, "support@bayeslab.xyz");
  assert.ok(listing.useCases.length >= 3);
  assert.deepEqual(
    [...listing.tools.readOnly, ...listing.tools.write].sort(),
    expectedTools.sort()
  );
  assert.deepEqual(listing.tools.write, ["create_analysis_job"]);
  await assertFile(listing.iconPath);
});
