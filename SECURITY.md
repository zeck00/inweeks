# Security Policy

## Reporting a Vulnerability

If you discover a security issue in In Weeks, please report it privately by opening a [private security advisory](https://github.com/zeck00/inweeks/security/advisories/new) on GitHub.

Please **do not** open a public issue for security vulnerabilities.

## What we consider in scope

- XSS, CSRF, or injection vulnerabilities in the In Weeks web app
- Issues that could lead to data leakage from `localStorage`
- Supply chain risks in our dependencies
- Vulnerabilities in the share image generation flow

## What we consider out of scope

- Issues in third-party services (Google Fonts CDN, Vercel hosting)
- Self-XSS via browser console
- Lack of rate limiting on a static site
- "Issues" that require physical access to the user's device
- Anything that requires the victim to install a malicious browser extension

## Response time

We aim to respond to security reports within 7 days and to release a fix within 30 days for confirmed issues.

## Recognition

Reporters of valid issues will be credited (with permission) in the release notes.
