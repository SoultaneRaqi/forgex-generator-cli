#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

// CLI Configuration
program
  .name('forgex')
  .description(chalk.cyan('🛠️  ForgeX: The Ultimate Node.js & Express Scaffolder'))
  .version('1.0.0');

// Our first command: init
program
  .command('init')
  .description('Initialize a new Express project structure')
  .action(() => {
    console.log(chalk.bgCyan.black(' ForgeX Init '));
    console.log(chalk.green('\nStarting the scaffolding process...'));
    
    // We will add Inquirer prompts here next!
    console.log(chalk.yellow('Feature coming in the next step: Architecture selection prompt.'));
  });

// Parse the terminal arguments
program.parse(process.argv);

// Show help if no arguments are passed
if (!process.argv.slice(2).length) {
  program.outputHelp();
}