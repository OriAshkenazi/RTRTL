"""Fixture evidence for the plain-text and chat guidance in references/text.md."""
from pathlib import Path
import re
import unicodedata
import unittest

ROOT = Path(__file__).resolve().parent.parent
FIXTURE = ROOT / 'tests' / 'fixtures' / 'he-cp1255.srt'
TEXT = (ROOT / 'skills' / 'rtrtl' / 'references' / 'text.md').read_text(encoding='utf-8')


class LegacySubtitleEncodingTests(unittest.TestCase):
    def setUp(self):
        self.raw = FIXTURE.read_bytes()

    def test_cp1255_bytes_are_not_utf8(self):
        with self.assertRaises(UnicodeDecodeError):
            self.raw.decode('utf-8')
        self.assertIn('�', self.raw.decode('utf-8', errors='replace'))

    def test_cp1255_decode_keeps_every_character(self):
        text = self.raw.decode('cp1255')
        for expected in ('שלום, אני דנה.', '₪150 –', '“נתראה בצה״ל”', 'שָׁלוֹם'):
            self.assertIn(expected, text)
        self.assertNotIn('�', text)

    def test_iso_8859_8_decode_loses_windows_1255_characters(self):
        text = self.raw.decode('iso-8859-8', errors='replace')
        self.assertIn('¤150', text)
        for lost in ('₪', '–', '“', '״', 'ָ'):
            self.assertNotIn(lost, text)

    def test_utf8_rewrite_keeps_cues_and_line_endings(self):
        fixed = self.raw.decode('cp1255').encode('utf-8')
        self.assertEqual(fixed.decode('utf-8').encode('cp1255'), self.raw)
        self.assertIn(b'2\r\n00:00:04,100 --> 00:00:07,500\r\n', fixed)


class ChatGuidanceTests(unittest.TestCase):
    def test_unicode_facts_the_guidance_relies_on(self):
        self.assertEqual(unicodedata.bidirectional('₪'), 'ET')
        self.assertEqual(unicodedata.bidirectional('G'), 'L')
        self.assertEqual(unicodedata.bidirectional('‏'), 'R')
        self.assertEqual(len('‏'.encode('utf-16-le')) // 2, 1)

    def test_chat_section_stays_marked_untested(self):
        self.assertIn('## Chat messages (untested)', TEXT)

    def test_no_claim_that_rtl_breaks_markdownv2_parsing(self):
        for sentence in re.split(r'(?<=[.!?])\s+', TEXT):
            if 'MarkdownV2' in sentence and re.search(r'\b(breaks?|fails?)\b', sentence):
                self.assertRegex(sentence, r'does not break|not break')


if __name__ == '__main__':
    unittest.main()
