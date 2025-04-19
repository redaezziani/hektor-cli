import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import ora from 'ora';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { sleep } from '../utils/helpers.js';
import { GENERATOR_TYPES } from '../constants/generator-types.js';

export async function generate(options) {
  console.log(gradient.pastel.multiline('🚀 Hektor Generate Tool 🚀\n'));
  
  let { type, name } = options;
  
  if (!GENERATOR_TYPES.includes(type)) {
    const typeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to generate?',
        choices: GENERATOR_TYPES,
      }
    ]);
    type = typeAnswer.type;
  }
  
  if (!name) {
    const nameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `Enter a name for your new ${type}:`,
        validate: (input) => input.trim() !== '' ? true : 'Name cannot be empty'
      }
    ]);
    name = nameAnswer.name;
  }
  
  const animation = chalkAnimation.pulse(`Generating ${type}: ${name}`);
  await sleep(1500);
  animation.stop();
  
  const spinner = ora({
    text: `Scaffolding ${chalk.cyan(type)}: ${chalk.green(name)}...`,
    color: 'green',
  }).start();
  
  await sleep(2000);
  
  spinner.succeed(`${chalk.green.bold(type)} created successfully!`);
  
  const summary = boxen(
    `${chalk.bold('Generation Summary')}\n\n` +
    `Type: ${chalk.cyan(type)}\n` +
    `Name: ${chalk.green(name)}\n` +
    `Location: ${chalk.yellow(`./src/${type}s/${name}`)}`,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#222'
    }
  );
  
  console.log(summary);
}