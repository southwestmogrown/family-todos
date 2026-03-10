# Family Todos

A React + Vite app for tracking family workouts, chores, and wellness.

## Live Site

**https://www.shanewilkey.com/family-todos/**

(or `https://southwestmogrown.github.io/family-todos/` if no custom domain is configured)

## GitHub Pages Setup (one-time)

1. Go to **Settings → Pages** in this repository.
2. Under **Source**, choose **Deploy from a branch**.
3. Set **Branch** to `main` and **Folder** to `/dist`.
4. Click **Save**.

The pre-built `dist/` folder is committed directly to this repo, so GitHub Pages serves it immediately without any build step at deploy time. On every push to `main`, the `Build and commit dist` workflow rebuilds the app and commits the updated `dist/` automatically.

## Local Development

```bash
npm install
npm run dev        # start dev server
npm run build      # build to dist/
npm run preview    # preview production build
```
