"""Guard static Hebrew share text independently from the page's DOM direction."""
from html.parser import HTMLParser
from pathlib import Path
import unicodedata
import unittest

ROOT = Path(__file__).resolve().parents[1]


class Metadata(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.meta = {}
        self.title = ''
        self.in_title = False
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'meta':
            key = values.get('property', values.get('name'))
            if key:
                self.meta[key] = values.get('content', '')
        elif tag == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, text):
        if self.in_title:
            self.title += text


def first_strong(text):
    return next((unicodedata.bidirectional(c) for c in text
                 if unicodedata.bidirectional(c) in {'L', 'R', 'AL'}), None)


class ShareMetadataTests(unittest.TestCase):
    def setUp(self):
        # Raw HTML only: crawlers must not need the locale script or DOM styling.
        self.page = Metadata((ROOT / 'docs/he/index.html').read_text(encoding='utf-8'))

    def test_titles_have_rtl_first_strong_character(self):
        for value in (self.page.title, self.page.meta['og:title'], self.page.meta['twitter:title']):
            self.assertIn(first_strong(value), {'R', 'AL'})

    def test_share_titles_do_not_mix_scripts_or_hidden_controls(self):
        for key in ('og:title', 'twitter:title'):
            value = self.page.meta[key]
            self.assertNotIn('L', [unicodedata.bidirectional(c) for c in value])
            self.assertFalse(any(unicodedata.category(c) == 'Cf' for c in value))
            self.assertNotIn('<', value)

    def test_brand_and_language_are_separate_fields(self):
        self.assertEqual(self.page.meta['og:site_name'], 'RTRTL')
        self.assertEqual(self.page.meta['og:locale'], 'he_IL')
        self.assertTrue(self.page.meta['og:url'].endswith('/he/'))

    def test_previous_failure_is_detected(self):
        previous = 'RTRTL — הזכות לכתוב בכיוון הנכון.'
        self.assertEqual(first_strong(previous), 'L')
        self.assertNotEqual(first_strong(previous), first_strong(self.page.meta['og:title']))


if __name__ == '__main__':
    unittest.main()
