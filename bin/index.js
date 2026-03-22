#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from '../src/commands/init.js';
import { generateCommand } from '../src/commands/generate.js';
import { listCommand } from '../src/commands/list.js';
import { authCommand } from '../src/commands/auth.js';

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
  $ forgex init                                  ${chalk.gray('# Scaffold a new ForgeX project')}
  $ forgex gen:auth                              ${chalk.gray('# Generate a complete JWT authentication system')}
  $ forgex gen:resource Product                  ${chalk.gray('# Generate a full CRUD resource')}
  $ forgex gen:resource Notification --no-model  ${chalk.gray('# Generate a resource without a database model')}
  $ forgex gen:controller User                   ${chalk.gray('# Generate only a controller file')}
  $ forgex gen:controller User --empty           ${chalk.gray('# Generate an empty controller file')}
  $ forgex ls                                    ${chalk.gray('# List all active resources in your project')}

${chalk.cyan.bold('Generation flags:')}
  -e, --empty     ${chalk.gray('Generate an empty file without CRUD boilerplate')}
  -f, --force     ${chalk.gray('Overwrite existing files')}

${chalk.cyan.bold('Resource-only flags:')}
  --no-model      ${chalk.gray('Skip generating the model file')}
  --no-service    ${chalk.gray('Skip generating the service file')}
  --no-controller ${chalk.gray('Skip generating the controller file')}
  --no-route      ${chalk.gray('Skip generating the route file')}
`);
// --------------------------

program
  .name('forgex')
  .description(chalk.cyan('🛠️  ForgeX: The Ultimate Node.js & Express Scaffolder'))
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new Express project structure')
  .action(initCommand);

program
  .command('list')
  .alias('ls')
  .description('List all generated resources and their active files')
  .action(() => listCommand());

program
  .command('gen:auth')
  .alias('generate:auth')
  .description('Generate a complete JWT authentication system (Auth module + User model)')
  .action(() => authCommand());

const generateTypes = ['controller', 'route', 'service', 'model', 'resource'];

generateTypes.forEach((type) => {
  program
    .command(`gen:${type} <name>`)
    .alias(`generate:${type}`)
    .description(`Generate a new ${type} for your project`)
    .option('-e, --empty', 'Generate an empty file without CRUD boilerplate')
    .option('-f, --force', 'Overwrite existing files')
    .option('--no-model', 'Skip generating the model file (resource only)')
    .option('--no-service', 'Skip generating the service file (resource only)')
    .option('--no-controller', 'Skip generating the controller file (resource only)')
    .option('--no-route', 'Skip generating the route file (resource only)')
    .action((name, options) => {
      generateCommand(type, name, options);
    });
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}