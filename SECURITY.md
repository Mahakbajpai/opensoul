# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of OpenSoul seriously. If you discover a security vulnerability, please report it responsibly.

**Please do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **GitHub Private Vulnerability Reporting** (preferred):
   Go to [Security Advisories](https://github.com/NJX-njx/opensoul/security/advisories/new) and create a new advisory.

2. **Email**: If private vulnerability reporting is not available, contact the maintainer through GitHub.

### What to Include

- A description of the vulnerability
- Steps to reproduce the issue
- Impact assessment (what could an attacker achieve?)
- A minimal proof-of-concept (if possible)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within **48 hours**.
- **Assessment**: We will assess the severity and impact within **7 days**.
- **Fix**: Critical vulnerabilities will be addressed as a priority. We aim to release a fix within **30 days** of confirmation.
- **Disclosure**: We follow coordinated disclosure. We will work with you on a timeline for public disclosure after a fix is available.

## Security Best Practices for Self-Hosting

When self-hosting OpenSoul, please ensure:

- Keep Node.js (>=22) and all dependencies up to date
- Use strong, unique tokens for gateway authentication
- Run behind a reverse proxy (nginx/Caddy) with TLS in production
- Restrict network access to the gateway port
- Regularly review and apply security updates via `pnpm update`
- Never expose API keys or tokens in public channels

## Dependency Security

We use [Dependabot](https://github.com/NJX-njx/opensoul/security/dependabot) to monitor dependencies for known vulnerabilities and apply updates promptly.
