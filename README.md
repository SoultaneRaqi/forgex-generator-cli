# 🛠️ ForgeX CLI: The Ultimate Node.js & Express Scaffolder

## 📖 Vision
ForgeX is a developer-experience (DX) focused command-line interface for Node.js and Express. Inspired by Laravel Artisan, it eliminates boilerplate by generating production-ready folder structures (Standard or Advanced), auto-wiring routes, setting up ORMs, and accelerating the backend development lifecycle.

---

## 🚀 Development Roadmap (Version by Version)

### Phase 1: The Foundation (v1.0.0 - MVP)
**Goal:** Get the core CLI working, generating basic files, and handling standard folder architecture.

- **CLI Setup:** Initialize Commander.js, Inquirer (for prompts), and Chalk (for beautiful, Starship-level terminal aesthetics).

- **`forgex init`:**
  - Prompts user: "Standard (Layered) or Advanced (Modular) architecture?"
  - Generates the base `/src` folder, `app.js`, `server.js`, and config files.
  - Runs `npm init -y` and installs Express, dotenv, cors, etc.

- **`forgex make:controller <name>`:** Generates a controller file with empty CRUD functions.

- **`forgex make:route <name>`:** Generates an Express router file.

- **Auto-wiring (v1 core feature):** When a route is generated, the CLI automatically opens `app.js` (or a central router file), imports the new route, and mounts it (e.g., `app.use('/api/users', userRoutes)`).

---

### Phase 2: The Database & ORM Integration (v1.5.0)
**Goal:** Introduce data persistence using Prisma to handle both SQL (MySQL/PostgreSQL) and NoSQL (MongoDB).

- **`forgex init --database`:** Adds prompt for database selection and installs `@prisma/client`.

- **`forgex make:model <name>`:** Updates the `schema.prisma` file with a new boilerplate model.

- **`forgex make:service <name>`:** Generates a service file pre-injected with Prisma client calls for standard CRUD operations.

- **`forgex migrate`:** A wrapper command that runs `npx prisma migrate dev` directly from the ForgeX CLI.

---

### Phase 3: The "Magic" Commands (v2.0.0)
**Goal:** True automation that saves hours of development time.

- **`forgex make:resource <name>`:** The master command. It generates the Model, Controller, Service, and Route all at once, and wires them together perfectly.

- **Automated API Workspaces:** Every time `make:resource` or `make:route` is run, ForgeX updates a `postman_collection.json` file in the root directory. This allows developers to instantly import expertly crafted Postman collections with pre-configured environments and variables to test their new endpoints immediately.

---

### Phase 4: Open Source Scaling & Community (v3.0.0+)
**Goal:** Make it extensible for the community.

- Add plugin support so other developers can create their own templates (e.g., a GraphQL plugin, or a WebSocket plugin).

- Add a `forgex make:test` command to generate Jest/Supertest boilerplate.

---

## 💻 Technical Stack Required for the CLI
- **Node.js:** Core execution environment.
- **commander:** For parsing terminal commands (make:controller, etc.).
- **inquirer:** For interactive terminal menus.
- **chalk & ora:** For colors and loading spinners in the terminal.
- **ejs:** For template generation (storing your base Express files as `.ejs` templates and injecting variables like the controller name before creating the `.js` file).
- **ast-types or Regex:** For the auto-importing feature (to safely read `app.js`, find the route imports section, and inject the new route without breaking existing code).