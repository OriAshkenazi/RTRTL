"""Validate public package links, source syntax and synthetic HTML generation offline."""
import ast
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent.parent


class PageLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {'href', 'src'} and value:
                self.targets.append(value)


def validate():
    errors = []
    skill = ROOT / 'skills' / 'rtrtl'
    core = (skill / 'SKILL.md').read_text(encoding='utf-8')
    if not core.startswith('---\nname: rtrtl\n') or 'description:' not in core.split('---')[1]:
        errors.append('Skill frontmatter must identify rtrtl and describe its trigger')
    for path in ROOT.rglob('*'):
        if any(part in {'.git', '__pycache__', 'node_modules'} for part in path.parts) or not path.is_file():
            continue
        if path.suffix == '.py':
            try:
                ast.parse(path.read_text(encoding='utf-8'), filename=str(path))
            except SyntaxError as exc:
                errors.append(str(exc))
        if path.suffix in {'.md', '.html', '.css', '.js', '.py', '.ps1', '.cjs', '.yml', '.yaml'}:
            body = path.read_text(encoding='utf-8')
            if path.resolve() != Path(__file__).resolve() and re.search(r'C:[/\\]Users[/\\]|historical-evidence|rtl-history-ledger|session_meta', body, re.I):
                errors.append(f'Private/local material: {path.relative_to(ROOT)}')
            if path.suffix == '.md':
                for target in re.findall(r'\[[^\]]*\]\(([^)\s]+)\)', body):
                    if re.match(r'^[a-z]+:|^#', target, re.I):
                        continue
                    target_path = Path(target.split('#')[0])
                    if target_path.is_absolute() and path.is_relative_to(ROOT / 'docs'):
                        resolved = ROOT / 'docs' / str(target_path).lstrip('/')
                    else:
                        resolved = path.parent / target_path
                    if not resolved.exists():
                        errors.append(f'Broken link in {path.relative_to(ROOT)}: {target}')
            if path.suffix == '.html':
                page = PageLinks()
                page.feed(body)
                for target in page.targets:
                    if re.match(r'^[a-z]+:|^#|^//', target, re.I):
                        continue
                    target_path = Path(target.split('#')[0].split('?')[0])
                    if target_path.is_absolute() and path.is_relative_to(ROOT / 'docs'):
                        resolved = ROOT / 'docs' / str(target_path).lstrip('/')
                    else:
                        resolved = path.parent / target_path
                    if not resolved.exists():
                        errors.append(f'Broken page asset/link in {path.relative_to(ROOT)}: {target}')
    with tempfile.TemporaryDirectory(prefix='rtrtl-fixture-') as output:
        result = subprocess.run([sys.executable, '-S', str(skill / 'scripts' / 'build_fixtures.py'), '--out', output, '--formats', 'html'], capture_output=True, text=True, encoding='utf-8')
        if result.returncode:
            errors.append(result.stderr)
        else:
            generated = Path(output)
            manifest = json.loads((generated / 'fixtures.json').read_text(encoding='utf-8'))
            if len(manifest['cases']) != 13 or not (generated / 'fixture.html').exists():
                errors.append('Expected 13 synthetic HTML fixture cases')
            if any(generated.glob('*.docx')) or any(generated.glob('*.pptx')) or any(generated.glob('*.xlsx')):
                errors.append('HTML generation must not generate Office formats')
    return errors


if __name__ == '__main__':
    failures = validate()
    for failure in failures:
        print(failure, file=sys.stderr)
    print(f'Package validation: {len(failures)} error(s)')
    raise SystemExit(bool(failures))
