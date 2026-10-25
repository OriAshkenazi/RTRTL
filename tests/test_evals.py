"""Static guards for the eval cases in evals/rtrtl, in the layout claude plugin eval reads."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parent.parent
EVALS = ROOT / 'evals' / 'rtrtl'
SKILL = ROOT / 'skills' / 'rtrtl'
SETTINGS = {'tags', 'max_turns', 'timeout_seconds', 'allowed_tools', 'runs'}
RESERVED = {'results', 'mocks', 'node_modules', 'files', 'true', 'false', 'null'}
AREAS = ('core-', 'web-', 'office-', 'video-', 'text-')
# Guidance taken in from other skills is restated and cited to primary sources, never to the skill it was found in.
SOURCE_SKILLS = re.compile(r'skills[- ]il\b|agentskills\.co\.il', re.I)


def cases():
    return sorted(path for path in EVALS.iterdir() if path.is_dir())


def front_matter(text):
    match = re.match(r'---\n(.*?)\n---\n', text, re.S)
    return match.group(1) if match else None


class EvalCaseTests(unittest.TestCase):
    def test_there_are_cases(self):
        self.assertTrue(cases(), 'evals/rtrtl has no cases')

    def test_case_layout(self):
        for case in cases():
            with self.subTest(case=case.name):
                self.assertRegex(case.name, r'^[a-z][a-z0-9-]*$')
                self.assertNotIn(case.name, RESERVED)
                self.assertTrue(case.name.startswith(AREAS), f'{case.name} should start with one of {AREAS}')

                prompt = (case / 'prompt.md').read_text(encoding='utf-8')
                settings = front_matter(prompt)
                self.assertIsNotNone(settings, 'prompt.md needs a settings block')
                keys = {line.split(':', 1)[0] for line in settings.splitlines() if line.strip()}
                self.assertLessEqual(keys, SETTINGS, 'unknown keys make the case fail to load')
                self.assertTrue(prompt.split('---\n', 2)[2].strip(), 'prompt.md has no prompt after its settings')

                spec = (case / 'case.yaml').read_text(encoding='utf-8')
                self.assertIn('schema_version: "1.1"\n', spec)
                self.assertIn(f'name: {case.name}\n', spec)
                self.assertIn('expected_outcome: |\n', spec)

                graders = sorted((case / 'graders').glob('*.md'))
                self.assertTrue(graders, 'a case with no grader fails to load')
                for grader in graders:
                    self.assertRegex(grader.name, r'^\d\d-[a-z0-9-]+\.md$')
                    text = grader.read_text(encoding='utf-8')
                    block = front_matter(text)
                    self.assertIsNotNone(block, f'{grader.name} needs the grader block, or the CLI ignores it')
                    self.assertRegex(block, r'(?m)^type: ')
                    self.assertTrue(text.split('---\n', 2)[2].strip(), f'{grader.name} has no statement')

                if (case / 'files').is_dir():
                    self.assertIn('scaffold_script: place-files.sh', spec)
                    self.assertTrue((case / 'place-files.sh').is_file())

    def test_skill_and_evals_cite_primary_sources_only(self):
        for path in [*SKILL.rglob('*'), *EVALS.rglob('*')]:
            if path.is_file() and path.suffix in {'.md', '.yaml', '.py', '.cjs', '.ps1'}:
                with self.subTest(path=str(path.relative_to(ROOT))):
                    self.assertIsNone(SOURCE_SKILLS.search(path.read_text(encoding='utf-8')))


if __name__ == '__main__':
    unittest.main()
