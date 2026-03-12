import chalk from 'chalk';
import { input, select } from '@inquirer/prompts';
import { createProjectStructure } from '../utils/createProject.js';

export const initCommand = async () => {
  // The official ForgeX Logo
  const logo = `
  ███████╗ ██████╗ ██████╗  ██████╗ ███████╗██╗  ██╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝╚██╗██╔╝
  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗   ╚███╔╝ 
  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝   ██╔██╗ 
  ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██╔╝ ██╗
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
  `;
  
  console.log(chalk.cyan(logo));
  console.log(chalk.bgCyan.black(' ForgeX Init: Forging your backend... \n'));
  try {
    const projectName = await input({
      message: 'What is the name of your project?',
      default: 'my-express-api',
    });

    const packageManager = await select({
      message: 'Which package manager do you prefer?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' }
      ]
    });

    const database = await select({
      message: 'Which database will you use?',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'MongoDB', value: 'mongodb' },
        { name: 'None (Simple API)', value: 'none' }
      ]
    });

    let orm = 'none';
    if (database !== 'none') {
      orm = await select({
        message: 'Which ORM/ODM do you want to use?',
        choices: [
          { name: 'Prisma', value: 'prisma' },
          { name: 'Mongoose', value: 'mongoose', disabled: database !== 'mongodb' ? '(Requires MongoDB)' : false },
          { name: 'None (Raw drivers)', value: 'none' }
        ]
      });
    }

    // Architecture removed from configDetails
    const configDetails = {
      projectName,
      packageManager,
      database,
      orm
    };

    console.log('\n' + chalk.green('✔ Configuration saved for forgex.json:'));
    console.table(configDetails); 
    
    console.log(''); 
    await createProjectStructure(configDetails);

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log(chalk.red('\nProcess cancelled by user.'));
    } else {
      console.error(chalk.red('An error occurred:'), error);
    }
  }
};