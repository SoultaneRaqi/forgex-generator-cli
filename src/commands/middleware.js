import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { readConfig } from '../utils/readConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const middlewareCommand = async (name, options) => {
  try {
    await readConfig();

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const fileName = `${formattedName.toLowerCase()}.middleware.js`;
    const targetDir = path.join(process.cwd(), 'src', 'core', 'middlewares');
    const targetPath = path.join(targetDir, fileName);
    const templatePath = path.join(__dirname, '../templates/components/middleware.ejs');

    console.log(chalk.bgCyan.black(` ForgeX Generator \n`));
    console.log(chalk.white(`Forging middleware: ${chalk.bold(formattedName)}...\n`));

    // Check if file already exists
    try {
      await fs.access(targetPath);
      if (!options.force) {
        console.log(chalk.yellow(`⚠ Skipped: ${chalk.bold(fileName)} already exists.`));
        console.log(chalk.gray('  (Use --force to overwrite)\n'));
        return;
      }
      console.log(chalk.yellow(`⚠ Overwriting existing ${chalk.bold(fileName)}...`));
    } catch (e) {
      // File doesn't exist, good to proceed
    }

    await fs.mkdir(targetDir, { recursive: true });

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiled = ejs.render(templateContent, { name: formattedName, options });

    await fs.writeFile(targetPath, compiled);

    console.log(chalk.green(`✔ Created: ${chalk.bold(`src/core/middlewares/${fileName}`)}`));

    // Print usage instructions
    console.log(chalk.cyan('\n  To use this middleware, import it wherever needed:\n'));
    console.log(chalk.white(`  import { ${formattedName.toLowerCase()}Middleware } from '../../core/middlewares/${fileName}';\n`));

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};