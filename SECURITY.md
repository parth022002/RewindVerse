# Security Policy

## Supported Versions

| Version | Supported | Notes |
|---|---|---|
| `1.x` | :white_check_mark: | Current active release branch |
| `< 1.0` | :x: | Deprecated prototypes |

---

## Reporting a Vulnerability

The RewindVerse team takes the security and privacy of machine-learning researchers and their proprietary datasets extremely seriously.

If you believe you have discovered a security vulnerability in RewindVerse:

1. **Do NOT report security vulnerabilities via public GitHub issues.**
2. Send an email with a detailed description, reproduction steps, and proof-of-concept to security@rewindverse.dev (or contact the repository maintainer directly via GitHub Security Advisories).
3. We will acknowledge receipt of your vulnerability report within 48 hours and provide an estimated timeline for remediation.

---

## Security Architecture Highlights

- **100% Client-Side Sandbox:** Optimization simulations and dataset inspections execute locally in the user's browser via Web Workers and IndexedDB. Model weights never transit cloud servers unless explicitly exported by the user.
- **AST Sandboxing:** Algorithm Forge uses strict AST allowlisting (`@babel/parser` / TypeScript AST) preventing `eval()`, `Function()`, prototype poisoning, and unauthorized DOM/network access.
- **Input Validation:** All external data boundaries (CSVs, JSON Lines traces, API payloads) are validated against strict Zod / Pydantic schemas.
- **Credential Protection:** Secrets are never bundled into client distributions.

