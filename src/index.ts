import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import prompts from 'prompts';
import pc from 'picocolors';
import pkg from '../package.json';
import { questions } from './questions';
import { 
  checkNodeVersion,
  formatTargetDir,
  defaultTargetDir,
  pkgFromUserAgent,
  getCommand,
  render,
} from './utils';

const requiredVersion = pkg.engines.node;
const argv = minimist<{ t?: string; template?: string }>(process.argv.slice(2), { string: ['_'] });
const cwd = process.cwd();
const targetDir = formatTargetDir(argv._[0]) || defaultTargetDir;

async function init() {
  console.log();
  checkNodeVersion(requiredVersion, '@sackcloth/create-project');
  let result: prompts.Answers<'projectName' | 'overwrite' | 'overwriteChecker' | 'projectDesc' | 'needsEslint' | 'needsPrettier' | 'needsStylelint'>;
  try {
    result = await prompts(questions(targetDir), {
      onCancel: () => {
        throw new Error(pc.red('✖') + ' Operation cancelled');
      },
    });
  } catch (cancelled: any) {
    console.log();
    console.log(cancelled.message);
    process.exit(1);
  }
  const {
    projectName,
    overwrite,
    projectDesc,
    needsEslint,
    needsPrettier,
    needsStylelint,
  } = result;
  const root = path.join(cwd, projectName);
  if (fs.existsSync(root) && overwrite) {
    fs.rmSync(root, { recursive: true, force: true});
  }
  fs.mkdirSync(root, { recursive: true });
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  console.log(`\nScaffolding project in ${root}...`)
  
  await render('base', root, { projectName, projectDesc, pkgManager });

  if (needsEslint) {
    await render('eslint', root);

    if (needsPrettier) {
      await render('prettier', root);
    }
  }

  if (needsStylelint) {
    await render('stylelint', root);
  }
  console.log(pc.green(`\nDone. Now run:\n`));
  console.log(`  ${pc.bold(pc.cyan(`cd ${projectName}`))}`);
  console.log(`  ${pc.bold(pc.cyan(getCommand(pkgManager, 'install')))}`);
  console.log(`  ${pc.bold(pc.cyan(getCommand(pkgManager, 'dev')))}`);
  console.log();
}

init().catch((e) => {
  console.error(e);
});
