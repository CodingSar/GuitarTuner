---
id: concern/security-web
title: Web app security
researched: 2026-10-10
tier: deep
sources:
  - https://w3c.github.io/webappsec-csp/
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
  - https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
  - https://vite.dev/config/build-options
  - https://www.w3.org/TR/permissions-policy-1/
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
  - https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
  - https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for
  - https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  - https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json
  - https://docs.npmjs.com/cli/v10/commands/npm-ci
  - https://docs.npmjs.com/cli/v10/using-npm/config
  - https://docs.npmjs.com/cli/v10/commands/npm-audit
  - https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
  - https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
  - https://docs.github.com/en/actions/reference/security/secure-use
  - https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
  - https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
  - https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository
  - https://www.rfc-editor.org/rfc/rfc9116
  - https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
---

| ID | Level | Rule | Enforce | Source |
|---|---|---|---|---|
| SEC-001 | MUST | Serve a default-deny Content-Security-Policy with script-src 'self', style-src 'self', connect-src 'none', object-src 'none', base-uri 'none' and form-action 'none'. | review | https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html |
| SEC-002 | MUST | Keep 'unsafe-inline' and 'unsafe-eval' out of every Content-Security-Policy in index.html. | check-cmd: ! grep -q "unsafe-" index.html | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy |
| SEC-003 | MUST | After each production build, confirm the output has no inline script or style and no eval or Function call, and write the policy to match the output. | review | https://vite.dev/config/build-options |
| SEC-004 | MUST | Send frame-ancestors 'none' as a response header only, and record clickjacking as unmitigated when the host cannot send headers. | review | https://w3c.github.io/webappsec-csp/ |
| SEC-005 | MUST | Send Permissions-Policy with microphone=(self) and disable unused features with an empty list, such as camera=() and geolocation=(). | review | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy |
| SEC-006 | MUST | Never send microphone=() for this app, because it disables the microphone for the app's own origin. | review | https://www.w3.org/TR/permissions-policy-1/ |
| SEC-007 | MUST | Load no third-party scripts, styles, fonts or frames, and grant no iframe allow attributes; if a third-party file is ever added, require Subresource Integrity with CORS. | review | https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity |
| SEC-008 | SHOULD | Start Strict-Transport-Security at max-age=31536000 and add includeSubDomains and preload only after every subdomain is confirmed to serve HTTPS. | review | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security |
| SEC-009 | MUST | Set Referrer-Policy to strict-origin-when-cross-origin explicitly, as a response header or a meta element. | review | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy |
| SEC-010 | MUST | Send X-Content-Type-Options: nosniff and Cross-Origin-Opener-Policy: same-origin as response headers. | review | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options |
| SEC-011 | SHOULD | Add require-trusted-types-for 'script' to the Content-Security-Policy once the source tree has no string sinks, and with no trusted-types allowlist. | review | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for |
| SEC-012 | MUST | Do not use innerHTML, outerHTML, insertAdjacentHTML or document.write in source code. | check-cmd: ! grep -rnE -e innerHTML -e outerHTML -e insertAdjacentHTML -e "document\.write" src | https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html |
| SEC-013 | MUST | Render text with textContent, createElement, setAttribute for non-executable attributes, or canvas fillText, and never with markup strings. | review | https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML |
| SEC-014 | MUST | Do not call eval, and do not call the Function constructor. | lint: eslint no-eval | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval |
| SEC-015 | MUST | Do not pass a string to setTimeout or setInterval. | lint: eslint no-implied-eval | https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html |
| SEC-016 | MUST | Treat location.hash, query strings, storage and file inputs as untrusted; parse stored data with JSON.parse and validate it against an allowlist before use. | review | https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html |
| SEC-017 | MUST | Add no window message listener unless a feature needs one; if one is added, check event.origin and event.source, validate the message syntax, and send with an exact targetOrigin, never "*". | review | https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage |
| SEC-018 | MUST | Commit package-lock.json and install with npm ci in CI and in every deploy job. | check-cmd: test -f package-lock.json | https://docs.npmjs.com/cli/v10/commands/npm-ci |
| SEC-019 | MUST | Set ignore-scripts=true in .npmrc, and review each package that needs an install script before adding an exception. | check-cmd: grep -qx "ignore-scripts=true" .npmrc | https://docs.npmjs.com/cli/v10/using-npm/config |
| SEC-020 | MUST | Run npm audit in CI as an advisory gate, and do not treat a clean audit as proof that dependencies are safe. | review | https://docs.npmjs.com/cli/v10/commands/npm-audit |
| SEC-021 | SHOULD | Review dependency advisories through a vulnerability-management process, because scanners miss issues that have no CVE and keep flagging patched versions. | review | https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html |
| SEC-022 | MUST | Declare permissions in every workflow file, with contents: read at the top level and write scopes granted per job only. | review | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax |
| SEC-023 | MUST | Pin every third-party action to a full-length commit SHA from its upstream repository. | check-cmd: ! grep -rnE "uses: [^#]+@v[0-9]" .github/workflows | https://docs.github.com/en/actions/reference/security/secure-use |
| SEC-024 | MUST | Do not use the pull_request_target trigger, and never check out pull request code in a workflow that holds write scopes or secrets. | check-cmd: ! grep -rn pull_request_target .github/workflows | https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows |
| SEC-025 | SHOULD | Pass untrusted expression values into workflow steps through environment variables, not by interpolating them into inline scripts. | review | https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions |
| SEC-026 | MUST | Commit SECURITY.md in the repository root or in .github, naming the supported versions and a private reporting route. | check-cmd: test -f SECURITY.md -o -f .github/SECURITY.md | https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository |
| SEC-027 | MUST | Publish security.txt over HTTPS under /.well-known/ with a Contact field and an Expires field less than one year away, and resolve where a project site's /.well-known/ path sits before publishing. | review | https://www.rfc-editor.org/rfc/rfc9116 |
| SEC-028 | MUST | Write a privacy notice that names the host's IP logging, lists every browser storage key the app writes, explains how to clear it, and avoids the claim that nothing is collected. | review | https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages |
