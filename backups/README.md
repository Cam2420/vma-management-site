# Previous live VMA website

This folder preserves the website live immediately before the performance-pilot redesign launched on 16 September 2026.

- Archive: `live-site-before-redesign-2026-09-16.zip`
- Source commit: `4d819eb42cf62b300e70bb5459984b78b7a61abb`
- Previous Vercel deployment: `dpl_CJe8WbT6QNnmp7us4kestQXTCL4n`
- Previous deployment URL: https://vma-management-site-hoi1mo6cj-shore-day.vercel.app
- Every archived file was compared byte for byte with that Git commit. The manifest records SHA-256 checksums.

## Download and restore

1. In GitHub, open this ZIP and select **Download raw file**. Unzip it into a separate folder.
2. The extracted folder contains the old site pages, scripts, images, fonts and Vercel settings, with their original paths.
3. To restore production, ask the site maintainer to restore this snapshot in a new Git commit and publish it. Preserve this backup folder and confirm the deployment excludes it.
4. For a quick rollback, the previous deployment can also be restored through the existing Vercel project if it remains available.

This is a source backup. External booking/audit/chat configuration, account permissions, DNS, and provider data are not stored in it.

## Publication exclusion

The build only publishes the website files to `dist/`. This backup folder is outside that output and is also excluded by `.vercelignore`. It remains accessible in the GitHub repository, which is public.
