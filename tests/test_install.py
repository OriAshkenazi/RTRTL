from __future__ import annotations

import contextlib
import io
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import install  # noqa: E402


class InstallerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.source = self.root / "source"
        (self.source / "references").mkdir(parents=True)
        (self.source / "SKILL.md").write_text("skill", encoding="utf-8")
        (self.source / "references" / "guide.md").write_text("guide", encoding="utf-8")
        self.parent = self.root / "skills"

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_install_copies_entire_tree(self) -> None:
        destination = install.install(self.source, self.parent)
        self.assertEqual((destination / "SKILL.md").read_text(encoding="utf-8"), "skill")
        self.assertEqual((destination / "references" / "guide.md").read_text(encoding="utf-8"), "guide")

    def test_existing_destination_is_rejected_and_preserved(self) -> None:
        destination = self.parent / "rtrtl"
        destination.mkdir(parents=True)
        marker = destination / "local.txt"
        marker.write_text("keep", encoding="utf-8")
        with self.assertRaises(install.InstallError):
            install.install(self.source, self.parent)
        self.assertEqual(marker.read_text(encoding="utf-8"), "keep")

    def test_dry_run_validates_without_creating_destination(self) -> None:
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            destination = install.install(self.source, self.parent, dry_run=True)
        self.assertIn(str(destination), output.getvalue())
        self.assertFalse(self.parent.exists())

    def test_default_uses_codex_home(self) -> None:
        script = Path(install.__file__).resolve()
        env = os.environ.copy()
        env["CODEX_HOME"] = str(self.root / "codex-home")
        result = subprocess.run(
            [sys.executable, str(script), "--dry-run"],
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn(str(self.root / "codex-home" / "skills" / "rtrtl"), result.stdout)
        self.assertFalse((self.root / "codex-home").exists())

    def test_symlink_in_source_is_rejected(self) -> None:
        link = self.source / "linked.md"
        try:
            link.symlink_to(self.source / "SKILL.md")
        except (OSError, NotImplementedError):
            self.skipTest("symlink creation is unavailable")
        with self.assertRaises(install.InstallError):
            install.install(self.source, self.parent)


if __name__ == "__main__":
    unittest.main()
