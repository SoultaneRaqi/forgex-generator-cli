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
          value: 'standard',
          description: 'Best for small/medium apps (Controller -> Service -> Repository)'
        },
        {
          name: 'Advanced (Modular)',
          value: 'advanced',
          description: 'Best for large apps (Groups files by feature/domain)'
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

    // Epic 1: Database selection
    const database = await select({
      message: 'Which database will you use?',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'None (Simple API)', value: 'none' }
      ]
    });

    // Epic 1: Conditional ORM selection
    let orm = 'none';
    if (database !== 'none') {
      orm = await select({
        message: 'Which ORM/ODM do you want to use?',
        choices: [
          { 
            name: 'Prisma (Highly Recommended)', 
            value: 'prisma',
            description: 'Modern ORM that works with SQL and MongoDB'
          },
          { 
            name: 'Mongoose', 
            value: 'mongoose', 
            disabled: database !== 'mongodb' ? '(Requires MongoDB)' : false 
          },
          { 
            name: 'None (Raw drivers)', 
            value: 'none' 
          }
        ]
      });
    }

    // Creating the data object that will eventually be saved to forgex.json
    const configDetails = {
      projectName,
      architecture,
      packageManager,
      database,
      orm
    };

    console.log('\n' + chalk.green('✔ Configuration saved for forgex.json:'));
    console.table(configDetails); // Using console.table for a clean, professional look!
    
    console.log('\n' + chalk.yellow(`Next phase: Building the filesystem engine...`));

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log(chalk.red('\nProcess cancelled by user.'));
    } else {
      console.error(chalk.red('An error occurred:'), error);
    }
  }
};