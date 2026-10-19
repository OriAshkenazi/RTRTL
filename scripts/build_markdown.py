"""Build or check the Markdown editions of the homepages served for Accept: text/markdown."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'he/index.html', 'ar/index.html']
BLOCKS = {'main', 'section', 'article', 'div', 'footer', 'details', 'p', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'}
VOID = {'meta', 'link', 'br', 'img', 'input', 'hr', 'source'}
# Interactive controls, decoration and site chrome carry no reading content.
SKIP_TAGS = {'head', 'script', 'style', 'svg', 'button', 'select', 'template', 'header', 'summary'}
SKIP_CLASSES = {'skip', 'logo', 'principle-number', 'stack-no', 'agent-picker', 'copy-button', 'copy-status', 'demo-toolbar', 'section-index'}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def classes(self):
        return set((self.attrs.get('class') or '').split())

    def skipped(self):
        return (self.tag in SKIP_TAGS or self.attrs.get('aria-hidden') == 'true'
                or 'hidden' in self.attrs or self.classes() & SKIP_CLASSES)

    def has_block(self):
        return any(isinstance(c, Node) and (c.tag in BLOCKS or c.has_block()) for c in self.children)


class Tree(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = self.current = Node('#root', {})
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in VOID:
            self.current = node

    def handle_endtag(self, tag):
        node = self.current
        while node.parent and node.tag != tag:
            node = node.parent
        if node.parent:
            self.current = node.parent

    def handle_data(self, data):
        self.current.children.append(data)

    def find(self, test, node=None):
        node = node or self.root
        for child in node.children:
            if isinstance(child, Node):
                if test(child):
                    return child
                found = self.find(test, child)
                if found:
                    return found
        return None


def text_of(node):
    return ''.join(c if isinstance(c, str) else text_of(c) for c in node.children if isinstance(c, str) or not c.skipped())


def clean(text):
    return re.sub(r'\s+', ' ', text).strip()


def link_label(node):
    return clean(text_of(node)).removesuffix('↗').strip()


class Renderer:
    def __init__(self, base):
        self.base = base

    def inline(self, nodes):
        parts, previous = [], None
        for child in nodes:
            if isinstance(child, str):
                parts.append(child)
                previous = child
                continue
            if child.skipped():
                continue
            # A link directly beside another element, such as a button and its note, would run together.
            if isinstance(previous, Node) and 'a' in {previous.tag, child.tag}:
                parts.append(' · ')
            previous = child
            if child.tag == 'br':
                parts.append(' ')
            elif child.tag == 'a':
                parts.append(f'[{link_label(child)}]({urljoin(self.base, child.attrs.get("href", ""))})')
            elif child.tag == 'code':
                parts.append(f'`{clean(text_of(child))}`')
            elif child.tag in {'strong', 'b'}:
                parts.append(f'**{clean(self.inline(child.children))}**')
            else:
                parts.append(self.inline(child.children))
        return ''.join(parts)

    def blocks(self, node):
        out, run = [], []

        def flush():
            text = clean(self.inline(run))
            if text:
                out.append(text)
            run.clear()

        elements = [c for c in node.children if isinstance(c, Node) and not c.skipped()]
        has_text = any(isinstance(c, str) and c.strip() for c in node.children)
        if len(elements) > 1 and not has_text and all(c.tag == 'span' and not c.has_block() for c in elements):
            return ['\n'.join(f'- {clean(self.inline(c.children))}' for c in elements)]
        for child in node.children:
            if isinstance(child, str) or (child.tag not in BLOCKS and not child.has_block()):
                run.append(child)
                continue
            flush()
            if child.skipped():
                continue
            if child.tag.startswith('h') and child.tag[1:].isdigit():
                out.append('#' * int(child.tag[1]) + ' ' + clean(self.inline(child.children)))
            elif child.tag == 'pre':
                out.append('```html\n' + text_of(child).strip('\n') + '\n```')
            elif child.tag == 'p':
                out.extend([clean(self.inline(child.children))] if clean(text_of(child)) else [])
            elif child.tag == 'a':
                item = self.card(child)
                if out and out[-1].startswith('- ['):
                    out[-1] += '\n' + item
                else:
                    out.append(item)
            else:
                out.extend(self.blocks(child))
        flush()
        return out

    def card(self, node):
        """A link wrapping a heading and labels, such as a format card, becomes one list item."""
        heading = next(c for c in node.children if isinstance(c, Node) and c.tag[0] == 'h')
        details = [clean(text_of(c)) for c in node.children if isinstance(c, Node) and c is not heading and not c.skipped()]
        href = urljoin(self.base, node.attrs.get('href', ''))
        return f'- [{clean(text_of(heading))}]({href}): ' + ' · '.join(d for d in details if d)


def convert(source):
    tree = Tree(source)
    html = tree.find(lambda n: n.tag == 'html')
    canonical = tree.find(lambda n: n.tag == 'link' and n.attrs.get('rel') == 'canonical').attrs['href']
    title = clean(text_of(tree.find(lambda n: n.tag == 'title')))
    description = tree.find(lambda n: n.tag == 'meta' and n.attrs.get('name') == 'description').attrs['content']
    body = tree.find(lambda n: n.tag == 'body')
    blocks = Renderer(canonical).blocks(body)
    # Markdown has no direction attribute; frontmatter records the page language and direction.
    front = ['---', f'title: "{title}"', f'description: "{description}"', f'lang: {html.attrs["lang"]}',
             f'dir: {html.attrs["dir"]}', f'url: {canonical}', '---']
    return '\n'.join(front) + '\n\n' + '\n\n'.join(blocks) + '\n'


def targets():
    for page in PAGES:
        source = ROOT / 'docs' / page
        yield source, source.with_suffix('.md')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='fail if a Markdown edition is stale')
    check = parser.parse_args().check
    stale = []
    for source, target in targets():
        markdown = convert(source.read_text(encoding='utf-8'))
        if check:
            if not target.exists() or target.read_text(encoding='utf-8').replace('\r\n', '\n') != markdown:
                stale.append(f'Markdown edition is stale: {target.relative_to(ROOT).as_posix()}; run python scripts/build_markdown.py')
        else:
            target.write_text(markdown, encoding='utf-8', newline='\n')
    for message in stale:
        print(message, file=sys.stderr)
    raise SystemExit(bool(stale))


if __name__ == '__main__':
    main()
