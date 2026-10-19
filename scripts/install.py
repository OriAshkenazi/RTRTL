#!/usr/bin/env python3
"""Install the bundled RTRTL Codex skill without network access."""

from __future__ import annotations

import argparse
import os
import shutil
import sys
import tempfile
from pathlib import Path


class InstallError(Exception):
    """A safe, user-facing installation error."""


def _validate_tree(source: Path) -> list[tuple[Path, Path]]:
    """Return regular files and relative paths, rejecting links and unsafe names."""
    if source.is_symlink() or not source.is_dir():
        raise InstallError(f"Skill source is missing or is not a real directory: {source}")

    files: list[tuple[Path, Path]] = []
    for root, dirnames, filenames in os.walk(source, topdown=True, followlinks=False):
        root_path = Path(root)
        names = list(dirnames) + list(filenames)
        for name in names:
            # Reject path separators and platform-specific special path syntax in a
            # single component. The source tree should contain ordinary filenames.
            if name in {".", ".."} or "/" in name or "\\" in name or ":" in name or "\x00" in name:
                raise InstallError(f"Unsafe path in skill source: {name!r}")
            item = root_path / name
            if item.is_symlink():
                raise InstallError(f"Symbolic links are not allowed in skill source: {item}")
            if name in dirnames:
                if not item.is_dir():
                    raise InstallError(f"Unsupported source entry: {item}")
            else:
                if not item.is_file():
                    raise InstallError(f"Only regular files are allowed in skill source: {item}")
                relative = item.relative_to(source)
                if relative.is_absolute() or ".." in relative.parts:
                    raise InstallError(f"Unsafe relative path in skill source: {relative}")
                files.append((item, relative))
    if not files:
        raise InstallError("Skill source contains no files")
    return files


def install(skill_source: Path, skills_parent: Path, *, dry_run: bool = False) -> Path:
    """Copy skill_source to skills_parent/rtrtl, refusing to replace anything."""
    skill_source = Path(skill_source)
    skills_parent = Path(skills_parent).expanduser()
    destination = skills_parent / "rtrtl"
    files = _validate_tree(skill_source)

    if destination.exists() or destination.is_symlink():
        raise InstallError(f"Destination already exists; refusing to overwrite: {destination}")
    if dry_run:
        print(f"Would install {len(files)} files to {destination}")
        return destination

    skills_parent.mkdir(parents=True, exist_ok=True)
    if skills_parent.is_symlink() or not skills_parent.is_dir():
        raise InstallError(f"Skills parent is not a real directory: {skills_parent}")
    staging = Path(tempfile.mkdtemp(prefix=".rtrtl-install-", dir=skills_parent))
    staged_skill = staging / "rtrtl"
    try:
        staged_skill.mkdir()
        for source_file, relative in files:
            target_file = staged_skill / relative
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source_file, target_file)
        # Recheck immediately before the move to avoid intentionally replacing a
        # destination created after the initial check.
        if destination.exists() or destination.is_symlink():
            raise InstallError(f"Destination appeared during installation: {destination}")
        os.rename(staged_skill, destination)
    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise
    else:
        staging.rmdir()
    print(f"Installed {len(files)} files to {destination}")
    return destination


def default_skills_parent() -> Path:
    codex_home = os.environ.get("CODEX_HOME")
    if codex_home:
        return Path(codex_home).expanduser() / "skills"
    return Path.home() / ".codex" / "skills"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Install the bundled RTRTL Codex skill offline.")
    parser.add_argument("--dest", type=Path, help="parent skills directory; installs into <dest>/rtrtl")
    parser.add_argument("--dry-run", action="store_true", help="validate and show the planned destination without copying")
    args = parser.parse_args(argv)
    source = Path(__file__).resolve().parent.parent / "skills" / "rtrtl"
    try:
        install(source, args.dest or default_skills_parent(), dry_run=args.dry_run)
    except (InstallError, OSError) as exc:
        print(f"Install failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
