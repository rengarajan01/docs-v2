import {
  readFileSync, writeFileSync, existsSync,
  mkdirSync, readdirSync, statSync
} from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAIN = join(__dirname, '..');
const SDK_DATA = join(MAIN, 'sdk-data');
const LIBS = join(MAIN, 'docs', 'libraries');
const SNIPPETS = join(MAIN, 'snippets');
const DOCS_JSON = join(MAIN, 'docs.json');

// ── helpers ────────────────────────────────────────────────────────────────

function writeIfChanged(filePath, content) {
  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, 'utf8');
    if (existing === content) return false;
  }
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  return true;
}

function stripMarkdown(str = '') {
  return str
    .split('\n')[0]
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/"/g, "'")
    .substring(0, 180);
}

function sortVersionsDesc(versions) {
  return [...versions].sort((a, b) => {
    const an = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const bn = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return bn - an;
  });
}

// ── discover ───────────────────────────────────────────────────────────────

function discoverSdks() {
  const sdks = {};
  for (const name of readdirSync(SDK_DATA)) {
    const dir = join(SDK_DATA, name);
    if (!statSync(dir).isDirectory()) continue;
    sdks[name] = {};
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      const version = basename(file, '.json');
      sdks[name][version] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    }
  }
  return sdks;
}

// ── page generator ─────────────────────────────────────────────────────────

