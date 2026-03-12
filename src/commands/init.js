import chalk from 'chalk';
import { input, select } from '@inquirer/prompts';

export const initCommand = async () => {
  console.log(chalk.bgCyan.black(' ForgeX Init \n'));

  try {
    const projectName = await input({
      message: 'What is the name of your project?',
      default: 'my-express-app',
    });

    const architecture = await select({
      message: 'Which architecture do you want to use?',
      choices: [
        {
          name: 'Standard (Layered)',
          value: 'Standard',
          description: 'Best for small/medium apps (Controller -> Service -> Repository)'
        },
        {
          name: 'Advanced (Modular)',
          value: 'Advanced',
          description: 'Best for large apps (Groups files by feature/domain like Users, Products)'
        }
      ]
    });

    const packageManager = await select({
      message: 'Which package manager do you prefer?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' }
      ]
    });

    console.log('\n' + chalk.green('✔ Configuration saved:'));
    console.log(chalk.cyan(`Project: ${projectName}`));
    console.log(chalk.cyan(`Architecture: ${architecture}`));
    console.log(chalk.cyan(`Manager: ${packageManager}\n`));
    
    console.log(chalk.yellow(`Next step: Generating the ${architecture} folder structure...`));

  } catch (error) {
    // This catches if the user presses Ctrl+C to exit the prompt
    if (error.name === 'ExitPromptError') {
      console.log(chalk.red('\nProcess cancelled by user.'));
    } else {
      console.error(chalk.red('An error occurred:'), error);
    }
  }
};