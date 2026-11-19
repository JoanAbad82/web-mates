#!/usr/bin/env python3
"""Generate an UNTRANSLATED off-site-unit template. Never claims draft translation coverage."""
from pathlib import Path
from hashlib import sha256
import json,argparse
from i18n_coverage import CAT,SITE,loaded
parser=argparse.ArgumentParser()
parser.add_argument('--unit',required=True,help='Canonical unit ID e.g. E2-A02')
parser.add_argument('--output',required=True,help='Template JSON output path, outside site/i18n')
parser.add_argument('--lesson',help='Optional single lesson ID for incremental contribution')
args=parser.parse_args()
catalog={u['unit_id']:u for c in CAT['courses'] for u in c['units']}
if args.unit not in catalog:parser.error('Unknown unit ID')
path=Path(args.output).resolve()
if path.exists():parser.error('Output already exists; overwrite forbidden')
if path.is_relative_to((SITE/'i18n').resolve()):parser.error('Untranslated template cannot be written under published locale assets')
a,b,unit,bank=loaded(args.unit)
lessons={x['lesson_id']:x for x in unit['lesson_documents']}
if args.lesson and args.lesson not in lessons:parser.error('Lesson ID is not part of this unit')
selected=([args.lesson] if args.lesson else list(lessons))
original_titles={x['lesson_id']:x['title'] for x in catalog[args.unit]['lessons']}
target={}
for lesson_id in selected:
 doc=lessons[lesson_id]
 blocks=[]
 for src in doc['content_blocks']:
  obj={'body':''}
  if 'alt' in src:obj['alt']=''
  if 'visual_spec' in src and 'title' in src['visual_spec']:obj['visual_spec']={'title':''}
  blocks.append(obj)
 target[lesson_id]={'title':'','objectives':['' for _ in doc['objectives']], 'content_blocks':blocks}
activities={x['exercise_id']:{'prompt':'','hint':'','explanation':''}
 for x in bank['activities'] if x['lesson_id'] in selected}
payload={
 'schema':'webmates.ca-ES.unit-overlay.v1','version':'1.0.0','locale':'ca-ES',
 'unit_id':args.unit,'translation_status':'draft_unreviewed',
 'source_files_sha256':{'data/'+a.name:sha256(a.read_bytes()).hexdigest(),
                         'data/'+b.name:sha256(b.read_bytes()).hexdigest()},
 'lessons':target,'activities':activities
}
path.parent.mkdir(parents=True,exist_ok=True)
path.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('UNTRANSLATED_TEMPLATE_CREATED',path,'source_lessons',len(target),'source_exercises',len(activities))
print('TRANSLATION_STATUS_NOT_COUNTED: empty strings MUST be completed and verified')
