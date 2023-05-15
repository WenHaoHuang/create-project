// import fs from 'node:fs'
// import path from 'node:path'
// import { fileURLToPath } from 'node:url'
import minimist from 'minimist';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  intro,
  outro,
  confirm,
  select,
  spinner,
  isCancel,
  cancel,
  text,
} from '@clack/prompts';
import pc from 'picocolors';

const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })
const cwd = process.cwd()

async function init() {
  console.log();
  intro(pc.inverse('create-project'));
  console.log('>>> create project -> init.', cwd, argv);
  const projectName = await text({
    message: 'Project name:',
    placeholder: 'Anonymous',
  });

  if (isCancel(projectName)) {
    cancel('Operation cancelled');
    return process.exit(0);
  }
  const s = spinner();
  s.start('Installing via npm');

  await sleep(3000);

  s.stop('Installed via npm');
  await sleep(1000);
  outro("You're all set!");
}

init().catch((e) => {
  console.error(e)
})
