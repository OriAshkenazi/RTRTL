"""Guard the homepage format lists: on a narrow screen a line may break only after a comma, never inside an item or at a spaced separator."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parent.parent
PAGES = {'docs/index.html': ', ', 'docs/he/index.html': ', ', 'docs/ar/index.html': '، '}


def lists(page):
    return re.findall(r'<span class="stack-desc">(.*?)</span>', (ROOT / page).read_text(encoding='utf-8'))


class FormatListTests(unittest.TestCase):
    def test_breaks_only_after_commas(self):
        for page, comma in PAGES.items():
            found = lists(page)
            self.assertTrue(found, f'{page} has no format lists')
            for text in found:
                with self.subTest(page=page, text=text):
                    self.assertNotRegex(text, r'[·•|]', 'a spaced separator can start or end a line; use commas')
                    plain = re.sub(r'<[^>]+>', '', text)
                    items = plain.split(comma)
                    self.assertGreater(len(items), 1, f'items are separated by {comma!r}')
                    for item in items:
                        self.assertNotIn(' ', item, f'{item!r} can split across lines; join its words with NBSP')


if __name__ == '__main__':
    unittest.main()
