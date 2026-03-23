import { exec } from 'child_process';
import util from 'util';
import chalk from 'chalk';
import { readConfig } from '../utils/readConfig.js';

const execAsync = util.promisify(exec);

export const migrateCommand = async (options) => {
  try {
    // 1. Read the user's project config
    const config = await readConfig();
    const { orm } = config;

    console.log(chalk.bgCyan.black(` ForgeX Migration Engine \n`));

    // 2. Execute the correct command based on their ORM
    if (orm === 'prisma') {
      const name = options.name || 'migration';
      console.log(chalk.cyan(`Running Prisma migration: ${chalk.bold(name)}...\n`));
      
      try {
        // We use npx so it uses the local project's Prisma version
        const { stdout, stderr } = await execAsync(`npx prisma migrate dev --name ${name}`);
        console.log(chalk.green(stdout));
        if (stderr) console.log(chalk.yellow(stderr));
        console.log(chalk.green('✔ Prisma migration completed successfully!\n'));
      } catch (execError) {
        console.error(chalk.red('\n✖ Prisma migration failed. Is your database running?'));
        console.error(chalk.gray(execError.message));
      }
    } 
    else if (orm === 'sequelize') {
      console.log(chalk.cyan(`Running Sequelize migrations...\n`));
      
      try {
        const { stdout, stderr } = await execAsync(`npx sequelize-cli db:migrate`);
        console.log(chalk.green(stdout));
        if (stderr) console.log(chalk.yellow(stderr));
        console.log(chalk.green('✔ Sequelize migration completed successfully!\n'));
      } catch (execError) {
        console.error(chalk.red('\n✖ Sequelize migration failed.'));
        console.error(chalk.gray('Make sure sequelize-cli is initialized and your database is running.'));
        console.error(chalk.gray(execError.message));
      }
    } 
    else if (orm === 'mongoose') {
      console.log(chalk.yellow('⚠ Mongoose does not require traditional schema migrations.'));
      console.log(chalk.gray('  MongoDB is schema-less. Your models will auto-create collections upon insertion.\n'));
    } 
    else {
      console.log(chalk.yellow(`⚠ No automated migrations configured for: ${chalk.bold(orm || 'Native Driver')}`));
      console.log(chalk.gray('  Please run your custom SQL scripts manually.\n'));
    }

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error.message);
  }
};