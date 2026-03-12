import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import ejs from 'ejs'; 

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProjectStructure(config) {
  const { projectName, architecture } = config;
  const projectPath = path.join(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    console.error(chalk.red(`\n✖ Error: A folder named "${projectName}" already exists in this directory.`));
    process.exit(1);
  }

  const spinner = ora(chalk.cyan(`Forging project: ${projectName}...`)).start();

  try {
    // 1. Create the root folder & state file
    await fs.mkdir(projectPath);
    const forgexConfigPath = path.join(projectPath, 'forgex.json');
    await fs.writeFile(forgexConfigPath, JSON.stringify(config, null, 2));

    // 2. Scaffold Directories
    const standardFolders = [
      'src/config', 'src/controllers', 'src/middlewares', 
      'src/models', 'src/routes', 'src/services', 'src/utils'
    ];
    const advancedFolders = [
      'src/core/config', 'src/core/middlewares', 'src/core/utils', 'src/modules'
    ];

    const foldersToCreate = architecture === 'standard' ? standardFolders : advancedFolders;
    for (const folder of foldersToCreate) {
      await fs.mkdir(path.join(projectPath, folder), { recursive: true });
    }

    spinner.text = chalk.cyan('Compiling baseline files...');

    // 3. Template Compilation Magic!
    // Point to our templates folder
    const templateDir = path.join(__dirname, '../templates/base');

    // Read the package.json.ejs template, inject 'config', and save it as package.json
    const packageContent = await ejs.renderFile(path.join(templateDir, 'package.json.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'package.json'), packageContent);

    // Read the .env.ejs template, inject 'config', and save it as .env
    const envContent = await ejs.renderFile(path.join(templateDir, '.env.ejs'), config);
    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // Create a quick standard .gitignore file directly
    const gitignoreContent = "node_modules\n.env\n.DS_Store\ncoverage\n";
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

    spinner.succeed(chalk.green('Project structure forged successfully!'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to forge project structure.'));
    console.error(error);
    process.exit(1);
  }
}