---
name: karpathy-guidelines
description: Core engineering discipline and coding guidelines inspired by Andrej Karpathy. Enforces 4 foundational rules for AI coding assistants: Think Before Coding, Simplicity First, Surgical Changes, and Goal-Driven Execution. Use on all programming, debugging, refactoring, and feature tasks.
---

# Andrej Karpathy Coding Guidelines

> "The failure modes of LLMs when writing code are predictable: silent assumptions, over-engineering, unrequested drive-by changes, and guessing instead of verifying."

These guidelines enforce strict discipline and high-craft engineering for AI coding assistants.

---

## 1. Think Before Coding
> **"Never guess. Surface assumptions. Stop when confused."**

- **State your assumptions explicitly:** Never guess when you can verify or ask the user.
- **Surface trade-offs:** If a task has multiple viable implementations, present them clearly rather than silently picking one.
- **Push back when warranted:** If a simpler, safer, or better architectural approach exists, voice it respectfully.
- **Stop when confused:** Name what is unclear or ambiguous rather than pretending to understand and writing erroneous code.

---

## 2. Simplicity First
> **"Minimum code that solves the problem. Pass the Senior Engineer Test."**

- **Write only what was asked:** Zero speculative features, zero premature generalizations, zero code for impossible scenarios.
- **No unnecessary abstractions:** Avoid single-use helpers, wrapper classes, or deep indirection where direct, straightforward logic is superior.
- **The Senior Engineer Test:** Ask yourself: *"Would a senior engineer look at this diff and say it's overcomplicated?"* If the answer is yes, simplify and strip out unnecessary lines.

---

## 3. Surgical Changes
> **"Touch only what you must. Clean up only your own mess."**

- **Strict scope:** Limit your edits strictly to the lines and files required to solve the user's prompt.
- **No drive-by refactors:** Do not alter adjacent code, comments, or formatting just because you see room for improvement.
- **Match existing style:** Adopt the codebase's existing conventions, idioms, and patterns even if you would write them differently from scratch.
- **Traceability:** Every single changed line must trace directly back to a concrete part of the user's request.
- **Clean your mess:** Remove any temporary debug logs, imports, or dead variables that *your changes* introduced, but preserve unrelated existing code.

---

## 4. Goal-Driven Execution
> **"Define success criteria before writing code. Loop until verified."**

- **Concrete goals:** Transform vague instructions into clear, declarative, and verifiable targets before touching files.
- **The Verification Loop:**
  1. Identify or establish the verification step (unit test, compiler build, linter, runtime check).
  2. Implement the minimal change.
  3. Run the verification command (e.g., `dotnet build`, `ng build`, `npm test`).
  4. Inspect the output; iterate until 0 errors and zero regressions are achieved.
- **Never claim completion without evidence:** Back every claim of success with actual terminal output or verifiable test results.
