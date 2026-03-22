import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import ejs from 'ejs';
import { exec, spawn } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProjectStructure(config) {
  const { projectName, packageManager } = config;
  const projectPath = path.join(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    console.error(chalk.red(`\n✖ Error: A folder named "${projectName}" already exists in this directory.`));
    process.exit(1);
  }

  const spinner = ora(chalk.cyan(`Forging project: ${projectName}...`)).start();

  try {
    // 1. Create root folder & config file
    await fs.mkdir(projectPath);
    await fs.writeFile(
      path.join(projectPath, 'forgex.fx'),
      JSON.stringify(config, null, 2)
    );

    // 2. Scaffold directories
    const coreFolders = [
      'src/core/config',
      'src/core/middlewares',
      'src/core/utils',
      'src/modules'
    ];
    for (const folder of coreFolders) {
      await fs.mkdir(path.join(projectPath, folder), { recursive: true });
    }

    // 3. Compile and write all templates
    spinner.text = chalk.cyan('Compiling baseline files...');
    const templateDir = path.join(__dirname, '../templates/base');

    // package.json
    const packageContent = await ejs.renderFile(path.join(templateDir, 'package.json.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'package.json'), packageContent);

    // .env
    const envContent = await ejs.renderFile(path.join(templateDir, '.env.ejs'), config);
    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // .env.example
    const envExampleContent = await ejs.renderFile(path.join(templateDir, '.env.example.ejs'), config);
    await fs.writeFile(path.join(projectPath, '.env.example'), envExampleContent);

    // app.js
    const appContent = await ejs.renderFile(path.join(templateDir, 'app.js.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'src', 'app.js'), appContent);

    // server.js
    const serverContent = await ejs.renderFile(path.join(templateDir, 'server.js.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'src', 'server.js'), serverContent);

    // db.js
    const dbContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/config/db.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core/config', 'db.js'), dbContent);

    // env.js (startup env validation)
    const envValidationContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/config/env.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core/config', 'env.js'), envValidationContent);

    // errorHandler.js
    const errorHandlerContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/middlewares/errorHandler.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core/middlewares', 'errorHandler.js'), errorHandlerContent);

    // notFound.js
    const notFoundContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/middlewares/notFound.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core/middlewares', 'notFound.js'), notFoundContent);

    // catchAsync.js
    const catchAsyncContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/utils/catchAsync.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core/utils', 'catchAsync.js'), catchAsyncContent);

    // routes.js (central router hub)
    const routesHubContent = await ejs.renderFile(
      path.join(__dirname, '../templates/core/routes.js.ejs'), config
    );
    await fs.writeFile(path.join(projectPath, 'src/core', 'routes.js'), routesHubContent);

    // README.md
    const readmeContent = await ejs.renderFile(path.join(templateDir, 'README.md.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);

    // .gitignore
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      'node_modules\n.env\n.DS_Store\ncoverage\ndist\n'
    );

    // ESLint + Prettier (optional)
    if (config.linting) {
      const eslintContent = await ejs.renderFile(
        path.join(templateDir, 'eslint.config.js.ejs'), config
      );
      await fs.writeFile(path.join(projectPath, 'eslint.config.js'), eslintContent);

      const prettierContent = await ejs.renderFile(
        path.join(templateDir, '.prettierrc.ejs'), config
      );
      await fs.writeFile(path.join(projectPath, '.prettierrc'), prettierContent);
    }

    // 4. Install dependencies
    spinner.text = chalk.cyan(`Installing dependencies using ${packageManager}...`);
    try {
      await execAsync(`${packageManager} install`, { cwd: projectPath });
      spinner.succeed(chalk.green('Dependencies installed successfully!'));
    } catch (installError) {
      spinner.warn(chalk.yellow(`Files created, but auto-install failed. Run '${packageManager} install' manually.`));
    }

    // 5. Initialize Git
    spinner.text = chalk.cyan('Initializing Git repository...');
    try {
      await execAsync(
        'git init && git add . && git commit -m "chore: initial commit by ForgeX 🪓"',
        { cwd: projectPath }
      );
      spinner.succeed(chalk.green('Git repository initialized successfully!'));
    } catch (gitError) {
      spinner.warn(chalk.yellow('Skipped Git initialization (Git might not be installed or configured).'));
    }

    // 6. Start server (optional)
    if (config.startServer) {
      console.log('\n' + chalk.bgGreen.black(' FORGEX COMPLETE '));
      console.log(chalk.cyan(`\n🚀 Starting development server in ./${projectName}...\n`));

      const child = spawn(`${packageManager} run dev`, [], {
        cwd: projectPath,
        stdio: 'inherit',
        shell: true
      });

      child.on('error', (err) => {
        console.error(chalk.red('Failed to start the server:'), err);
      });

    } else {
      console.log('\n' + chalk.bgGreen.black(' FORGEX COMPLETE '));
      console.log(chalk.white('\nYour project is ready! Next steps:'));
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan(`  ${packageManager} run dev\n`));
    }

  } catch (error) {
    spinner.fail(chalk.red('Failed to forge project structure.'));
    console.error(error);
    process.exit(1);
  }
}