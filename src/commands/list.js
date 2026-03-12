import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { readConfig } from '../utils/readConfig.js';

export const listCommand = async () => {
  try {
    // 1. Validate we are in a ForgeX project
    await readConfig(); 

    const modulesDir = path.join(process.cwd(), 'src', 'modules');

    let modules;
    try {
      // Get all folders inside src/modules/
      modules = await fs.readdir(modulesDir, { withFileTypes: true });
    } catch (err) {
      console.log(chalk.yellow('\n⚠ No modules directory found. Run "forgex gen:resource <name>" to create one.\n'));
      return;
    }

    const resources = [];

    // 2. Loop through every folder and check its contents
    for (const mod of modules) {
      if (mod.isDirectory()) {
        const modPath = path.join(modulesDir, mod.name);
        const files = await fs.readdir(modPath);

        // Format the resource name (e.g., 'products' -> 'Product')
        const formattedName = mod.name.charAt(0).toUpperCase() + mod.name.slice(1, -1);

        const hasController = files.some(f => f.includes('.controller.js'));
        const hasRoute = files.some(f => f.includes('.route.js'));
        const hasService = files.some(f => f.includes('.service.js'));
        const hasModel = files.some(f => f.includes('.model.js'));

        resources.push({
          Resource: formattedName,
          Controller: hasController ? '✔' : '✖',
          Route: hasRoute ? '✔' : '✖',
          Service: hasService ? '✔' : '✖',
          Model: hasModel ? '✔' : '✖',
          // Smarter Endpoint logic here:
          Endpoint: hasRoute ? `/api/v1/${mod.name}` : 'Internal (No Route)'
        });
      }
    }

    // 3. Print the beautiful output
    console.log('\n' + chalk.bgCyan.black(' ForgeX Project Resources '));
    
    if (resources.length === 0) {
      console.log(chalk.yellow('\nNo resources found. Time to forge some!\n'));
    } else {
      console.log(''); // Blank line for spacing
      console.table(resources);
      console.log('');
    }

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};