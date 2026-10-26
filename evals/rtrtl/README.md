# RTRTL eval cases

Behaviour tests for the skill in `skills/rtrtl/`. They live outside the skill folder so installs and the published bundle never carry them.

Each case is a folder in the layout `claude plugin eval` reads:

```
evals/rtrtl/<case-name>/
├── prompt.md        settings block, then the prompt exactly as a user would type it
├── case.yaml        schema_version "1.1", the name, and the expected outcome in words
└── graders/         one verifiable statement per file (01-…md, 02-…md)
```

Input files go in a `files/` folder beside them, with a `place-files.sh` scaffold script named in `case.yaml`.

## Conventions

- Name a case after the area it covers and what it checks: `core-`, `web-`, `office-`, `video-` or `text-`, then a few words (`web-intl-currency-isolated`).
- Add a change's cases before editing the skill, and run them against both the old and the new skill. A change lands only when the new skill passes what the old one failed and still passes everything else.
- A case that the old skill and the no-skill baseline already pass proves nothing about a change. Keep it only as a regression or restraint guard (the two `core-` cases are both: in their first run, every arm passed).
- Every area also keeps a restraint case: an ordinary Hebrew request must not make the skill open references, render files or run checks it does not need.
- Write graders about the result itself ("`report.html` sets `dir="rtl"` on `<html>`"), and use `focus: trace` when the statement is about what the run did.
- Prompts and graders state facts with primary sources (specifications, library source, official documentation) or this repository's own evidence in `COMPATIBILITY.md`. `tests/test_evals.py` checks the layout.

## Running

`scripts/run_evals.sh` copies a skill version and these cases into a throwaway plugin wrapper outside the repository and runs `claude plugin eval` there, so results never land in the checkout:

```sh
scripts/run_evals.sh --case 'web-*'                    # the working tree's skill
scripts/run_evals.sh --ref origin/main --case 'web-*'  # the skill as it is on main
```

Extra options pass through to `claude plugin eval`. It runs each case once by default (`RTRTL_EVAL_RUNS` changes this) with and without the skill, and keeps the report local. These are real, billed model runs: filter with `--case` or `--tag` while working on one area.
