# Release and GitHub Pages Policy

GitHub Pages serves only a validated stable Git tag. Pushes to `main` and non-stable tags do not publish the portfolio.

## Tag formats

| Channel | Format | Example | Deployment |
| --- | --- | --- | --- |
| Development | `v<major>.<minor>.<patch>-dev<number>+YYYYMMDD` | `v1.2.0-dev1+20260926` | Validated only |
| Test | `v<major>.<minor>.<patch>-test+YYYYMMDD` | `v1.2.0-test+20260926` | Validated only |
| Stable | `v<major>.<minor>.<patch>+YYYYMMDD` | `v1.2.0+20260926` | Validated and deployed |

The date uses UTC calendar format: `YYYYMMDD`. Stable releases must have no `-dev` or `-test` suffix.

## Release flow

1. Push ordinary work to `main`. It is not deployed.
2. Optionally tag a work-in-progress snapshot with a development tag.
3. Tag the candidate commit with a test tag. The workflow runs type checking, linting, and the static export build.
4. When the test-tag workflow succeeds, create the matching stable tag on the same commit. The stable-tag workflow repeats verification and then deploys it to GitHub Pages.

Example commands:

```bash
git tag v1.2.0-test+20260926
git push origin v1.2.0-test+20260926

# After the test workflow is green:
git tag v1.2.0+20260926
git push origin v1.2.0+20260926
```

The deployment workflow refuses to replace the site with an older stable tag. To roll back, create a newer stable release tag on the commit you want to restore.
