# Install RTRTL

RTRTL is a Codex skill stored at `skills/rtrtl`. It uses only files in the skill
directory and can be installed by copying that directory into a Codex skills
directory. The bundled installer uses only Python's standard library. It does
not download files, install packages, or run Office applications.

## Ask the skill installer

If the `skill-installer` tool is available in your Codex environment, give it
this prompt:

> Install the RTRTL skill from
> https://github.com/OriAshkenazi/RTRTL/tree/main/skills/rtrtl using
> skill-installer. Preserve any existing local edits and do not overwrite an
> existing installation. Verify that the installed `rtrtl/SKILL.md` exists and
> report its path. Load the skill on the next turn; if it is not available,
> restart or reload Codex and check again.

The installer tool and skill loading behavior can vary by host. If this route is
unavailable, use the repository copier below and consult the host's configured
skills directory. This guide does not claim automatic discovery for every Codex
host or deployment.

## Clone and copy locally

Clone the repository, then run its installer. With `CODEX_HOME` set, the
default destination is `$CODEX_HOME/skills/rtrtl` (or
`%CODEX_HOME%\skills\rtrtl` in PowerShell). Otherwise it is
`~/.codex/skills/rtrtl`.

```powershell
git clone https://github.com/OriAshkenazi/RTRTL.git
cd RTRTL
python scripts/install.py
```

To preview the validated file count and destination without copying:

```powershell
python scripts/install.py --dry-run
```

If the intended Codex host uses another skills directory, pass its parent
directory explicitly. The skill is placed in a child directory named `rtrtl`:

```powershell
python scripts/install.py --dest "C:\path\to\configured\skills"
```

The installer refuses to replace an existing `rtrtl` directory, rejects
symbolic links and unsafe source paths, and stages the copy before placing it.
Review or back up a destination that already exists before handling it yourself;
the installer has no overwrite option.

After copying, verify that `<skills parent>/rtrtl/SKILL.md` exists. Load the
skill on the next turn. If the host does not expose it, restart or reload Codex
and check again.

## Verify the bundled installer

From the cloned repository, run the standard-library test suite:

```powershell
python -m unittest discover -s tests -v
```
