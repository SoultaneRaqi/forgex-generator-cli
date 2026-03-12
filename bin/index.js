#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from '../src/commands/init.js';
import { generateCommand } from '../src/commands/generate.js';
import { listCommand } from '../src/commands/list.js';

const program = new Command();

// --- CUSTOM HELP SCREEN ---
const logo = chalk.cyan(`
  ███████╗ ██████╗ ██████╗  ██████╗ ███████╗██╗  ██╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝╚██╗██╔╝
  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗   ╚███╔╝ 
  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝   ██╔██╗ 
  ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██╔╝ ██╗
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
`);

program.addHelpText('beforeAll', logo + '\n' + chalk.white.bold(' ForgeX CLI - The ultimate Express.js modular backend forge.\n'));

program.addHelpText('after', `
${chalk.cyan.bold('Examples:')}
  $ forgex init                   ${chalk.gray('# Scaffold a new ForgeX project')}
  $ forgex gen:resource Product   ${chalk.gray('# Generate a full CRUD resource (Controller, Route, Service, Model)')}
  $ forgex gen:controller User    ${chalk.gray('# Generate only a User controller')}
  $ forgex ls                     ${chalk.gray('# List all active resources in your project')}
`);
// --------------------------

program
  .name('forgex')
  .description(chalk.cyan('🛠️  ForgeX: The Ultimate Node.js & Express Scaffolder'))
  .version('1.0.0');

// Registering the init command
program
  .command('init')
  .description('Initialize a new Express project structure')
  .action(initCommand);

// Registering the list command
program
  .command('list')
  .alias('ls')
  .description('List all generated resources and their active files')
  .action(() => {
    listCommand();
  });

// Registering the generate command
const generateTypes = ['controller', 'route', 'service', 'model', 'resource'];

generateTypes.forEach((type) => {
  program
    .command(`gen:${type} <name>`)
    .alias(`generate:${type}`) 
    .description(`Generate a new ${type} for your project`)
    .option('-c, --crud', 'Generate file with full CRUD boilerplate')
    .option('-f, --force', 'Overwrite existing files')
    .action((name, options) => {
      generateCommand(type, name, options);
    });
});

program.parse(process.argv);

// If no arguments were provided, show the beautiful custom help screen
if (!process.argv.slice(2).length) {
  program.outputHelp();
}