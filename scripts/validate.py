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
    # Skills IL listing: bilingual display metadata, a Hebrew edition that hosts never load as a skill,
    # and a root LICENSE that GitHub detects as plain MIT (extra notes there make it "Other").
    frontmatter = core.split('---')[1]
    for field in ('license: MIT', 'display_name:', 'display_description:', 'tags:'):
        if field not in frontmatter:
            errors.append(f'SKILL.md frontmatter is missing {field}')
    for key in ('display_name', 'display_description', 'tags'):
        block = re.search(rf'^  {key}:\n((?:    .*\n)+)', frontmatter, re.M)
        if not block or not re.search(r'^    en:', block[1], re.M) or not re.search(r'^    he:', block[1], re.M):
            errors.append(f'SKILL.md metadata.{key} needs en and he values')
    hebrew = skill / 'SKILL_HE.md'
    if not hebrew.exists():
        errors.append('Missing skills/rtrtl/SKILL_HE.md')
    else:
        body_he = hebrew.read_text(encoding='utf-8')
        if body_he.startswith('---'):
            errors.append('SKILL_HE.md must not have frontmatter, or hosts may load it as a second skill')
        links = lambda text: sorted(set(re.findall(r'\]\((references/[^)\s]+)\)', text)))
        if links(core) != links(body_he):
            errors.append('SKILL_HE.md must link the same references as SKILL.md; update both together')
    if (ROOT / 'LICENSE').read_bytes() != (skill / 'LICENSE').read_bytes():
        errors.append('Root LICENSE must match skills/rtrtl/LICENSE exactly so GitHub detects MIT')
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
            if 'oriashkenazi.github.io/rtrtl' in body.lower() and path.resolve() != Path(__file__).resolve():
                errors.append(f'Old GitHub Pages address; link to https://rtrtl.org/ instead: {path.relative_to(ROOT)}')
            if path.suffix == '.md':
                for target in re.findall(r'\[[^\]]*\]\(([^)\s]+)\)', body):
                    if re.match(r'^[a-z]+:|^#', target, re.I):
                        continue
                    target_value = target.split('#')[0]
                    if target_value.startswith('/') and path.is_relative_to(ROOT / 'docs'):
                        resolved = ROOT / 'docs' / target_value.lstrip('/')
                    else:
                        resolved = path.parent / target_value
                    if not resolved.exists():
                        errors.append(f'Broken link in {path.relative_to(ROOT)}: {target}')
            if path.suffix == '.html':
                page = PageLinks()
                page.feed(body)
                for target in page.targets:
                    if re.match(r'^[a-z]+:|^#|^//', target, re.I):
                        continue
                    target_value = target.split('#')[0].split('?')[0]
                    if target_value.startswith('/') and path.is_relative_to(ROOT / 'docs'):
                        resolved = ROOT / 'docs' / target_value.lstrip('/')
                    else:
                        resolved = path.parent / target_value
                    if not resolved.exists():
                        errors.append(f'Broken page asset/link in {path.relative_to(ROOT)}: {target}')
    for builder in ('build_agent_skills.py', 'build_markdown.py'):
        result = subprocess.run([sys.executable, str(ROOT / 'scripts' / builder), '--check'], capture_output=True, text=True, encoding='utf-8')
        if result.returncode:
            errors.append(result.stderr.strip())
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
