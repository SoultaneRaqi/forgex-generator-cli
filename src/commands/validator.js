import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { readConfig } from '../utils/readConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const validatorCommand = async (name, options) => {
  try {
    const config = await readConfig();

    // Determine which validation library the user installed at init
    const hasZod = config.extraPackages?.includes('zod');
    const hasJoi = config.extraPackages?.includes('joi');

    if (!hasZod && !hasJoi) {
      console.error(chalk.red.bold('\n✖ No validation library found in your project.'));
      console.error(chalk.yellow('  Re-run "forgex init" and select Zod or Joi, or install one manually:'));
      console.error(chalk.gray('  npm install zod   OR   npm install joi\n'));
      process.exit(1);
    }

    // Zod takes priority if both are somehow present
    const library = hasZod ? 'zod' : 'joi';
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const folderName = `${formattedName.toLowerCase()}s`;
    const fileName = `${formattedName.toLowerCase()}.validator.js`;

    const targetDir = path.join(process.cwd(), 'src', 'modules', folderName);
    const targetPath = path.join(targetDir, fileName);
    const templatePath = path.join(__dirname, `../templates/components/validator.${library}.ejs`);

    console.log(chalk.bgCyan.black(` ForgeX Generator \n`));
    console.log(chalk.white(`Forging ${chalk.bold(library)} validator for ${chalk.bold(formattedName)}...\n`));

    // Check if file exists
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
    const compiled = ejs.render(templateContent, { name: formattedName, config, options });

    await fs.writeFile(targetPath, compiled);

    console.log(chalk.green(`✔ Created: ${chalk.bold(`src/modules/${folderName}/${fileName}`)}`));

    // Print wiring instructions
    console.log(chalk.cyan('\n  To wire this validator into your route, add the following:\n'));
    console.log(chalk.gray(`  // In src/modules/${folderName}/${formattedName.toLowerCase()}.route.js`));
    console.log(chalk.white(`  import { validateCreate${formattedName}, validateUpdate${formattedName} } from './${formattedName.toLowerCase()}.validator.js';`));
    console.log('');
    console.log(chalk.gray('  // Then use it as middleware on your routes:'));
    console.log(chalk.white(`  router.route('/')`));
    console.log(chalk.white(`    .post(validateCreate${formattedName}, ${formattedName.toLowerCase()}Controller.create${formattedName});`));
    console.log('');
    console.log(chalk.white(`  router.route('/:id')`));
    console.log(chalk.white(`    .put(validateUpdate${formattedName}, ${formattedName.toLowerCase()}Controller.update${formattedName});`));
    console.log('');

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};