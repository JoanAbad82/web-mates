#!/usr/bin/env python3
"""Regression cases for slash classification in Spanish-to-Catalan math text.
Protect true division independently of accent/morphology; permit editorial / -> i.
"""
from i18n_math_guard import math_guard,math_ops
PASSED=0
def positive(source,target):
 global PASSED
 assert math_guard(source,target,'slash_positive'),(source,target)
 PASSED+=1
def negative(source,target):
 global PASSED
 try:math_guard(source,target,'slash_negative')
 except AssertionError:PASSED+=1
 else:raise AssertionError('Unsafe formula accepted: '+repr(source)+' => '+repr(target))
positive('P(A)=favorables/número de resultados posibles.',
         'P(A)=favorables/nombre de resultats possibles.')
positive('P(A)=favorables / número de resultados posibles.',
         'P(A)=favorables / nombre de resultats possibles.')
positive('Suma/resta con denominador común.',
         'Suma o resta amb denominador comú.')
positive('Sumar/restar conserva el signo.',
         'Sumar / restar conserva el signe.')
positive('Multiplicaciones/divisiones antes de sumas/restas.',
         'Multiplicacions/divisions abans de sumes/restes.')
positive('Alinea posiciones al sumar/restar.',
         'Alinea les posicions en sumar i restar.')
positive('f(x)=x/y','f(x)=x/y')
negative('P(A)=favorables/número de resultados posibles.',
         'P(A)=favorables nombre de resultats possibles.')
negative('f(x)=x/y','f(x)=x y')
negative('P(A)=2/3','P(A)=2 3')
negative('x+y=1','x−y=1')
print('UNICODE_SLASH_MATH_REGRESSION_PASS',PASSED)
