import semver from 'semver';
import pc from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url'
import { renderFile } from 'ejs';

export const checkNodeVersion = async (wanted: string, id: string) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      pc.red(
        `ERROR: This version of ${id} requires at least Node.js ${wanted}.\n` +
        `The current version of Node.js is ${process.version}.`
      )
    );
    process.exit(1)
  }
}

export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

export const defaultTargetDir = 'project-demo';

export function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

export function getCommand(packageManager: string, scriptName: string, args?: string) {
  if (scriptName === 'install') {
    return packageManager === 'yarn' ? 'yarn' : `${packageManager} install`
  }

  if (args) {
    return packageManager === 'npm'
      ? `npm run ${scriptName} -- ${args}`
      : `${packageManager} ${scriptName} ${args}`
  } else {
    return packageManager === 'npm' ? `npm run ${scriptName}` : `${packageManager} ${scriptName}`
  }
}

const isObject = (val: any) => val && typeof val === 'object';
const mergeArrayWithDedupe = (a: any[], b: any[]) => Array.from(new Set([...a, ...b]));
/**
 * Recursively merge the content of the new object to the existing one
 * @param {Object} target the existing object
 * @param {Object} obj the new object
 */
function deepMerge(target: any, obj: any) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal)
    } else {
      target[key] = newVal
    }
  }

  return target
}

function sortDependencies(packageJson: any) {
  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
  const sorted: {[k in any]: {[key in string]: string}} = {}

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {}

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted
  }
}

const templateRoot = path.resolve(fileURLToPath(import.meta.url), '../..', 'template');

async function renderTemplate(src: string, dest: string, context?: {projectName: string, projectDesc: string, pkgManager: string}) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    // if it's a directory, render its subdirectories and files recursively

    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      await renderTemplate(path.resolve(src, file), path.resolve(dest, file), context);
    }
    return;
  }
  const filename = path.basename(src);
  if (filename === 'package.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'));
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'));
    const pkg = sortDependencies(deepMerge(existing, newPackage));
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n');
    return
  }
  if (filename.endsWith('.ejs')) {
    const content = await renderFile(src, context, { async: true });
    fs.writeFileSync(dest.replace('.ejs', ''), content, 'utf8');
    return
  }
  fs.copyFileSync(src, dest);
}

export async function render(templateName: string, root: string, context?: {projectName: string, projectDesc: string, pkgManager: string}) {
  const templateDir = path.resolve(templateRoot, templateName);
  await renderTemplate(templateDir, root, context);
}
