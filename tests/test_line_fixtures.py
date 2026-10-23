"""Static guards for the web line-break fixture cases used by check_browser.cjs --checks lines."""
from pathlib import Path
import json
import re
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / 'skills' / 'rtrtl'


class LineFixtureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory(prefix='rtrtl-lines-')
        subprocess.run([sys.executable, '-S', str(SKILL / 'scripts' / 'build_fixtures.py'), '--out', cls.tmp.name, '--formats', 'html'], check=True, capture_output=True)
        out = Path(cls.tmp.name)
        cls.page = (out / 'fixture.html').read_text(encoding='utf-8')
        cls.manifest = json.loads((out / 'fixtures.json').read_text(encoding='utf-8'))
        cls.cases = {cid: (good, bad) for cid, good, bad in re.findall(r'<section class="line-case" id="([^"]+)">.*?<div data-line-good>(.*?)</div><template data-line-bad>(.*?)</template>', cls.page)}

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_each_line_case_has_good_and_bad_forms(self):
        self.assertEqual(sorted(self.cases), ['line-balance', 'line-count', 'line-status'])
        self.assertEqual(self.manifest['line_cases'], ['line-status', 'line-count', 'line-balance'])
        self.assertEqual(len(self.manifest['cases']), 13)
        for good, bad in self.cases.values():
            self.assertNotEqual(good, bad)

    def test_good_forms_glue_numbers_and_separators(self):
        good, bad = self.cases['line-status']
        self.assertIn('8 קבצים', good)
        self.assertIn(' · 12 מ״ב', good)
        self.assertIn(' · <bdi>12 מ״ב</bdi>', bad)
        good, bad = self.cases['line-count']
        self.assertIn('4 מתכונים', good)
        self.assertNotIn('·', good)
        self.assertIn('</button> · 4', bad)
        good, bad = self.cases['line-balance']
        self.assertIn('max-inline-size:100%', good)
        self.assertNotIn('max-inline-size', bad)

    def test_good_forms_never_leave_bare_text_in_a_flex_row(self):
        for cid in ('line-status', 'line-count'):
            good = self.cases[cid][0]
            outer = re.match(r'<(\w+) class="[^"]+">(.*)</\1>$', good).group(2)
            self.assertEqual(re.sub(r'<(\w+)[^>]*>.*?</\1>', '', outer).strip(), '', cid)

    def test_short_corpus_quantities_stay_on_one_line(self):
        self.assertIn('class="value">-12.50 mm<', self.page)
        self.assertIn('class="value">1,234.50 m³<', self.page)
        self.assertIn('.value{white-space:nowrap}', self.page)

    def test_lines_mode_is_documented(self):
        script = (SKILL / 'scripts' / 'check_browser.cjs').read_text(encoding='utf-8')
        self.assertIn("['arrows','lines']", script)
        self.assertIn('lines-results.json', script)
        docs = (SKILL / 'references' / 'reproducible-checks.md').read_text(encoding='utf-8')
        self.assertIn('--checks lines', docs)


if __name__ == '__main__':
    unittest.main()
