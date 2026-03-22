import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

/**
 * Injects an import and router.use() line into src/core/routes.js.
 *
 * @param {string} name - The PascalCase resource name (e.g. "Product", "Auth")
 * @param {string|null} explicitFolderName - Optional: override the auto-pluralized folder name.
 *   Use this for modules that don't follow the standard plural convention (e.g. "auth" not "auths").
 */
export const injectRoute = async (name, explicitFolderName = null) => {
  try {
    const routesPath = path.join(process.cwd(), 'src', 'core', 'routes.js');

    // Use the explicit folder name if provided, otherwise default to pluralized
    const folderName = explicitFolderName ?? `${name.toLowerCase()}s`;
    const routeFileName = `${name.toLowerCase()}.route.js`;
    const routeVariableName = `${name.toLowerCase()}Routes`;

    let routesContent;
    try {
      routesContent = await fs.readFile(routesPath, 'utf-8');
    } catch (err) {
      console.log(chalk.yellow(`\n⚠ Could not find src/core/routes.js to auto-inject the route.`));
      return false;
    }

    const importStatement = `import ${routeVariableName} from '../modules/${folderName}/${routeFileName}';`;
    const registerStatement = `router.use('/${folderName}', ${routeVariableName});`;

    // Prevent duplicate injections
    if (routesContent.includes(importStatement) || routesContent.includes(registerStatement)) {
      return true;
    }

    // Inject the import
    const importAnchor = '// 1. Import module routes here';
    routesContent = routesContent.replace(
      importAnchor,
      `${importAnchor}\n${importStatement}`
    );

    // Inject the route registration
    const registerAnchor = '// 2. Register module routes here';
    routesContent = routesContent.replace(
      registerAnchor,
      `${registerAnchor}\n${registerStatement}`
    );

    await fs.writeFile(routesPath, routesContent);
    console.log(chalk.green(`✔ Auto-injected route into: ${chalk.bold('src/core/routes.js')}`));

    return true;
  } catch (error) {
    console.error(chalk.red(`\n✖ Failed to inject route:`), error.message);
    return false;
  }
};