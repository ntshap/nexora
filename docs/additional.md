# Additional Notes

- **Spec Kit Usage:** see `spec/spec.yaml` for the initial specification. When Spec Kit CLI is available, run:
  ```bash
  uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
  specify init .
  ```
  Then use the slash commands (`/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) inside your AI assistant to keep the project aligned with the spec.
- **Environments:** create `.env` (root) and `.env.local` (web) by copying the provided examples.
- **Testing checklist:** `npm run lint && npm run build` (web), `pytest` / `ruff` (backend once added), `forge test` (contracts).

Future documentation to add:
- Deployment playbooks (Vercel + Railway).
- Governance and security audit notes when contracting partners.
