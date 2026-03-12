import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export async function createProjectStructure(config) {
  const { projectName, architecture } = config;
  
  // Gets the current directory where the user ran the command
  const projectPath = path.join(process.cwd(), projectName);

  // Safety Check: Don't overwrite an existing folder
  if (existsSync(projectPath)) {
    console.error(chalk.red(`\n✖ Error: A folder named "${projectName}" already exists in this directory.`));
    process.exit(1);
  }

  // Start the loading spinner!
  const spinner = ora(chalk.cyan(`Forging project: ${projectName}...`)).start();

  try {
    // 1. Create the root project folder
    await fs.mkdir(projectPath);

    // 2. Save the forgex.json state file
    const forgexConfigPath = path.join(projectPath, 'forgex.json');
    await fs.writeFile(forgexConfigPath, JSON.stringify(config, null, 2));

    // 3. Define the architecture blueprints
    const standardFolders = [
      'src/config',
      'src/controllers',
      'src/middlewares',
      'src/models',
      'src/routes',
      'src/services',
      'src/utils'
    ];

    const advancedFolders = [
      'src/core/config',
      'src/core/middlewares',
      'src/core/utils',
      'src/modules'
    ];

    const foldersToCreate = architecture === 'standard' ? standardFolders : advancedFolders;

    // 4. Loop through and physically create the directories
    for (const folder of foldersToCreate) {
      await fs.mkdir(path.join(projectPath, folder), { recursive: true });
    }

    spinner.succeed(chalk.green('Project structure forged successfully!'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to forge project structure.'));
    console.error(error);
    process.exit(1);
  }
}