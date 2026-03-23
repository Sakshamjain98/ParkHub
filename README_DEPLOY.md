# Deployment and CI/CD setup

This document describes the files added to dockerize the monorepo and set up CI/CD that builds Docker images, pushes them to GHCR, deploys the backend to Render, and deploys frontends to Vercel.

Files added
- [apps/api/Dockerfile](apps/api/Dockerfile)
- [apps/web/Dockerfile](apps/web/Dockerfile)
- [apps/web-admin/Dockerfile](apps/web-admin/Dockerfile)
- [apps/web-manager/Dockerfile](apps/web-manager/Dockerfile)
- [apps/web-valet/Dockerfile](apps/web-valet/Dockerfile)
- [.github/workflows/ci-deploy.yml](.github/workflows/ci-deploy.yml)
- [render.yaml](render.yaml)

Required repository secrets (GitHub):
- `RENDER_API_KEY` — Render API key (for triggering deploys)
- `RENDER_API_SERVICE_ID` — Render service ID for the API
- `VERCEL_TOKEN` — Vercel personal token (deploy frontends)
- `GITHUB_TOKEN` — provided by Actions automatically for GHCR login

How the workflow works
- On push to `main` the workflow builds Docker images for the API and each frontend and pushes them to GHCR (`ghcr.io/<owner>/<repo>/<app>:latest`).
- After images are pushed it triggers a Render deploy for the API service using `RENDER_API_SERVICE_ID`.
- It then runs the Vercel CLI to deploy each frontend (`apps/web`, `apps/web-admin`, `apps/web-manager`, `apps/web-valet`) to your Vercel projects.

Next steps / checklist
1. Create Vercel projects for each frontend and set `VERCEL_TOKEN` in GitHub Secrets.
2. Create a Render Web Service for the API (use Docker or repo build) and a Render Postgres instance; set `RENDER_API_SERVICE_ID` and `RENDER_API_KEY` in GitHub Secrets.
3. Verify the Dockerfiles match your build needs. Monorepo builds copy the whole repo and run `yarn --cwd <app> build` — if you use a different package manager or custom build steps, update the Dockerfiles and workflow accordingly.
4. Optionally update the GHCR tags to include commit SHA or semantic tags for better release control.

Local testing
- Build API image locally:
  ```bash
  docker build -t parkhub-api:local -f apps/api/Dockerfile .
  ```
- Build web app locally:
  ```bash
  docker build -t parkhub-web:local -f apps/web/Dockerfile .
  ```

If you want, I can:
- update Dockerfiles to use a different package manager (pnpm) or optimize multi-stage caching
- add GitHub Actions job to push images to Docker Hub or GHCR with tags per commit
- generate Render and Vercel setup instructions for first-time provisioning
