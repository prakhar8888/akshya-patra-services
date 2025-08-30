#!/usr/bin/env node
/**
 * deep_analyzer.js
 * Single-file project auditor for HRMS (static + optional dynamic checks)
 *
 * Usage:
 *   node deep_analyzer.js            # static analysis; creates project_analysis.md
 *   node deep_analyzer.js --dynamic  # static + runtime GET probes to localhost
 *
 * Run this in your project root (where frontend/ and backend/ live).
 */

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const mustInstall = (pkg) => {
  try { require.resolve(pkg); return false; } catch { return true; }
};

const deps = ['fast-glob', '@babel/parser', '@babel/traverse', 'axios', 'chalk@4'];
const missing = deps.filter(mustInstall);

if (missing.length) {
  console.log(`⚠️ Missing packages detected: ${missing.join(', ')}`);
  console.log('Attempting to install them now (this may take a minute)...');
  try {
    child_process.execSync(`npm install --no-audit --no-fund ${missing.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed.');
  } catch (e) {
    console.error('❌ Auto-install failed. Please run manually:');
    console.error(`npm install ${missing.join(' ')}`);
    process.exit(1);
  }
}

/* now require deps */
const fg = require('fast-glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const axios = require('axios');
const chalk = require('chalk');

const ARGS = process.argv.slice(2);
const DO_DYNAMIC = ARGS.includes('--dynamic');
const ROOT = process.cwd();
const OUTFILE = path.join(ROOT, 'project_analysis.md');

const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const SCAN_PATTERNS = ['**/*.{js,jsx,ts,tsx,html,css,json}'];
const IGNORE = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/.next/**'];

// Helpers
const read = (p) => fs.readFileSync(p, 'utf8');
const isCode = (p) => CODE_EXTS.includes(path.extname(p).toLowerCase());

function resolveRelativeImport(fromFile, imp) {
  // Only resolve relative imports (./ ../)
  if (!imp.startsWith('.')) return { type: 'external', target: imp };
  const base = path.resolve(path.dirname(fromFile), imp);
  const tries = [
    base,
    base + '.js', base + '.ts', base + '.jsx', base + '.tsx',
    path.join(base, 'index.js'), path.join(base, 'index.ts'),
    path.join(base, 'index.jsx'), path.join(base, 'index.tsx')
  ];
  for (const t of tries) {
    if (fs.existsSync(t) && fs.statSync(t).isFile()) {
      return { type: 'file', target: path.relative(ROOT, t) };
    }
  }
  return { type: 'missing', target: imp };
}

function safeParse(content, filePath) {
  try {
    return parser.parse(content, {
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'classProperties', 'dynamicImport', 'decorators-legacy']
    });
  } catch (err) {
    return { parseError: err.message };
  }
}

function collectImportsExportsAst(ast) {
  const imports = []; // {source, specifiers: [{imported, local, type}]}
  const requires = []; // strings
  const exports = []; // names, 'default' for default export
  const routeCalls = []; // {method, pathLiteral, loc}
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      const specifiers = path.node.specifiers.map(s => {
        if (s.type === 'ImportDefaultSpecifier') return { imported: 'default', local: s.local.name, type: 'default' };
        if (s.type === 'ImportNamespaceSpecifier') return { imported: '*', local: s.local.name, type: 'namespace' };
        if (s.type === 'ImportSpecifier') return { imported: s.imported.name, local: s.local.name, type: 'named' };
        return { imported: '?', local: s.local && s.local.name, type: s.type };
      });
      imports.push({ source, specifiers });
    },
    CallExpression(path) {
      const callee = path.node.callee;
      // require('x')
      if (callee && callee.type === 'Identifier' && callee.name === 'require') {
        const arg = path.node.arguments[0];
        if (arg && arg.type === 'StringLiteral') requires.push(arg.value);
      }
      // detect express routes: app.get('/path', ...), router.post(...)
      if (callee && callee.type === 'MemberExpression') {
        const prop = callee.property && (callee.property.name || callee.property.value);
        const obj = callee.object;
        if (prop && obj) {
          const methods = ['get','post','put','delete','patch','all','options','use'];
          const lower = String(prop).toLowerCase();
          if (methods.includes(lower)) {
            const firstArg = path.node.arguments[0];
            let pathStr = null;
            if (firstArg && firstArg.type === 'StringLiteral') pathStr = firstArg.value;
            routeCalls.push({ method: lower, path: pathStr, loc: path.node.loc });
          }
        }
      }
    },
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        const decl = path.node.declaration;
        if (decl.type === 'VariableDeclaration') {
          decl.declarations.forEach(d => { if (d.id && d.id.name) exports.push(d.id.name); });
        } else if (decl.id && decl.id.name) {
          exports.push(decl.id.name);
        }
      }
      if (path.node.specifiers && path.node.specifiers.length) {
        path.node.specifiers.forEach(s => exports.push(s.exported ? s.exported.name : (s.local && s.local.name)));
      }
    },
    ExportDefaultDeclaration(path) {
      exports.push('default');
    }
  });
  return { imports, requires, exports, routeCalls };
}

function buildGraph(allFilesData) {
  const nodes = Object.keys(allFilesData);
  const edges = {}; // from -> [to]
  const incoming = {};
  nodes.forEach(n => { edges[n] = []; incoming[n] = new Set(); });
  const missing = [];
  nodes.forEach(n => {
    const info = allFilesData[n];
    const allSources = (info.imports || []).map(i => i.source).concat(info.requires || []);
    allSources.forEach(src => {
      const res = resolveRelativeImport(path.join(ROOT, n), src);
      if (res.type === 'file') {
        edges[n].push(res.target);
        incoming[res.target].add(n);
      } else if (res.type === 'missing') {
        missing.push({ from: n, import: src });
      } // external -> skip
    });
  });
  return { edges, incoming, missing };
}

function detectCycles(edges) {
  const visited = new Set();
  const stack = new Set();
  const cycles = [];
  function dfs(node, pathArr) {
    if (stack.has(node)) {
      const idx = pathArr.indexOf(node);
      cycles.push(pathArr.slice(idx).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    (edges[node] || []).forEach(child => dfs(child, pathArr.concat(child)));
    stack.delete(node);
  }
  Object.keys(edges).forEach(n => {
    if (!visited.has(n)) dfs(n, [n]);
  });
  return cycles;
}

function findOrphans(incoming, entryCandidates = ['index.js','server.js','app.js','src/index.js','backend/server.js']) {
  const orphans = [];
  Object.keys(incoming).forEach(f => {
    if ((incoming[f] && incoming[f].size === 0) && !entryCandidates.some(e => f.endsWith(e))) {
      orphans.push(f);
    }
  });
  return orphans;
}

function findUnusedExports(allFilesData, importMap /* map of imported name uses */) {
  const unused = [];
  Object.entries(allFilesData).forEach(([file, info]) => {
    const exported = info.exports || [];
    exported.forEach(name => {
      // 'default' is fuzzy; skip it for unused detection
      if (name === 'default') return;
      const key = `${file}::${name}`;
      if (!importMap.has(key)) unused.push({ file, export: name });
    });
  });
  return unused;
}

async function dynamicProbeRoute(url) {
  try {
    const r = await axios.get(url, { timeout: 3000 });
    return { ok: true, status: r.status, dataSample: typeof r.data === 'string' ? r.data.slice(0,200) : JSON.stringify(r.data).slice(0,400) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log(chalk.cyan('🔍 Deep Analyzer starting — scanning files... (this might take a bit)'));

  // collect files
  const pattern = SCAN_PATTERNS;
  const paths = await fg(pattern, { cwd: ROOT, dot: true, ignore: IGNORE, absolute: true });
  const relPaths = paths.map(p => path.relative(ROOT, p));
  // build data per-file for code files
  const allFilesData = {}; // key: relative path
  for (const abs of paths) {
    const rel = path.relative(ROOT, abs);
    let content = '';
    try { content = fs.readFileSync(abs, 'utf8'); } catch(e) { allFilesData[rel] = { error: 'read_error:'+e.message }; continue; }
    const lines = content.split('\n').length;
    const obj = { lines, imports: [], requires: [], exports: [], parseError: null, routeCalls: [] };
    if (isCode(abs)) {
      const astOrErr = safeParse(content, rel);
      if (astOrErr.parseError) {
        obj.parseError = astOrErr.parseError;
      } else {
        const { imports, requires, exports, routeCalls } = collectImportsExportsAst(astOrErr);
        obj.imports = imports;
        obj.requires = requires;
        obj.exports = exports;
        obj.routeCalls = routeCalls;
      }
    }
    allFilesData[rel] = obj;
  }

  // Build dependency graph
  const { edges, incoming, missing } = buildGraph(allFilesData);
  const cycles = detectCycles(edges);
  const orphans = findOrphans(incoming);

  // Build import usage map to detect unused exported names
  // Map exported key -> used bool. Key form: 'file::name'
  const importUsage = new Map();
  Object.entries(allFilesData).forEach(([file, info]) => {
    (info.imports || []).forEach(imp => {
      imp.specifiers.forEach(spec => {
        if (spec.imported && spec.imported !== 'default' && spec.imported !== '*') {
          // resolve import to file if relative
          const res = resolveRelativeImport(path.join(ROOT,file), imp.source);
          if (res.type === 'file') {
            const key = `${res.target}::${spec.imported}`;
            importUsage.set(key, true);
          }
        }
      });
    });
    (info.requires || []).forEach(rsrc => {
      // ignore requires for named usage detection (hard)
    });
  });
  const unusedExports = findUnusedExports(allFilesData, importUsage);

  // Routes: collect all route entries
  const routes = [];
  Object.entries(allFilesData).forEach(([file, info]) => {
    (info.routeCalls || []).forEach(rc => {
      routes.push({ file, method: rc.method, path: rc.path || '(dynamic/unknown)' });
    });
  });

  // Package script summary
  const packages = [];
  ['package.json', 'frontend/package.json', 'backend/package.json'].forEach(p => {
    const full = path.join(ROOT, p);
    if (fs.existsSync(full)) {
      try {
        const pj = JSON.parse(fs.readFileSync(full, 'utf8'));
        packages.push({ path: p, scripts: pj.scripts || {}, name: pj.name || null });
      } catch(e) {
        packages.push({ path: p, error: 'invalid_json' });
      }
    }
  });

  // Dynamic checks (if requested)
  const dynamicResults = [];
  if (DO_DYNAMIC) {
    console.log(chalk.yellow('⚡ Running dynamic probes (GET requests) to common local ports and discovered GET routes...'));
    // try common ports and endpoints
    const ports = [3000,3001,3002,4000,5000,8080];
    const endpoints = ['/', '/health', '/api/health', '/ping', '/api/ping'];
    for (const port of ports) {
      for (const ep of endpoints) {
        const url = `http://localhost:${port}${ep}`;
        try {
          const res = await axios.get(url, { timeout: 2000 });
          dynamicResults.push({ url, ok: true, status: res.status });
        } catch (err) {
          dynamicResults.push({ url, ok: false, error: err.code || err.message });
        }
      }
    }
    // Probe discovered routes (GET only)
    for (const r of routes) {
      if (r.method === 'get' && r.path && r.path.startsWith('/')) {
        // try on ports above
        const probes = [];
        for (const port of ports) {
          const url = `http://localhost:${port}${r.path}`;
          try {
            const res = await axios.get(url, { timeout: 2000 });
            probes.push({ url, ok: true, status: res.status });
          } catch (err) {
            probes.push({ url, ok: false, error: err.code || err.message });
          }
        }
        dynamicResults.push({ route: r, probes });
      }
    }
  }

  // Compose markdown report
  const lines = [];
  lines.push(`# Project Deep Analysis Report`);
  lines.push(`**Root:** \`${ROOT}\``);
  lines.push(`**Scanned files:** ${relPaths.length}`);
  lines.push(`**Code files parsed:** ${Object.keys(allFilesData).filter(f => isCode(path.join(ROOT,f))).length}`);
  lines.push('');
  lines.push(`---`);
  lines.push(`## 1) package.json summary`);
  packages.forEach(p => {
    if (p.error) lines.push(`- ${p.path}: ⚠️ invalid JSON`);
    else {
      lines.push(`- ${p.path} ${p.name ? `(${p.name})` : ''}`);
      const s = p.scripts;
      if (s && Object.keys(s).length) {
        Object.entries(s).forEach(([k,v]) => lines.push(`  - script: \`${k}\` -> "${v}"`));
      } else lines.push('  - no scripts found');
    }
  });
  lines.push('');
  lines.push('---');
  lines.push('## 2) File tree (all scanned files)');
  lines.push('```');
  relPaths.forEach(r => lines.push(r));
  lines.push('```');

  lines.push('');
  lines.push('---');
  lines.push('## 3) Per-file summary (lines, imports, parse errors)');
  Object.entries(allFilesData).forEach(([file, info]) => {
    lines.push(`### ${file}`);
    lines.push(`- Lines: ${info.lines}`);
    if (info.parseError) lines.push(`- Parse error: ${info.parseError}`);
    if ((info.imports || []).length) {
      lines.push(`- import statements:`);
      info.imports.forEach(im => {
        const specs = (im.specifiers || []).map(s => `${s.type}:${s.local}${s.imported && s.imported !== 'default' ? `(${s.imported})` : ''}`).join(', ');
        lines.push(`  - from \`${im.source}\` — ${specs || '(no specifiers)'}`);
      });
    }
    if ((info.requires || []).length) {
      lines.push(`- requires: ${info.requires.map(r=>`"${r}"`).join(', ')}`);
    }
    if ((info.exports || []).length) lines.push(`- exports: ${info.exports.join(', ')}`);
    if ((info.routeCalls || []).length) {
      lines.push(`- detected route calls (${info.routeCalls.length}):`);
      info.routeCalls.forEach(rc => lines.push(`  - method: ${rc.method} path: ${rc.path || '(dynamic/unknown)'}`));
    }
    lines.push('');
  });

  lines.push('---');
  lines.push('## 4) Missing relative imports (unresolved)');
  if (missing.length) {
    missing.forEach(m => lines.push(`- File \`${m.from}\` imports '${m.import}' but target file not found (relative resolution failed)`));
  } else lines.push('- ✅ No obvious missing relative imports detected.');

  lines.push('');
  lines.push('---');
  lines.push('## 5) Circular dependencies (cycles)');
  if (cycles.length) {
    cycles.forEach((c, idx) => lines.push(`- Cycle #${idx+1}: ${c.join(' -> ')}`));
  } else lines.push('- ✅ No cycles detected (good!).');

  lines.push('');
  lines.push('---');
  lines.push('## 6) Orphaned files (no incoming imports, not common entry files)');
  if (orphans.length) {
    orphans.forEach(o => lines.push(`- ${o}`));
  } else lines.push('- none found.');

  lines.push('');
  lines.push('---');
  lines.push('## 7) Possibly unused exports (heuristic)');
  if (unusedExports.length) {
    unusedExports.forEach(u => lines.push(`- ${u.file} -> exported '${u.export}' not imported anywhere (heuristic)`));
  } else lines.push('- none flagged.');

  lines.push('');
  lines.push('---');
  lines.push('## 8) Express routes discovered (file | method | path)');
  if (routes.length) {
    routes.forEach(r => lines.push(`- ${r.file} | ${r.method.toUpperCase()} | ${r.path}`));
  } else lines.push('- none discovered via AST heuristics.');

  if (DO_DYNAMIC) {
    lines.push('');
    lines.push('---');
    lines.push('## 9) Dynamic probe results (GET-only probes)');
    dynamicResults.forEach(dr => {
      if (dr.url) {
        lines.push(`- ${dr.url} => ${dr.ok ? `OK (${dr.status})` : `ERROR (${dr.error})`}`);
      } else if (dr.route) {
        lines.push(`- route ${dr.route.method.toUpperCase()} ${dr.route.path} (probes:)`);
        dr.probes.forEach(p => lines.push(`    - ${p.url} => ${p.ok ? `OK (${p.status})` : `ERR (${p.error})`}`));
      }
    });
  } else {
    lines.push('');
    lines.push('---');
    lines.push('## 9) Dynamic probes skipped');
    lines.push('Run with `node deep_analyzer.js --dynamic` to perform GET probes on localhost common ports and discovered GET routes.');
  }

  lines.push('');
  lines.push('---');
  lines.push('## 10) Quick recommended next steps (automated hints)');
  lines.push('- Fix missing relative imports listed above.');
  lines.push('- Open cycle traces and restructure imports (break circular dep by extracting shared util).');
  lines.push('- Check orphan files: if they are meant to be used, verify imports; otherwise archive/remove them.');
  lines.push('- For parse errors, open the file and run a linter or check TS config.');
  lines.push('- If dynamic probes fail but your services should be running, ensure env variables (DB, API keys) are set and start the server in dev mode first.\n');

  lines.push('');
  lines.push('---\n_Report generated by deep_analyzer.js_');

  // Write file
  fs.writeFileSync(OUTFILE, lines.join('\n'), 'utf8');
  console.log(chalk.green(`\n✅ Analysis complete. Report saved: ${OUTFILE}`));
  console.log(chalk.gray('Tip: open the markdown, and paste it into Gemini or share with me.'));

  // Also print a short summary to terminal
  console.log(chalk.blue(`\nSummary:`));
  console.log(`- Files scanned: ${relPaths.length}`);
  console.log(`- Code files parsed: ${Object.keys(allFilesData).filter(f => isCode(path.join(ROOT,f))).length}`);
  console.log(`- Missing imports: ${missing.length}`);
  console.log(`- Cycles found: ${cycles.length}`);
  console.log(`- Orphans: ${orphans.length}`);
  console.log(`- Unused export hints: ${unusedExports.length}`);
  if (DO_DYNAMIC) console.log(`- Dynamic probes performed: ${dynamicResults.length}`);
}

main().catch(err => {
  console.error('Fatal error in analyzer:', err);
  process.exit(1);
});
