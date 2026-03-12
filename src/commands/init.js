import chalk from 'chalk';

import { input, select, checkbox, confirm } from '@inquirer/prompts'; 
import { createProjectStructure } from '../utils/createProject.js';

export const initCommand = async () => {
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
    const projectName = await input({ message: 'What is the name of your project?', default: 'my-express-api' });

    const packageManager = await select({
      message: 'Which package manager do you prefer?',
      choices: [ { name: 'npm', value: 'npm' }, { name: 'yarn', value: 'yarn' }, { name: 'pnpm', value: 'pnpm' } ]
    });

    const database = await select({
      message: 'Which database will you use?',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' }, { name: 'MySQL', value: 'mysql' },
        { name: 'MongoDB', value: 'mongodb' }, { name: 'None (Simple API)', value: 'none' }
      ]
    });

    let orm = 'none';
    if (database !== 'none') {
      orm = await select({
        message: 'Which ORM/ODM do you want to use?',
        choices: [
          { name: 'Prisma', value: 'prisma' },
          { name: 'Mongoose', value: 'mongoose', disabled: database !== 'mongodb' ? '(Requires MongoDB)' : false },
          { name: 'None', value: 'none' }
        ]
      });
    }

    const extraPackages = await checkbox({
      message: 'Select additional packages to install (Use <Space> to select, <Enter> to confirm):',
      choices: [
        { name: 'Helmet (Security headers)', value: 'helmet' },
        { name: 'Morgan (HTTP request logging)', value: 'morgan' },
        { name: 'Zod (Data validation schema)', value: 'zod' },
        { name: 'Bcrypt (Password hashing)', value: 'bcrypt' },
        { name: 'JsonWebToken (Authentication)', value: 'jsonwebtoken' },
        { name: 'Axios (HTTP client)', value: 'axios' }
      ]
    });

    const startServer = await confirm({
      message: 'Do you want to start the development server immediately after setup?',
      default: true
    });

    // Add the new variables to our config object
    const configDetails = {
      projectName, packageManager, database, orm, extraPackages, startServer
    };

    console.log('\n' + chalk.green('✔ Configuration saved for forgex.fx:'));
    
    // Remove the 'extraPackages' and 'startServer' properties from the table display for cleaner output
    const { extraPackages: _, startServer: __, ...tableData } = configDetails;
    console.table(tableData); 
    
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