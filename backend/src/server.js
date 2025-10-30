/**
 * server.js (diagnostic "doctor" + starter server)
 *
 * - Performs thorough diagnostics on backend modules (routes, controllers, models, middleware)
 * - Tries to dynamic-import modules and reports:
 * • missing files / module not found
 * • missing named exports
 * • modules that are still CommonJS (module.exports) and suggestions to convert to ESM
 * • models without default export
 * - Writes a diagnostics summary to: backend/diagnostics_report.txt
 * - Only starts the real server if diagnostics show NO fatal import errors.
 *
 * Usage: run via `npm run dev` (nodemon) as you already do.
 *
 * NOTE: This script is read-only — it will not change files.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';
import chalk from 'chalk';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..'); // backend root
const SRC = path.join(ROOT, 'src');

const reportPath = path.join(ROOT, 'diagnostics_report.txt');
const reportLines = [];

function log(s) {
  console.log(s);
  reportLines.push(stripAnsi(String(s)));
}
function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listJsFiles(dir) {
  const out = [];
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) {
        out.push(...await listJsFiles(full));
      } else if (it.isFile() && (it.name.endsWith('.js') || it.name.endsWith('.mjs'))) {
        out.push(full);
      }
    }
  } catch (e) {
    // ignore
  }
  return out;
}

async function tryImport(filePath) {
  // filePath is absolute path
  try {
    const url = pathToFileURL(filePath).href;
    const mod = await import(url);
    return { ok: true, module: mod };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function analyzeImportError(err) {
  const msg = err && err.message ? err.message : String(err);
  if (msg.includes('ERR_MODULE_NOT_FOUND') || msg.includes('Cannot find module')) {
    return { type: 'MODULE_NOT_FOUND', msg };
  }
  if (msg.includes('does not provide an export named')) {
    return { type: 'MISSING_NAMED_EXPORT', msg };
  }
  if (msg.includes('SyntaxError') && msg.includes('Unexpected token')) {
    return { type: 'CJS_SYNTAX', msg };
  }
  return { type: 'OTHER', msg };
}

async function diagnosticScan() {
  log(chalk.yellow('--- Backend Diagnostics Start ---'));
  log(`Backend root: ${ROOT}`);
  log(`Running checks on: ${SRC}`);
  log('');

  // 1) Check expected directories exist
  const expectedDirs = ['routes', 'controllers', 'models', 'middleware'];
  for (const d of expectedDirs) {
    const p = path.join(SRC, d);
    const ok = await exists(p);
    log(ok ? chalk.green(`Found: src/${d}`) : chalk.red(`Missing: src/${d} — expected directory`));
  }
  log('');

  // 2) Scan routes and try to import each route file (so we catch missing imports early)
  const routesDir = path.join(SRC, 'routes');
  if (!await exists(routesDir)) {
    log(chalk.red('No routes directory — skipping route checks.'));
  } else {
    const routeFiles = await listJsFiles(routesDir);
    log(chalk.cyan(`Checking ${routeFiles.length} route files under src/routes...`));
    for (const rf of routeFiles) {
      const rel = path.relative(ROOT, rf);
      log(chalk.blue(`\n→ Checking route: ${rel}`));
      const result = await tryImport(rf);
      if (result.ok) {
        const names = Object.keys(result.module);
        log(chalk.green(`  imported OK — exports: ${names.length ? names.join(', ') : '(none/default-export)'}`));
        // if module only has default but not named, note it
        if (names.length === 0 && result.module.default) {
          log(chalk.yellow(`  note: file exports default only.`));
        }
      } else {
        const info = analyzeImportError(result.error);
        if (info.type === 'MODULE_NOT_FOUND') {
          log(chalk.red(`  ERROR: Module not found or dependency missing.`));
          log(chalk.red(`  Node message: ${result.error.message}`));
          log(chalk.yellow(`  Suggestion: Ensure file exists and uses ESM exports (export / export default).`));
        } else if (info.type === 'MISSING_NAMED_EXPORT') {
          log(chalk.red(`  ERROR: Missing named export referenced by importer.`));
          log(chalk.red(`  Node message: ${result.error.message}`));
          log(chalk.yellow(`  Suggestion: Check the module file and add the named export or adjust importer to use available export names.`));
        } else if (info.type === 'CJS_SYNTAX') {
          log(chalk.red(`  ERROR: Looks like CommonJS syntax or invalid JS syntax.`));
          log(chalk.red(`  Node message: ${result.error.message}`));
          log(chalk.yellow(`  Suggestion: Convert CommonJS (require/module.exports) to ESM (import / export) or adjust package.json.`));
        } else {
          log(chalk.red(`  ERROR: ${result.error.message}`));
        }
      }
    }
  }

  // 3) Scan controllers and list their named exports
  const ctrlDir = path.join(SRC, 'controllers');
  if (!await exists(ctrlDir)) {
    log(chalk.red('No controllers directory — skipping controllers checks.'));
  } else {
    const controllerFiles = await listJsFiles(ctrlDir);
    log(chalk.cyan(`\nChecking ${controllerFiles.length} controller files under src/controllers...`));
    for (const cf of controllerFiles) {
      const rel = path.relative(ROOT, cf);
      log(chalk.blue(`\n→ Controller: ${rel}`));
      const result = await tryImport(cf);
      if (result.ok) {
        const names = Object.keys(result.module);
        log(chalk.green(`  exports: ${names.length ? names.join(', ') : '(none/default-export)'}`));
      } else {
        const info = analyzeImportError(result.error);
        log(chalk.red(`  ERROR importing controller: ${info.msg}`));
        if (info.type === 'CJS_SYNTAX') {
          log(chalk.yellow('  Suggestion: convert controller module to ESM (use `export const fn = ...` or `export default`).'));
        } else if (info.type === 'MISSING_NAMED_EXPORT') {
          log(chalk.yellow('  Suggestion: check which named exports are expected by routes, and export them.'));
        }
      }
    }
  }

  // 4) Scan models and check for default export (models should usually export default)
  const modelsDir = path.join(SRC, 'models');
  if (!await exists(modelsDir)) {
    log(chalk.red('No models directory — skipping models checks.'));
  } else {
    const modelFiles = await listJsFiles(modelsDir);
    log(chalk.cyan(`\nChecking ${modelFiles.length} model files under src/models...`));
    for (const mf of modelFiles) {
      const rel = path.relative(ROOT, mf);
      log(chalk.blue(`\n→ Model: ${rel}`));
      const result = await tryImport(mf);
      if (result.ok) {
        if (result.module && result.module.default) {
          log(chalk.green('  OK: default export found (model exported as default).'));
        } else {
          const names = Object.keys(result.module);
          log(chalk.yellow(`  Warning: no default export. Named exports: ${names.join(', ') || '(none)'}`));
          log(chalk.yellow('  Suggestion: export default the mongoose model (export default Model).'));
        }
      } else {
        const info = analyzeImportError(result.error);
        log(chalk.red(`  ERROR importing model: ${info.msg}`));
      }
    }
  }

  // 5) Scan middleware and show exports
  const mwDir = path.join(SRC, 'middleware');
  if (!await exists(mwDir)) {
    log(chalk.red('No middleware directory — skipping middleware checks.'));
  } else {
    const mwFiles = await listJsFiles(mwDir);
    log(chalk.cyan(`\nChecking ${mwFiles.length} middleware files under src/middleware...`));
    for (const wf of mwFiles) {
      const rel = path.relative(ROOT, wf);
      log(chalk.blue(`\n→ Middleware: ${rel}`));
      const result = await tryImport(wf);
      if (result.ok) {
        const names = Object.keys(result.module);
        log(chalk.green(`  exports: ${names.length ? names.join(', ') : '(none/default)'}`));
        if (!names.includes('default') && names.length === 0) {
          log(chalk.yellow('  Note: module may export via module.exports (CommonJS) — consider converting to ESM.'));
        }
      } else {
        const info = analyzeImportError(result.error);
        log(chalk.red(`  ERROR importing middleware: ${info.msg}`));
      }
    }
  }

  // 6) Quick cross-check: check src/routes/admin referenced files exist
  const adminRoutesDir = path.join(SRC, 'routes', 'admin');
  if (await exists(adminRoutesDir)) {
    const adminFiles = await fs.readdir(adminRoutesDir);
    log(chalk.cyan(`\nAdmin routes present: ${adminFiles.join(', ')}`));
  }

  // Summarize
  log('');
  log(chalk.yellow('--- Diagnostics completed. Writing report...'));
  await fs.writeFile(reportPath, reportLines.join('\n'), 'utf8');
  log(chalk.green(`Diagnostics written to ${reportPath}`));
}

// FINAL CORRECTED VERSION
(async () => {
  try {
    await diagnosticScan();
  } catch (err) {
    console.error('Diagnostics failed with error:', err);
    process.exit(1); // Exit if the scan itself fails
  }

  // After diagnostics, decide whether to start server.
  const reportText = fsSync.readFileSync(reportPath, 'utf8');

  // This is the specific, correct check that will ignore file names and only find real errors.
  const hasError = /ERROR:|does not provide an export named|Module not found/i.test(reportText);

  if (hasError) {
    console.log(chalk.red.bold('\nOne or more issues detected. Server will NOT start until you fix reported errors.\n'));
    console.log(chalk.yellow('Open backend/diagnostics_report.txt for details.\n'));
    process.exit(1);
  }

  // If no error -> start the real server (basic setup)
  console.log(chalk.green.bold('\n🚀 Server diagnostics passed. Starting server...'));

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Basic middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // lightweight welcome route
  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

  app.listen(PORT, () => {
    console.log(chalk.green.bold(`\n✅ Server is live and listening on port ${PORT}`));
  });
})();
