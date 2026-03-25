```
  ███████╗ ██████╗ ██████╗  ██████╗ ███████╗██╗  ██╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝╚██╗██╔╝
  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗   ╚███╔╝ 
  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝   ██╔██╗ 
  ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██╔╝ ██╗
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
```

<div align="center">

**Scaffold production-ready Node.js/Express backends in seconds.**

[![npm version](https://img.shields.io/npm/v/forgex-cli?color=orange&style=flat-square)](https://www.npmjs.com/package/forgex-cli)
[![npm downloads](https://img.shields.io/npm/dm/forgex-cli?color=orange&style=flat-square)](https://www.npmjs.com/package/forgex-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green?style=flat-square)](https://nodejs.org)

[Getting Started](#-getting-started) · [Commands](#-commands) · [Generated Structure](#-generated-structure) · [Stack](#-supported-stack) · [Contributing](#-contributing)

</div>

---

## What is ForgeX?
[Documentation](https://forge-x-generator.vercel.app/)
**ForgeX CLI** is an interactive command-line tool that scaffolds fully structured, production-ready Node.js/Express backends in seconds.

Answer a few prompts — pick your database, ORM, validation library, and package manager — and ForgeX generates a complete, organized project with everything wired up. No more copy-pasting starter code. No more manual folder setup.

```bash
npx forgex-cli init
```

---

## ✨ Features

- 🏗️ **Modular architecture** — Feature-based folder structure that scales cleanly
- 🗄️ **Multi-database support** — PostgreSQL, MySQL, MongoDB, or none
- 🔌 **ORM / ODM choices** — Prisma, Sequelize, Mongoose, or native drivers
- 📦 **Package manager aware** — Works with `npm`, `yarn`, and `pnpm`
- 🔐 **JWT Auth generation** — Full authentication system in one command
- ⚡ **Smart generators** — Scaffold controllers, services, routes, models, validators, and middleware individually
- 🔁 **Auto route injection** — Generated routes are automatically wired into the central router
- 🛡️ **Input validation** — Generate Zod or Joi validators with middleware factory included
- 🔧 **Custom middleware** — Generate middleware files directly into `src/core/middlewares/`
- ✅ **Env validation** — Startup check that crashes early with a clear message if vars are missing
- 🛠️ **ESLint + Prettier** — Optional, pre-configured for ESM out of the box
- 🌿 **Git ready** — Repository initialized with first commit automatically
- 🗃️ **Migration runner** — `forgex migrate` runs the right command based on your ORM
- 📋 **Resource listing** — See all your modules, their files, and endpoints in one table

---

## 📦 Getting Started

### Requirements

- Node.js `>= 16`
- npm, yarn, or pnpm

### Run without installing

```bash
npx forgex-cli init
```

### Or install globally

```bash
npm install -g forgex-cli
forgex init
```

---

## 🚀 Commands

### `forgex init`

Interactively scaffold a new project. You'll be prompted to choose:

- Project name
- Package manager (`npm` / `yarn` / `pnpm`)
- Database (`PostgreSQL` / `MySQL` / `MongoDB` / `None`)
- ORM / ODM (`Prisma` / `Sequelize` / `Mongoose` / `None`)
- Extra packages (`Helmet`, `Morgan`, `Zod`, `Joi`, `Bcrypt`, `JsonWebToken`, `Axios`)
- ESLint + Prettier (`yes` / `no`)
- Whether to start the dev server immediately

```bash
forgex init
```

```
✔ Project scaffolded
✔ Dependencies installed
✔ Git repository initialized
✔ You're ready to forge!
```

---

### `forgex gen:resource <n>`

Generate a complete CRUD module — controller, service, route, and model — with the route auto-injected into `src/core/routes.js`.

```bash
forgex gen:resource Product
```

Skip specific files with flags:

```bash
forgex gen:resource Notification --no-model
forgex gen:resource Report --no-service
forgex gen:resource Log --no-controller
forgex gen:resource Webhook --no-route
```

---

### `forgex gen:controller <n>`
### `forgex gen:service <n>`
### `forgex gen:route <n>`
### `forgex gen:model <n>`

Generate a single file. Routes are auto-injected into `src/core/routes.js`.

```bash
forgex gen:controller User
forgex gen:service Order
forgex gen:route Product
forgex gen:model Category
```

**Flags available on all `gen:*` commands:**

| Flag | Description |
|---|---|
| `-e, --empty` | Generate an empty file with minimal boilerplate |
| `-f, --force` | Overwrite an existing file |

```bash
forgex gen:controller Payment --empty
forgex gen:service User --force
```

---

### `forgex gen:auth`

Generate a complete JWT authentication system in one command:

- `src/modules/auth/auth.controller.js`
- `src/modules/auth/auth.service.js`
- `src/modules/auth/auth.route.js`
- `src/modules/users/user.model.js`
- `src/core/middlewares/auth.middleware.js`

Routes are auto-injected. Existing files are never overwritten.

```bash
forgex gen:auth
```

> ⚠️ Make sure `JWT_SECRET` and `JWT_EXPIRE` are set in your `.env` file.

---

### `forgex gen:validator <n>`

Generate a Zod or Joi validator for a resource. The library is auto-detected from your `forgex.fx` config (whatever you chose at init).

```bash
forgex gen:validator Product
```

Generates `src/modules/products/product.validator.js` with:
- `create<n>Schema` and `update<n>Schema`
- A `validate()` middleware factory
- `validateCreate<n>` and `validateUpdate<n>` ready to drop into your routes

After generating, ForgeX prints the exact import and usage instructions for your route file.

---

### `forgex gen:middleware <n>`

Generate a custom middleware file in `src/core/middlewares/`.

```bash
forgex gen:middleware RateLimit
forgex gen:middleware Tenant --empty    # Simple sync middleware without catchAsync
```

---

### `forgex migrate`

Run database migrations based on your project's ORM — no need to remember the command.

```bash
forgex migrate                              # Auto-detects ORM and runs migration
forgex migrate --name add-users-table       # Prisma: named migration
```

| ORM | Command it runs |
|---|---|
| Prisma | `npx prisma migrate dev --name <n>` |
| Sequelize | `npx sequelize-cli db:migrate` |
| Mongoose | Tells you no migrations needed |
| Native / None | Tells you to run SQL manually |

---

### `forgex list` (alias: `forgex ls`)

List all active resources with a summary of which files exist per module.

```bash
forgex ls
```

```
┌──────────┬────────────┬───────┬─────────┬───────┬──────────────────────┐
│ Resource │ Controller │ Route │ Service │ Model │ Endpoint             │
├──────────┼────────────┼───────┼─────────┼───────┼──────────────────────┤
│ Products │     ✔      │   ✔   │    ✔    │   ✔   │ /api/v1/products     │
│ Auth     │     ✔      │   ✔   │    ✔    │   ✖   │ /api/v1/auth         │
│ Users    │     ✖      │   ✖   │    ✖    │   ✔   │ Internal (No Route)  │
└──────────┴────────────┴───────┴─────────┴───────┴──────────────────────┘
```

---

## 🗂️ Generated Structure

```
my-api/
├── src/
│   ├── core/
│   │   ├── config/
│   │   │   ├── db.js               # Database connection logic
│   │   │   └── env.js              # Startup env variable validation
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── notFound.js         # 404 handler
│   │   ├── utils/
│   │   │   └── catchAsync.js       # Async wrapper utility
│   │   └── routes.js               # Central router hub (auto-injected)
│   ├── modules/
│   │   └── <feature>/
│   │       ├── <feature>.controller.js
│   │       ├── <feature>.service.js
│   │       ├── <feature>.route.js
│   │       ├── <feature>.model.js
│   │       └── <feature>.validator.js   # if generated
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js                # if linting was selected
├── .prettierrc                     # if linting was selected
├── forgex.fx                       # ForgeX project config (do not delete)
├── package.json
└── README.md
```

---

## 🗄️ Supported Stack

| Category | Options |
|---|---|
| **Framework** | Express.js |
| **Database** | PostgreSQL, MySQL, MongoDB, None |
| **ORM / ODM** | Prisma, Sequelize, Mongoose, Native Drivers |
| **Validation** | Zod, Joi |
| **Package Manager** | npm, yarn, pnpm |
| **Optional Packages** | Helmet, Morgan, Bcrypt, JsonWebToken, Axios |

---

## 🔧 Available Scripts (in generated project)

| Script | Description |
|---|---|
| `dev` | Start with hot-reload via nodemon |
| `start` | Start in production mode |
| `lint` | Run ESLint across `src/` |
| `lint:fix` | Auto-fix ESLint issues |
| `format` | Run Prettier across `src/` |

---

## 🧭 Quick Start Example

```bash
# 1. Scaffold a new project
npx forgex-cli init

# 2. Move into the project
cd my-api

# 3. Add your database credentials
cp .env.example .env

# 4. Generate a resource
forgex gen:resource Product

# 5. Add a validator for it
forgex gen:validator Product

# 6. Add authentication
forgex gen:auth

# 7. Generate a custom middleware
forgex gen:middleware RateLimit

# 8. Run migrations (Prisma or Sequelize)
forgex migrate

# 9. See everything you've built
forgex ls

# 10. Start the server
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to your branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 🐛 Found a Bug?

Open an issue on [GitHub](https://github.com/SoultaneRaqi/ForgeX-CLI/issues) with:
- The command you ran
- Your `forgex.fx` config
- The error message

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

*Forged with 🪓 by [Soultane Raqi](https://github.com/SoultaneRaqi)* [Soultane's Portfolio](https://soultane.vercel.app/)

If ForgeX saved you time, consider giving it a ⭐ on [GitHub](https://github.com/SoultaneRaqi/ForgeX-CLI)!

</div>
