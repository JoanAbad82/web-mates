#!/usr/bin/env python3
"""Create/check deterministic SHA256SUMS.txt of repository public files, excluding itself."""
from pathlib import Path
from hashlib import sha256
import subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'SHA256SUMS.txt'
p=subprocess.run(['git','ls-files','-c','-o','--exclude-standard'],cwd=ROOT,capture_output=True,
                 text=True,encoding='utf8',check=True)
paths=sorted(set(line.replace('\\','/') for line in p.stdout.splitlines()
                 if line and line!='SHA256SUMS.txt'))
lines=[]
for name in paths:
 file=ROOT/name
 if not file.is_file() or file.is_symlink():raise RuntimeError('Not a regular public file: '+name)
 if not file.resolve().is_relative_to(ROOT.resolve()):raise RuntimeError('Outside repository: '+name)
 lines.append(sha256(file.read_bytes()).hexdigest()+'  '+name)
body='\n'.join(lines)+'\n'
if '--write' in sys.argv:OUT.write_text(body,encoding='utf8',newline='\n')
else:
 if OUT.read_text(encoding='utf8')!=body:raise RuntimeError('SHA256 manifest changed; regenerate and commit with source')
for row in lines:
 hash_,name=row.split('  ',1)
 assert sha256((ROOT/name).read_bytes()).hexdigest()==hash_
print('SHA256_MANIFEST_PASS',len(lines),'source files','manifest_hash',sha256(OUT.read_bytes()).hexdigest())
