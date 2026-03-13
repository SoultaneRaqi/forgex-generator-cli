import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { readConfig } from '../utils/readConfig.js';
import { injectRoute } from '../utils/routeInjector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compileAndWrite = async (templateName, targetPath, config) => {
  try {
    const templatePath = path.join(__dirname, '../templates/auth', templateName);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledCode = ejs.render(templateContent, { config });
    
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    
    // Skip if file exists to prevent overwriting custom logic
    try {
      await fs.access(targetPath);
      console.log(chalk.yellow(`⚠ Skipped: ${path.basename(targetPath)} already exists.`));
      return;
    } catch (e) {}

    await fs.writeFile(targetPath, compiledCode);
    console.log(chalk.green(`✔ Created: ${targetPath.replace(process.cwd() + '/', '')}`));
  } catch (error) {
    console.error(chalk.red(`✖ Failed to generate ${templateName}:`), error.message);
  }
};

export const authCommand = async () => {
  try {
    const config = await readConfig();
    console.log(chalk.bgMagenta.black(`\n ForgeX Security: Forging Auth System... \n`));

    const cwd = process.cwd();

    // 1. Generate Auth Module
    await compileAndWrite('auth.controller.ejs', path.join(cwd, 'src/modules/auth/auth.controller.js'), config);
    await compileAndWrite('auth.service.ejs', path.join(cwd, 'src/modules/auth/auth.service.js'), config);
    await compileAndWrite('auth.route.ejs', path.join(cwd, 'src/modules/auth/auth.route.js'), config);

    // 2. Generate User Model
    await compileAndWrite('user.model.ejs', path.join(cwd, 'src/modules/users/user.model.js'), config);

    // 3. Generate Middleware
    await compileAndWrite('auth.middleware.ejs', path.join(cwd, 'src/core/middlewares/auth.middleware.js'), config);

    // 4. Inject the Auth Route
    await injectRoute('Auth');

    console.log(chalk.magenta.bold(`\n🛡️ Auth system forged successfully!`));
    console.log(chalk.gray(`Make sure JWT_SECRET and JWT_EXPIRE are set in your .env file.\n`));

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};