import chalk from 'chalk';
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import { createProjectStructure } from '../utils/createProject.js';

export const initCommand = async () => {
  console.log(chalk.bgCyan.black('\n ForgeX Init: Forging your backend... \n'));

  try {
    const projectName = await input({
      message: 'What is the name of your project?',
      default: 'my-express-api'
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
      const ormChoices = [
        {
          name: 'Prisma',
          value: 'prisma',
          // Prisma supports all SQL DBs but not a great fit for raw MongoDB
          disabled: database === 'mongodb' ? '(Not recommended for MongoDB)' : false
        },
        {
          name: 'Sequelize',
          value: 'sequelize',
          // Sequelize is SQL-only
          disabled: database === 'mongodb' ? '(SQL databases only)' : false
        },
        {
          name: 'Mongoose',
          value: 'mongoose',
          // Mongoose is MongoDB-only
          disabled: database !== 'mongodb' ? '(MongoDB only)' : false
        },
        {
          name: 'None (Native Driver)',
          value: 'none'
        }
      ];

      orm = await select({
        message: 'Which ORM/ODM do you want to use?',
        choices: ormChoices
      });
    }

    const extraPackages = await checkbox({
      message: 'Select additional packages to install (Space to select, Enter to confirm):',
      choices: [
        { name: 'Helmet (Security headers)', value: 'helmet' },
        { name: 'Morgan (HTTP request logging)', value: 'morgan' },
        { name: 'Zod (Schema validation)', value: 'zod' },
        { name: 'Joi (Schema validation)', value: 'joi' },
        { name: 'Bcrypt (Password hashing)', value: 'bcrypt' },
        { name: 'JsonWebToken (Authentication)', value: 'jsonwebtoken' },
        { name: 'Axios (HTTP client)', value: 'axios' }
      ]
    });

    const linting = await confirm({
      message: 'Add ESLint + Prettier for code quality?',
      default: true
    });

    const startServer = await confirm({
      message: 'Do you want to start the development server immediately after setup?',
      default: true
    });

    const configDetails = {
      projectName, packageManager, database, orm, extraPackages, linting, startServer
    };

    console.log('\n' + chalk.green('✔ Configuration saved for forgex.fx:'));

    const { extraPackages: _, startServer: __, linting: ___, ...tableData } = configDetails;
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