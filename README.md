```
  ███████╗ ██████╗ ██████╗  ██████╗ ███████╗██╗  ██╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝╚██╗██╔╝
  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗   ╚███╔╝ 
  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝   ██╔██╗ 
  ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██╔╝ ██╗
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
```

<div align="center">

**Scaffold production-ready Node.js backends in seconds.**

[![npm version](https://img.shields.io/npm/v/forgex-cli?color=orange&style=flat-square)](https://www.npmjs.com/package/forgex-cli)
[![npm downloads](https://img.shields.io/npm/dm/forgex-cli?color=orange&style=flat-square)](https://www.npmjs.com/package/forgex-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green?style=flat-square)](https://nodejs.org)

[Getting Started](#-getting-started) · [Commands](#-commands) · [Generated Structure](#-generated-structure) · [Stack](#-supported-stack) · [Contributing](#-contributing)

</div>

---

## What is ForgeX?

**ForgeX CLI** is an interactive command-line tool that scaffolds fully structured, production-ready Node.js/Express backends in seconds. Answer a few prompts — pick your database, ORM, extra packages, and package manager — and ForgeX generates a complete, organized project so you can skip the boilerplate and start building immediately.

No more copy-pasting starter code. No more manual folder setup. Just `npx forgex-cli` and forge.

---

## ✨ Features

- 🏗️ **Modular architecture** — Feature-based folder structure that scales cleanly as your project grows
- 🗄️ **Multi-database support** — PostgreSQL, MySQL, MongoDB, or no database
- 🔌 **ORM / ODM choices** — Prisma, Mongoose, or native drivers
- 📦 **Package manager aware** — Works with `npm`, `yarn`, and `pnpm`
- 🔐 **JWT Auth generation** — Full authentication system (register, login, protected routes) in one command
- ⚡ **Smart generators** — Scaffold individual controllers, services, routes, models, or full CRUD resources
- 🔁 **Auto route injection** — Generated routes are automatically wired into the central router
- 🛠️ **Extra packages** — Optionally include Helmet, Morgan, Zod, Bcrypt, JWT, or Axios at init time
- 📄 **Pre-configured files** — `.env.example`, `nodemon` config, and a ready-to-use `README.md`
- 🔒 **Environment-safe** — Secrets stay out of your repo thanks to `.gitignore` and `.env.example`
- 🌿 **Git ready** — Repository initialized with an initial commit automatically

---

## 📦 Getting Started

### Requirements

- Node.js `>= 16`
- npm, yarn, or pnpm

### Run without installing

```bash
npx forgex-cli
```

### Or install globally

```bash
npm install -g forgex-cli
forgex
```

---

## 🚀 Commands

### `forgex init`

Interactively scaffold a new project. You'll be prompted to choose:

- Project name
- Package manager (`npm` / `yarn` / `pnpm`)
- Database (`PostgreSQL` / `MySQL` / `MongoDB` / `None`)
- ORM / ODM (`Prisma` / `Mongoose` / `None`)
- Extra packages (`Helmet`, `Morgan`, `Zod`, `Bcrypt`, `JsonWebToken`, `Axios`)
- Whether to start the dev server immediately

```bash
forgex init
```

```
? What is the name of your project?               my-api
? Which package manager do you prefer?            npm
? Which database will you use?                    PostgreSQL
? Which ORM/ODM do you want to use?               Prisma
? Select additional packages to install:          Helmet, Morgan
? Start the development server after setup?       Yes

  ✔ Project scaffolded
  ✔ Dependencies installed
  ✔ Git repository initialized
  ✔ You're ready to forge!
```

---

### `forgex gen:resource <Name>`

Generate a complete CRUD module (controller + service + route + model) and auto-inject the route.

```bash
forgex gen:resource Product
```

Use flags to skip specific files:

```bash
forgex gen:resource Notification --no-model     # Skip the model
forgex gen:resource Report --no-service         # Skip the service
forgex gen:resource Log --no-controller         # Skip the controller
forgex gen:resource Webhook --no-route          # Skip the route
```

---

### `forgex gen:controller <Name>`
### `forgex gen:service <Name>`
### `forgex gen:route <Name>`
### `forgex gen:model <Name>`

Generate a single file of the specified type. Routes are auto-injected into `src/core/routes.js`.

```bash
forgex gen:controller User
forgex gen:service Order
forgex gen:route Product
forgex gen:model Category
```

**Generation flags** (work on all `gen:*` commands):

| Flag | Description |
|---|---|
| `-c, --crud` | Generate with full CRUD boilerplate (default) |
| `-e, --empty` | Generate an empty file with minimal boilerplate |
| `-f, --force` | Overwrite an existing file |

```bash
forgex gen:controller Payment --empty    # Minimal boilerplate
forgex gen:service User --force          # Overwrite existing file
```

---

### `forgex gen:auth`

Generate a complete JWT authentication system in one command. Creates:

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

### `forgex list` (alias: `forgex ls`)

List all active resources in your project with a summary of which files exist per module.

```bash
forgex ls
```

```
┌──────────┬────────────┬───────┬─────────┬───────┬─────────────────────┐
│ Resource │ Controller │ Route │ Service │ Model │ Endpoint            │
├──────────┼────────────┼───────┼─────────┼───────┼─────────────────────┤
│ Product  │     ✔      │   ✔   │    ✔    │   ✔   │ /api/v1/products    │
│ Auth     │     ✔      │   ✔   │    ✔    │   ✖   │ /api/v1/auths       │
│ User     │     ✖      │   ✖   │    ✖    │   ✔   │ Internal (No Route) │
└──────────┴────────────┴───────┴─────────┴───────┴─────────────────────┘
```

---

## 🗂️ Generated Structure

```
my-api/
├── src/
│   ├── core/
│   │   ├── config/
│   │   │   └── db.js               # Database connection logic
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── notFound.js         # 404 handler
│   │   ├── utils/
│   │   │   └── catchAsync.js       # Async wrapper utility
│   │   └── routes.js               # Central router hub
│   ├── modules/
│   │   └── <feature>/
│   │       ├── <feature>.routes.js
│   │       ├── <feature>.controller.js
│   │       ├── <feature>.service.js
│   │       └── <feature>.model.js
│   ├── app.js
│   └── server.js
├── .env                            # Your local environment variables
├── .env.example                    # Environment variable template (safe to commit)
├── .gitignore
├── forgex.fx                       # ForgeX project config (do not delete)
├── package.json
└── README.md
```

> All feature logic lives in `src/modules/` — one folder per domain. Global concerns (config, middleware, utilities) live in `src/core/`. Clean, obvious, and easy to extend.

---

## 🗄️ Supported Stack

| Category | Options |
|---|---|
| **Framework** | Express.js |
| **Database** | PostgreSQL, MySQL, MongoDB, None |
| **ORM / ODM** | Prisma, Mongoose, Native Drivers |
| **Package Manager** | npm, yarn, pnpm |
| **Optional Packages** | Helmet, Morgan, Zod, Bcrypt, JsonWebToken, Axios |

---

## 🔧 Available Scripts (in generated project)

| Script | Description |
|---|---|
| `dev` | Start with hot-reload via nodemon |
| `start` | Start in production mode |

---

## 🧭 Quick Start Example

```bash
# 1. Scaffold a new project
npx forgex-cli init

# 2. Enter the project
cd my-api

# 3. Add your database credentials
cp .env.example .env

# 4. Generate a resource
forgex gen:resource Product

# 5. Add authentication
forgex gen:auth

# 6. See what you've built
forgex ls

# 7. Start the server
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

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

*Forged with 🪓 by [Soultane Raqi](https://github.com/SoultaneRaqi)*

If ForgeX saved you time, consider giving it a ⭐ on [GitHub](https://github.com/SoultaneRaqi/ForgeX-CLI)!

</div>