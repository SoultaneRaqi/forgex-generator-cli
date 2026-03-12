#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from '../src/commands/init.js';
import { generateCommand } from '../src/commands/generate.js';

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

// Registering the generate command
const generateTypes = ['controller', 'route', 'service', 'model', 'resource'];

generateTypes.forEach((type) => {
  program
    .command(`gen:${type} <name>`)
    // We can also alias the full word so `generate:controller` works too!
    .alias(`generate:${type}`) 
    .description(`Generate a new ${type} for your project`)
    .option('-c, --crud', 'Generate file with full CRUD boilerplate')
    .option('-f, --force', 'Overwrite existing files')
    .action((name, options) => {
      // We pass the 'type' directly from the loop, so the user doesn't have to type it as a separate argument!
      generateCommand(type, name, options);
    });
});

  
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}