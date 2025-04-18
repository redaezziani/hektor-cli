#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { init } from './src/commands/init.js';
import { readFile } from 'fs/promises';
import gradient from 'gradient-string';

// Read package.json
const packageJson = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url))
);

// Display a fancy banner
    console.log(chalk.blue(` ██░ ██ ▓█████  ██ ▄█▀▄▄▄█████▓ ▒█████   ██▀███  
▓██░ ██▒▓█   ▀  ██▄█▒ ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒
▒██▀▀██░▒███   ▓███▄░ ▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒
░▓█ ░██ ▒▓█  ▄ ▓██ █▄ ░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  
░▓█▒░██▓░▒████▒▒██▒ █▄  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒
 ▒ ░░▒░▒░░ ▒░ ░▒ ▒▒ ▓▒  ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░
 ▒ ░▒░ ░ ░ ░  ░░ ░▒ ▒░    ░      ░ ▒ ▒░   ░▒ ░ ▒░
 ░  ░░ ░   ░   ░ ░░ ░   ░      ░ ░ ░ ▒    ░░   ░ 
 ░  ░  ░   ░  ░░  ░                ░ ░     ░     
                                                `));

// Configure CLI
program
  .version(packageJson.version)
  .description('Welcome to Hektor CLI! A CLI for Express TypeScript projects')
  
// Define init command
program
  .command('init')
  .description('Initialize a new Hektor project')
  .action(init);

// Parse arguments
program.parse(process.argv);

// If no arguments provided, display help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}