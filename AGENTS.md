<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development practices

### Test-Driven Development (TDD) is mandatory

**Always write a failing test before writing any implementation.** No exceptions.

Follow the red-green-refactor loop:
1. **RED** — write one test for one behaviour; confirm it fails
2. **GREEN** — write the minimal code to make it pass
3. **REFACTOR** — clean up, then repeat

Do not write implementation files speculatively and fill in tests afterwards. If you catch yourself creating a source file before a test file, stop and delete it.
