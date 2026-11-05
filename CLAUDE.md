# Karpathy Guidelines — Engineering Discipline

This repository follows the coding principles inspired by Andrej Karpathy and packaged by `multica-ai/andrej-karpathy-skills`.

## 1. Think Before Coding
- **Never guess silently:** If something in requirements or existing architecture is ambiguous, state your assumptions or ask for clarification before editing.
- **Surface trade-offs:** Present viable alternatives instead of silently choosing an implementation path.
- **Voice simpler solutions:** If a cleaner or more straightforward approach exists, explain it.
- **Stop when confused:** Identify and articulate the exact point of confusion rather than proceeding blindly.

## 2. Simplicity First
- **Minimum code:** Write only the minimal, essential lines needed to solve the problem.
- **No speculative features:** Do not implement features, configurations, or parameters that were not requested.
- **No premature abstractions:** Avoid single-use wrappers, interfaces, or helper layers when direct code is simpler.
- **Senior Engineer Test:** Ask: *"Would a senior engineer say this is overcomplicated?"* If yes, refactor down to the simplest correct form.

## 3. Surgical Changes
- **Tight diffs:** Only modify lines and files strictly required for the prompt.
- **No drive-by refactorings:** Never reformat, rename, or restyle unrelated code, files, or comments.
- **Match existing patterns:** Adhere to the conventions and idioms already in place in the codebase.
- **Clean your mess:** Remove any unused imports, dead variables, or debug logging that your own changes introduced.

## 4. Goal-Driven Execution
- **Verifiable targets:** Translate tasks into concrete verification criteria before editing code.
- **Loop until verified:** Run compiler checks (`dotnet build`, `ng build`), tests, and linting.
- **Evidence-based completion:** Confirm success with real terminal output and zero errors before considering any task done.
