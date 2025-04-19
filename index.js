#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { init } from './src/commands/init.js';
import { readFile } from 'fs/promises';

const packageJson = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url))
);

    console.log(chalk.magenta(`
▐▌   ▗▞▀▚▖█  ▄  ■   ▄▄▄   ▄▄▄ 
▐▌   ▐▛▀▀▘█▄▀▗▄▟▙▄▖█   █ █    
▐▛▀▚▖▝▚▄▄▖█ ▀▄ ▐▌  ▀▄▄▄▀ █    
▐▌ ▐▌     █  █ ▐▌             
               ▐▌             
`));
console.log("\n");

program
  .version(packageJson.version)
  .description('Welcome to Hektor CLI! A CLI for Express TypeScript projects')
  
program
  .command('init')
  .description('Initialize a new Hektor project')
  .action(init);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}