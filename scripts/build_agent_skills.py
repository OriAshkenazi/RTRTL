"""Build or check the Agent Skills discovery index served from docs/.well-known/agent-skills/."""
import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import sys
import tarfile

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / 'skills' / 'rtrtl'
OUT = ROOT / 'docs' / '.well-known' / 'agent-skills'
ARCHIVE = OUT / 'rtrtl.tar.gz'
INDEX = OUT / 'index.json'
SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json'


def skill_files():
    """Skill files as published bytes; CRLF checkouts normalize to the repository's LF."""
    files = {}
    for path in sorted(SKILL.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts:
            files[path.relative_to(SKILL).as_posix()] = path.read_bytes().replace(b'\r\n', b'\n')
    return files


def description():
    frontmatter = (SKILL / 'SKILL.md').read_text(encoding='utf-8').split('---')[1]
    return next(line.split(':', 1)[1].strip() for line in frontmatter.splitlines() if line.startswith('description:'))


def build_archive(files):
    # Fixed metadata keeps the archive reproducible; SKILL.md sits at the root as the spec requires.
    raw = io.BytesIO()
    with tarfile.open(fileobj=raw, mode='w', format=tarfile.PAX_FORMAT) as tar:
        for name, body in files.items():
            info = tarfile.TarInfo(name)
            info.size = len(body)
            info.mode = 0o755 if name.endswith(('.py', '.cjs')) else 0o644
            info.mtime = 0
            tar.addfile(info, io.BytesIO(body))
    packed = io.BytesIO()
    with gzip.GzipFile(fileobj=packed, mode='wb', mtime=0, compresslevel=9) as gz:
        gz.write(raw.getvalue())
    return packed.getvalue()


def build_index(archive):
    return {
        '$schema': SCHEMA,
        'skills': [{
            'name': 'rtrtl',
            'type': 'archive',
            'description': description(),
            'url': '/.well-known/agent-skills/rtrtl.tar.gz',
            'digest': 'sha256:' + hashlib.sha256(archive).hexdigest(),
        }],
    }


def check():
    """Compare contents, not compressed bytes: zlib builds may compress identical input differently."""
    if not ARCHIVE.exists() or not INDEX.exists():
        return ['Agent Skills index missing; run python scripts/build_agent_skills.py']
    errors = []
    archive = ARCHIVE.read_bytes()
    with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as tar:
        published = {m.name: tar.extractfile(m).read() for m in tar.getmembers() if m.isfile()}
    if published != skill_files():
        errors.append('Agent Skills archive is stale; run python scripts/build_agent_skills.py')
    if json.loads(INDEX.read_text(encoding='utf-8')) != build_index(archive):
        errors.append('Agent Skills index.json is stale; run python scripts/build_agent_skills.py')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='fail if the published index is stale')
    if parser.parse_args().check:
        errors = check()
        for error in errors:
            print(error, file=sys.stderr)
        raise SystemExit(bool(errors))
    OUT.mkdir(parents=True, exist_ok=True)
    archive = build_archive(skill_files())
    ARCHIVE.write_bytes(archive)
    INDEX.write_text(json.dumps(build_index(archive), indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')


if __name__ == '__main__':
    main()
