# Security Policy

## Supported Versions

This repository is a personal portfolio site. Only the code deployed from `main`
to <https://yunosukeyoshino.com> is maintained. There are no released versions or
backports.

## Reporting a Vulnerability

Please **do not open a public issue** for security problems.

Use GitHub's private vulnerability reporting instead:
[Report a vulnerability](https://github.com/YunosukeYoshino/Portfolio/security/advisories/new).

If you cannot use that form, reach out through the contact form at
<https://yunosukeyoshino.com/contact>.

When reporting, please include:

- The affected URL, route, or file path
- Steps to reproduce, plus any request/response details
- The impact you believe it has

I aim to acknowledge reports within a week. Since this is a personal project
maintained in spare time, there is no formal SLA and no bug bounty.

## Scope

In scope:

- Source code in this repository
- The deployed site at <https://yunosukeyoshino.com>

Out of scope:

- Vulnerabilities in third-party services used by the site (microCMS, Cloudflare,
  Resend, Google Analytics) — report those to the vendor directly
- Findings that require physical access, social engineering, or denial of service
- Missing security headers or best practices with no demonstrable impact
