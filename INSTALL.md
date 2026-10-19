# Install RTRTL

RTRTL is a file-based skill stored at `skills/rtrtl`. Ask your AI agent to install
it, or copy the folder into the skills directory configured for your environment.
The instructions below cover local Codex installation. Other agents that support
skills may use a different directory.

The bundled Python installer works offline and needs no extra packages. It copies
the skill files without installing rendering tools or launching Office.

## Install with your AI agent

If your Codex environment includes `skill-installer`, paste this prompt into
your AI agent's chat:

> Use $skill-installer to install the RTRTL skill from https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl. Do not overwrite an existing installation or local edits. Check that SKILL.md and the bundled supporting files are installed. Then use $rtrtl for Hebrew and mixed Hebrew/English content.

If the skill does not appear, start a new chat or restart Codex. If your AI agent
does not offer this installer, use the manual method below with the skills
directory specified by its documentation.

## Clone and copy locally

Clone the repository, then run its installer. With `CODEX_HOME` set, the
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
files are present. Start a new chat to use the skill. If Codex still does not
show it, restart the app.

## Verify the bundled installer

From the cloned repository, run the standard-library test suite:

```powershell
python -m unittest discover -s tests -v
```
