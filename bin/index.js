#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from '../src/commands/init.js'; // Importing our logic

const program = new Command();

program
  .name('forgex')
  .description(chalk.cyan('🛠️  ForgeX: The Ultimate Node.js & Express Scaffolder'))
  .version('1.0.0');

// Registering the init command
program
  .command('init')
  .description('Initialize a new Express project structure')
  .action(initCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}