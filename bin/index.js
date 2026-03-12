#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer'; // We added this import

const program = new Command();

program
  .name('forgex')
  .description(chalk.cyan('🛠️  ForgeX: The Ultimate Node.js & Express Scaffolder'))
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new Express project structure')
  .action(async () => { // Notice we made this function async
    console.log(chalk.bgCyan.black(' ForgeX Init \n'));
    
    // The interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        default: 'my-express-app',
      },
      {
        type: 'list',
        name: 'architecture',
        message: 'Which architecture do you want to use?',
        choices: [
          'Standard (Layered: Controller-Service-Repository)',
          'Advanced (Modular: Feature-based domains)'
        ],
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you prefer?',
        choices: ['npm', 'yarn', 'pnpm'],
      }
    ]);

    // Output the choices back to the terminal
    console.log('\n' + chalk.green('✔ Configuration saved:'));
    console.log(chalk.cyan(`Project: ${answers.projectName}`));
    
    // We split the string to just get the word "Standard" or "Advanced"
    const archType = answers.architecture.split(' ')[0]; 
    console.log(chalk.cyan(`Architecture: ${archType}`));
    console.log(chalk.cyan(`Manager: ${answers.packageManager}\n`));
    
    console.log(chalk.yellow(`Next step: Generating the ${archType} folder structure...`));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}