function generatePageMdx(page, pageId, sdkId, version, layoutMeta) {
  const description = stripMarkdown(page.description);

  const frontmatter = [
    '---',
    `title: "${page.title}"`,
    description ? `description: "${description}"` : null,
    'mode: "custom"',
    '---',
  ].filter(Boolean).join('\n');

  // Build page data — only include fields that have content
  const pageData = {};
  if (page.description) pageData.description = page.description;
  if (page.signature) pageData.signature = page.signature;
  if (page.constructor) pageData.constructor = page.constructor;
  if (page.parameters?.length) pageData.parameters = page.parameters;
  if (page.properties?.length) pageData.properties = page.properties;
  if (page.members?.length) pageData.members = page.members;
  if (page.kind) pageData.kind = page.kind;
  if (page.type) pageData.type = page.type;
  if (page.returns) pageData.returns = page.returns;
  if (page.throws?.length) pageData.throws = page.throws;
  if (page.examples?.length) pageData.examples = page.examples;

  // Encode < and > as unicode escapes so the MDX parser never mistakes
  // JSX-like sequences inside code example strings for actual JSX tags.
  const navJson = JSON.stringify({
    sdk: sdkId,
    version,
    label: layoutMeta.label,
    title: page.title,
    versions: layoutMeta.versions,
    currentPage: pageId,
    groups: layoutMeta.groups,
    allSdks: layoutMeta.allSdks,
    page: pageData,
  }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return [
    frontmatter,
    '',
    `import { SdkPageLayout } from '/snippets/SdkPageLayout.jsx';`,
    '',
    `export const _sdkNav = ${navJson};`,
    '',
    `<SdkPageLayout {..._sdkNav} />`,
  ].join('\n');
}

// ── sdk-meta.js generator ──────────────────────────────────────────────────

const SDK_LABELS = {
  'nextjs-auth0': 'Next.js',
  'auth0-react':  'React',
  'auth0-python': 'Python',
  'auth0-go':     'Go',
  'auth0-kotlin': 'Kotlin',
  'auth0-swift':  'Swift',
  'auth0-java':   'Java',
  'auth0-php':    'PHP',
};

// Maps SDK ID → icon filename (without extension) under docs/images/icons/{light,dark}/
// Used by SdkPageLayout for the custom sidebar SDK switcher.
const SDK_ICON_FILE = {
  'nextjs-auth0': 'nextjs',
  'auth0-react':  'react',
  'auth0-python': 'python',
  'auth0-go':     'golang',
  'auth0-kotlin': 'android',
  'auth0-swift':  'apple',
  'auth0-java':   'java',
  'auth0-php':    'php',
};

// Maps SDK ID → Mintlify icon name used in docs.json navigation (Mintlify hamburger).
// Font Awesome brand icons use the "brands/<name>" prefix; Lucide icons are plain names.
const SDK_NAV_ICON = {
  'nextjs-auth0': 'brands/node-js',
  'auth0-react':  'brands/react',
  'auth0-python': 'brands/python',
  'auth0-go':     'code',
  'auth0-kotlin': 'brands/android',
  'auth0-swift':  'brands/apple',
  'auth0-java':   'brands/java',
  'auth0-php':    'brands/php',
};

function generateSdkMeta(sdks) {
  const meta = {};
  for (const [sdkId, versions] of Object.entries(sdks)) {
    const sortedVersions = sortVersionsDesc(Object.keys(versions));
    meta[sdkId] = {
      label: SDK_LABELS[sdkId] ?? sdkId,
      icon: SDK_ICON_FILE[sdkId] ?? null,
      // Each entry carries version, status, and the first page id for deep-linking
      versions: sortedVersions.map(ver => {
        const data = versions[ver];
        const firstPageId = data.navigation?.[0]?.items?.[0]?.id ?? '';
        return {
          version: ver,
          status: data.meta?.status ?? 'active',
          landingPage: firstPageId,
        };
      }),
    };
  }

  const content = `// Auto-generated by scripts/generate-sdk-docs.mjs — do not edit manually\nexport const sdkMeta = ${JSON.stringify(meta, null, 2)};\n`;
  const outPath = join(SNIPPETS, 'sdk-meta.jsx');
  const changed = writeIfChanged(outPath, content);
  console.log(`  sdk-meta.js: ${changed ? 'updated' : 'unchanged'}`);
}

// ── nav builder ────────────────────────────────────────────────────────────

function buildNavGroups(data, sdkId, version) {
  return data.navigation.map(section => ({
    group: section.section,
    collapsed: true,
    pages: section.items.map(item => `docs/libraries/${sdkId}/${version}/${item.id}`),
  }));
}

// ── docs.json updater ──────────────────────────────────────────────────────

function updateDocsJson(allNavigation) {
  const docsJson = JSON.parse(readFileSync(DOCS_JSON, 'utf8'));

  const enLang = docsJson.navigation.languages.find(l => l.language === 'en');
  const sdksTab = enLang.tabs.find(t => t.tab === 'SDKs');

  // Keep the existing non-generated groups:
  //   group ' '   → the SDK catalog/overview landing page
  //   group 'Overview' → same, in case the script already renamed it
  //   group 'auth0-acul-js' → ACUL JS SDK (manually managed)
  const preserved = (sdksTab.groups || []).filter(
    g => g.group === ' ' || g.group === 'Overview' || g.group === 'auth0-acul-js'
  );

  // One dropdown per SDK-version — the dropdown selector becomes the version
  // switcher. No SDK switcher: each entry is labelled "SDK vX" so the user
  // picks a version, not a different SDK.
  sdksTab.dropdowns = Object.entries(allNavigation).flatMap(([sdkId, versions]) => {
    const sortedVersions = sortVersionsDesc(Object.keys(versions));
    const label = SDK_LABELS[sdkId] ?? sdkId;

    return sortedVersions.map(ver => {
      const { groups, status } = versions[ver];
      const deprecated = status === 'deprecated';
      const dropdownLabel = deprecated ? `${label} ${ver} (Deprecated)` : `${label} ${ver}`;

      const apiGroups = groups.map(g => ({
        group: g.group,
        collapsed: true,
        pages: g.pages,
      }));

      return { dropdown: dropdownLabel, icon: SDK_NAV_ICON[sdkId] ?? 'code', groups: apiGroups };
    });
  });

  // Remove the flat sdk groups added in the previous approach
  sdksTab.groups = preserved.map(g => (g.group === ' ' ? { ...g, group: 'Overview' } : g));
  delete sdksTab.anchors;

  writeFileSync(DOCS_JSON, JSON.stringify(docsJson, null, 2), 'utf8');
  console.log('  docs.json: updated');
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Scanning sdk-data/...\n');
  const sdks = discoverSdks();

  if (!Object.keys(sdks).length) {
    console.error('No SDKs found. Add JSON files to main/sdk-data/{sdk-name}/{version}.json');
    process.exit(1);
  }

  generateSdkMeta(sdks);

  // Build versions metadata for the layout sidebar (version dropdown + nav groups)
  const allVersionsMeta = {};
  for (const [sdkId, sdkVersions] of Object.entries(sdks)) {
    const sortedVersions = sortVersionsDesc(Object.keys(sdkVersions));
    allVersionsMeta[sdkId] = {
      label: SDK_LABELS[sdkId] ?? sdkId,
      icon: SDK_ICON_FILE[sdkId] ?? null,
      versions: sortedVersions.map(ver => ({
        version: ver,
        status: sdkVersions[ver].meta?.status ?? 'active',
        landingPage: sdkVersions[ver].navigation?.[0]?.items?.[0]?.id ?? '',
      })),
    };
  }

  const allNavigation = {};

  for (const [sdkId, versions] of Object.entries(sdks)) {
    console.log(`Processing ${sdkId}...`);
    allNavigation[sdkId] = {};

    for (const [version, data] of Object.entries(versions)) {
      let written = 0, skipped = 0;

      // Layout metadata passed to every page of this SDK version
      const layoutMeta = {
        label: allVersionsMeta[sdkId].label,
        versions: allVersionsMeta[sdkId].versions,
        groups: data.navigation || [],
        allSdks: Object.entries(allVersionsMeta).map(([id, meta]) => ({
          id,
          label: meta.label,
          icon: meta.icon ?? null,
          version: meta.versions[0]?.version ?? '',
          landingPage: meta.versions[0]?.landingPage ?? '',
        })),
      };

      for (const [id, page] of Object.entries(data.pages)) {
        const mdx = generatePageMdx(page, id, sdkId, version, layoutMeta);
        const filePath = join(LIBS, sdkId, version, `${id}.mdx`);
        if (writeIfChanged(filePath, mdx)) written++;
        else skipped++;
      }

      console.log(`  ${version}: ${written} written, ${skipped} unchanged`);
      allNavigation[sdkId][version] = {
        groups: buildNavGroups(data, sdkId, version),
        status: data.meta?.status ?? 'active',
      };
    }
  }

  console.log('\nUpdating docs.json...');
  updateDocsJson(allNavigation);

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
