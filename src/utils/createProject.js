import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import ejs from 'ejs';
import { exec } from 'child_process'; 
import util from 'util'; 

// Promisify exec so we can use await with it
const execAsync = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProjectStructure(config) {
  const { projectName, architecture, packageManager } = config; 
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

    // 3. Template Compilation Magic
    spinner.text = chalk.cyan('Compiling baseline files...');
    const templateDir = path.join(__dirname, '../templates/base');

    const packageContent = await ejs.renderFile(path.join(templateDir, 'package.json.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'package.json'), packageContent);

    const envContent = await ejs.renderFile(path.join(templateDir, '.env.ejs'), config);
    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    const appContent = await ejs.renderFile(path.join(templateDir, 'app.js.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'src', 'app.js'), appContent);

    const serverContent = await ejs.renderFile(path.join(templateDir, 'server.js.ejs'), config);
    await fs.writeFile(path.join(projectPath, 'src', 'server.js'), serverContent);
    
    const gitignoreContent = "node_modules\n.env\n.DS_Store\ncoverage\n";
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

    // 4. Epic 4: Auto-Installation!
    spinner.text = chalk.cyan(`Installing dependencies using ${packageManager}... (This might take a minute)`);
    
    // Execute the install command inside the new project folder
    try {
      await execAsync(`${packageManager} install`, { cwd: projectPath });
      spinner.succeed(chalk.green('Project dependencies installed successfully!'));
    } catch (installError) {
      // If installation fails (e.g., no internet), we don't want to crash the whole tool.
      // We just warn them so they can do it manually.
      spinner.warn(chalk.yellow(`Files created, but failed to install dependencies automatically. Please run '${packageManager} install' manually.`));
    }

    // 5. Final Output Instructions
    console.log('\n' + chalk.bgGreen.black(' FORGEX COMPLETE '));
    console.log(chalk.white('\nYour project is ready! Next steps:'));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  ${packageManager} run dev\n`));

  } catch (error) {
    spinner.fail(chalk.red('Failed to forge project structure.'));
    console.error(error);
    process.exit(1);
  }
}