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

[Getting Started](#-getting-started) · [Features](#-features) · [Usage](#-usage) · [Generated Structure](#-generated-structure) · [Contributing](#-contributing)

</div>

---

## What is ForgeX?

**ForgeX CLI** is an interactive command-line tool that scaffolds fully structured, production-ready Node.js backends in seconds. Answer a few prompts — pick your database, ORM, and package manager — and ForgeX generates a complete, organized project so you can skip the boilerplate and start building immediately.

No more copy-pasting starter code. No more manual folder setup. Just `npx forgex-cli` and forge.

---

## ✨ Features

- 🏗️ **Modular architecture** — Feature-based folder structure that scales cleanly as your project grows
- 🗄️ **Multi-database support** — PostgreSQL, MySQL, MongoDB, and SQLite out of the box
- 🔌 **ORM / ODM choices** — Prisma, Sequelize, Mongoose, or native drivers
- 📦 **Package manager aware** — Works with `npm`, `yarn`, and `pnpm`
- ⚡ **Auto-install** — Optionally installs dependencies immediately after scaffolding
- 📄 **Pre-configured files** — `.env.example`, `nodemon` config, ESLint, and a ready-to-use `README.md`
- 🔐 **Environment-safe** — Secrets never end up in your repo thanks to `.gitignore` and `.env.example` out of the box

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

## 🚀 Usage

Just run the CLI and answer the interactive prompts:

```bash
npx forgex-cli
```

```
? What is your project name?          my-api
? Which database will you use?        PostgreSQL
? Which ORM / ODM?                    Prisma
? Which package manager?              npm
? Auto-install dependencies?          Yes

  ✔ Project scaffolded
  ✔ Dependencies installed
  ✔ You're ready to forge!
```

Then start building:

```bash
cd my-api
cp .env.example .env   # add your DB credentials
npm run dev
```

---

## 🗂️ Generated Structure

```
my-api/
├── src/
│   ├── core/
│   │   ├── config/           # App-wide configuration (env, db connection)
│   │   └── middleware/       # Global middlewares (error handler, auth, etc.)
│   └── modules/
│       └── <feature>/
│           ├── <feature>.routes.js
│           ├── <feature>.controller.js
│           └── <feature>.service.js
├── .env.example              # Environment variable template
├── .gitignore
├── nodemon.json
├── package.json
└── README.md                 # Auto-generated project README
```

> All application logic lives in `src/modules/` — one folder per domain. Global concerns (config, middleware) live in `src/core/`. Clean, obvious, and easy to extend.

---

## 🗄️ Supported Stack

| Category | Options |
|---|---|
| **Database** | PostgreSQL, MySQL, MongoDB, SQLite |
| **ORM / ODM** | Prisma, Sequelize, Mongoose, Native Drivers |
| **Package Manager** | npm, yarn, pnpm |
| **Framework** | Express.js |

---

## 🔧 Available Scripts (in generated project)

| Script | Description |
|---|---|
| `dev` | Start with hot-reload via nodemon |
| `start` | Start in production mode |
| `lint` | Run ESLint across the project |
| `test` | Run the test suite |

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