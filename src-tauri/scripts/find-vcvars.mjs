/* Prints the path to a vcvars64.bat from a *complete* MSVC installation.
 *
 * Rust links through whichever Visual Studio install is newest. On this
 * machine the newest one (VS 18 Community) has the compiler but no x64
 * libraries — no VC\Tools\MSVC\<ver>\lib\x64 at all — so every link dies with
 *
 *     LINK : fatal error LNK1104: cannot open file 'msvcrt.lib'
 *
 * Rather than guessing a version, this looks for an install that actually
 * has msvcrt.lib and hands its environment script to the build wrapper.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const VSWHERE = path.join(
  process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
  'Microsoft Visual Studio', 'Installer', 'vswhere.exe',
);

function installations() {
  try {
    return execFileSync(
      VSWHERE,
      ['-all', '-products', '*', '-format', 'value', '-property', 'installationPath'],
      { encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function hasX64Libs(root) {
  const msvc = path.join(root, 'VC', 'Tools', 'MSVC');
  if (!fs.existsSync(msvc)) return false;
  try {
    return fs
      .readdirSync(msvc)
      .some((v) => fs.existsSync(path.join(msvc, v, 'lib', 'x64', 'msvcrt.lib')));
  } catch {
    return false;
  }
}

const vcvars = installations()
  .filter(hasX64Libs)
  .map((root) => path.join(root, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat'))
  .find((p) => fs.existsSync(p));

if (!vcvars) {
  console.error('');
  console.error('✗ לא נמצאה התקנת MSVC שלמה — חסר lib\\x64\\msvcrt.lib.');
  console.error('  פתח את Visual Studio Installer ← Modify ←');
  console.error('  סמן "Desktop development with C++" ← Modify.');
  console.error('');
  process.exit(1);
}

console.log(vcvars);
