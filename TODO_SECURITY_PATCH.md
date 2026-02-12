# TODO: Security Patch Investigation

## Status: DEFERRED (User in class)

## Problem
Vercel auto-generated security patch PR (#1) causes complete app failure:
- JavaScript hydration fails
- Nothing clickable
- App completely non-interactive
- Error: "Application error: a client-side exception has occurred"

## What Was Done
1. ✅ Closed security patch PR to prevent deployment
2. ✅ Applied PWA mobile hydration fix (commit ff46d05)
3. ✅ Archived unused tutor version from hvac-student-resources repo

## Security Vulnerabilities (Still Unfixed)
- **GitHub Advisory:** GHSA-9qr9-h5gf-34mp
- **React CVE:** CVE-2025-55182
- **Next.js CVE:** CVE-2025-66478
- **Issue:** Critical RCE in React Server Components

## Next Steps (Use Opus 4.6)
1. **Analyze the security patch PR changes:**
   - Diff the package.json changes
   - Identify React/Next.js version bumps
   - Check for breaking changes in new versions

2. **Investigate hydration failure:**
   - Test locally with new React/Next.js versions
   - Check browser console errors
   - Identify which component/code is breaking

3. **Fix breaking changes:**
   - Update code to be compatible with new React/Next.js versions
   - Test thoroughly on desktop AND mobile
   - Ensure PWA components still work

4. **Apply security patch safely:**
   - Merge security updates WITHOUT breaking the app
   - Verify all functionality works
   - Deploy to production

## Commands to Resume Work
```bash
cd /c/Users/user/clawd/gas-technician-ai-tutor
gh pr list --state closed
gh pr view 1  # View closed security PR
git diff main vercel/react-server-components-cve-vu-v7rb6j  # See PR changes
```

## Repository Clarification
- ✅ **CORRECT REPO:** `MikeKapin/gas-technician-ai-tutor` (deploys to Vercel)
- ❌ **ARCHIVED:** `hvac-student-resources/gas-tech-tutor.archived` (no longer used)

---
**Priority:** HIGH (Critical security vulnerability)
**Assigned:** Claude Opus 4.6 (for deep analysis)
**Date:** 2026-02-12
