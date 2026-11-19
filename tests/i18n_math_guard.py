#!/usr/bin/env python3
"""Conservative invariants for all ca-ES packages: numeric tokens and math operators."""
import re
NUM=re.compile(r'(?<!\w)(?:-|−)?\d{1,3}(?:[ \u00a0]\d{3})+|(?<!\w)(?:-|−)?\d+(?!\w)')
OPS=re.compile(r'[+×÷=<>−%≈≠√²³]|(?<![lL])·|·(?![lL])')
MATH_DIV=re.compile(r'(?<=\d)/|/(?=\d)|(?<=[a-z])/(?=[a-z](?![a-z]))')
def math_ops(text):return OPS.findall(text)+MATH_DIV.findall(text)
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
