#!/usr/bin/env python3
"""Conservative invariants for all ca-ES packages: numeric tokens and math operators."""
import re
NUM=re.compile(r'(?<!\w)(?:-|−)?\d{1,3}(?:[ \u00a0]\d{3})+|(?<!\w)(?:-|−)?\d+(?!\w)')
OPS=re.compile(r'[+×÷=<>−%≈≠√²³^π±≤≥°Δθ]|(?<![lL])·|·(?![lL])')
MATH_DIV=re.compile(r'/')
# Slash can denote division in a formula or an editorial pairing of verbs.
# The latter may legitimately become a Catalan conjunction ('sumar i restar').
# Unicode-aware word extraction avoids misclassifying favorables/número.
PROSE_SLASH_PAIRS={
 ('suma','resta'),('sumar','restar'),('sumas','restas'),('sumes','restes'),
 ('multiplicaciones','divisiones'),('multiplicacions','divisions'),
 ('multiplicar','dividir'),('multiplicación','división'),
 ('multiplicacio','divisio'),('multiplicació','divisió'),
 ('cuadradas','cúbicas'),('quadrades','cúbiques')
}
def math_ops(text):
 result=OPS.findall(text)
 for slash in MATH_DIV.finditer(text):
  before=re.search(r'[^\W\d_]+\s*$',text[:slash.start()],re.UNICODE)
  after=re.match(r'\s*[^\W\d_]+',text[slash.end():],re.UNICODE)
  pair=(before.group().strip().casefold(),after.group().strip().casefold()) if before and after else None
  if pair in PROSE_SLASH_PAIRS:continue
  result.append('/')
 return result
def numbers(text):
 return [t.replace(' ','').replace('\u00a0','') for t in NUM.findall(text)]
def math_guard(original,translated,context):
 if not isinstance(original,str) or not isinstance(translated,str):
  raise AssertionError('Text not string '+context)
 source=numbers(original);target=numbers(translated)
 if source!=target and context.endswith(':prompt'):
  # Exact source value is allowed to appear as Catalan place-value vocabulary.
  p=re.search(r'posición de (10|100|1000) unidades',original)
  names={'10':'desenes','100':'centenes','1000':'milers'}
  if p and names[p.group(1)] in translated:
   candidate=list(source);candidate.remove(p.group(1))
   if candidate==target:source=target
 if source!=target:raise AssertionError('Translation changes numeric tokens: '+context+' '+str(source)+' vs '+str(target))
 if math_ops(original)!=math_ops(translated):
  raise AssertionError('Translation changes operators: '+context)
 return True
