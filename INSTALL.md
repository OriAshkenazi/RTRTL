# Install RTRTL

RTRTL is an open-source skill for **Codex, Claude Code, Antigravity and any
other coding agent that supports skills**. The same `skills/rtrtl` folder
contains `SKILL.md` and its supporting files. Install the complete folder in
the location your coding agent uses for skills.

The bundled Python installer works offline and needs no extra packages. It copies
the skill files without installing rendering tools or launching Office.

## Install with your AI agent

Use the [website’s agent selector](https://rtrtl.org/?lang=en#install)
for a prompt tailored to Codex, Claude Code or Antigravity. Choose “Other” for
any other coding agent that supports skills, or paste this generic prompt:

> Install RTRTL from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl into the skills directory supported by this coding agent. Copy the complete rtrtl folder with all supporting files. Do not overwrite an existing installation or local edits. Verify that the skill is discoverable and tell me how to invoke it. Then use RTRTL for Hebrew and mixed Hebrew/English content.

The installation method and invocation syntax depend on your coding agent.
Codex can use its `skill-installer` when available; the prompt above also works
as a request to copy the skill files using the host's supported method.

## Choose the skills directory

| Coding agent | Install the complete `rtrtl` folder here |
| --- | --- |
| Codex | The configured skills directory; the bundled copier defaults to `$CODEX_HOME/skills/rtrtl` or `~/.codex/skills/rtrtl`. |
| Claude Code | `~/.claude/skills/rtrtl` for personal use or `<project>/.claude/skills/rtrtl` for a project. |
| Antigravity | `<workspace>/.agents/skills/rtrtl` for a workspace. Global directories vary between the App/IDE and CLI; use the location documented for your surface. |
| Any other coding agent that supports skills | Its documented skills directory, preserving the complete folder structure. |

See the official [Claude Code skills guide](https://code.claude.com/docs/en/skills)
and [Antigravity skills guide](https://antigravity.google/docs/skills?app=antigravity-ide)
for supported locations and loading behavior. After installation, check that
`rtrtl/SKILL.md` and the supporting files are present and that the agent can
find the skill. Use its documented invocation method; for example, Codex uses
`$rtrtl` and Claude Code uses `/rtrtl`.

## Clone and copy locally

Clone the repository, then choose the destination for your coding agent.
Running the installer without `--dest` uses the Codex default. With `CODEX_HOME` set, the
default destination is `$CODEX_HOME/skills/rtrtl` (or
`$env:CODEX_HOME\skills\rtrtl` in PowerShell). Otherwise it is
`~/.codex/skills/rtrtl`.

```powershell
git clone https://github.com/OriAshkenazi/RTRTL.git
cd RTRTL
python scripts/install.py
```

To check the files and preview the destination without copying:

```powershell
python scripts/install.py --dry-run
```

To use another skills directory, pass its path with `--dest`. The installer
creates an `rtrtl` folder inside it:

```powershell
python scripts/install.py --dest "C:\path\to\configured\skills"
```

The installer refuses to replace an existing `rtrtl` directory, rejects
symbolic links and unsafe source paths, and stages the copy before placing it.
If a copy already exists, review and back up any local edits before replacing it
yourself. The installer has no overwrite option.

After copying, check that `<skills directory>/rtrtl/SKILL.md` and its supporting
files are present. Follow your coding agent’s skill loading or reload instructions.

## Verify the bundled installer

From the cloned repository, run the standard-library test suite:

```powershell
python -m unittest discover -s tests -v
```
