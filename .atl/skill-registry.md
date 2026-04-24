# Skill Registry

As your FIRST step before starting any work, identify and load skills relevant to your task from this registry.

## User Skills

| Trigger               | Skill       | Path                                           |
| --------------------- | ----------- | ---------------------------------------------- |
| Node.js coding tasks  | sdd-apply   | ~/.config/opencode/skills/sdd-apply/SKILL.md   |
| Verify implementation | sdd-verify  | ~/.config/opencode/skills/sdd-verify/SKILL.md  |
| Break down tasks      | sdd-tasks   | ~/.config/opencode/skills/sdd-tasks/SKILL.md   |
| Write specs           | sdd-spec    | ~/.config/opencode/skills/sdd-spec/SKILL.md    |
| Create proposal       | sdd-propose | ~/.config/opencode/skills/sdd-propose/SKILL.md |
| Explore/investigate   | sdd-explore | ~/.config/opencode/skills/sdd-explore/SKILL.md |
| Technical design      | sdd-design  | ~/.config/opencode/skills/sdd-design/SKILL.md  |
| Archive change        | sdd-archive | ~/.config/opencode/skills/sdd-archive/SKILL.md |
| SDD init              | sdd-init    | ~/.config/opencode/skills/sdd-init/SKILL.md    |

## Project Conventions

| File                 | Path                                                      | Notes                       |
| -------------------- | --------------------------------------------------------- | --------------------------- |
| Architecture pattern | src/routes/ → src/controllers/ → src/services/ → src/dao/ | Layered architecture        |
| Database             | src/config/database.js, src/dao/database.js               | Sequelize connection        |
| Logging              | src/utils/logger.js                                       | Winston with daily rotation |
| API Docs             | src/config/swagger.js                                     | Swagger UI available        |

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21
- **ORM**: Sequelize 6.37
- **Database**: PostgreSQL (pg)
- **Logging**: Winston + winston-daily-rotate-file
- **API Docs**: Swagger-jsdoc + swagger-ui-express
- **Testing**: Jest + supertest
- **Quality**: ESLint, Prettier, Husky, Commitlint, standard-version

## Notes

- Persistence mode: **engram** (no openspec directory)
- Project is initialized and ready for SDD workflow
