import prompts from 'prompts';
import fs from 'node:fs';
import pc from 'picocolors';

export const questions = (projectName: string): Array<prompts.PromptObject> => {
  return [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: projectName,
    },
    {
      type: (prev) => (fs.existsSync(prev) ? 'confirm' : null),
      name: 'overwrite',
      message: `Target directory is not empty. Remove existing files and continue?`,
      initial: true,
    },
    {
      type: (_, { overwrite }: { overwrite?: boolean }) => {
        if (overwrite === false) {
          throw new Error(pc.red('✖') + ' Operation cancelled');
        }
        return null;
      },
      name: 'overwriteChecker',
    },
    {
      type: 'text',
      name: 'projectDesc',
      message: 'Project description:',
      initial: projectName,
    },
    {
      name: 'needsEslint',
      type: 'toggle',
      message: 'Add ESLint for code quality?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      name: 'needsPrettier',
      type: (_, { needsEslint }: { needsEslint?: boolean }) => needsEslint ? 'toggle' : null,
      message: 'Add Prettier for code formatting?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      name: 'needsStylelint',
      type: 'toggle',
      message: 'Add Stylelint for code formatting?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
  ];
};
