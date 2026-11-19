#!/usr/bin/env python3
"""E1-N02 Catalan activities: controlled original templates and mathematical strings."""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
bank=json.loads((R/'site/data/f3_e1_n02_exercises.json').read_text(encoding='utf8'))
target=R/'site/i18n/ca-ES/E1-N02.v1.json'
p=json.loads(target.read_text(encoding='utf8'))
hints={
'Un desplazamiento positivo va a la derecha; negativo, a la izquierda.':'Un desplaçament positiu va cap a la dreta; un de negatiu, cap a l’esquerra.',
'El opuesto cambia el signo. Identifica la operación y sus datos antes de responder.':'L’oposat canvia el signe. Identifica l’operació i les dades abans de respondre.',
'Piensa en la distancia a cero. Identifica la operación y sus datos antes de responder.':'Pensa en la distància fins a zero. Identifica l’operació i les dades abans de respondre.',
'Resta los extremos y toma el valor absoluto.':'Resta les posicions dels extrems i pren el valor absolut.',
'En la recta los números crecen hacia la derecha.':'A la recta numèrica, els nombres creixen cap a la dreta.',
'Suma las cantidades teniendo en cuenta sus signos.':'Suma les quantitats tenint en compte els signes.',
'Restar equivale a sumar el opuesto.':'Restar equival a sumar l’oposat.',
'Multiplica magnitudes y comprueba los signos.':'Multiplica els valors i comprova els signes.',
'Busca qué número, multiplicado por el divisor, da el dividendo.':'Busca el nombre que, multiplicat pel divisor, dona el dividend.',
'Primero multiplica; después suma.':'Primer multiplica i després suma.',
'Resuelve primero el paréntesis completo.':'Resol primer tot el parèntesi.'
}
reasons={
'Suma posición inicial y desplazamiento.':'Suma la posició inicial i el desplaçament.',
'El número y su opuesto suman cero.':'Un nombre i el seu oposat sumen zero.',
'Una distancia nunca tiene signo negativo.':'Una distància mai no té signe negatiu.',
'Es la cantidad de unidades entre ambos puntos.':'És el nombre d’unitats entre tots dos punts.',
'Compara posiciones, no los valores absolutos.':'Compara les posicions, no els valors absoluts.',
'Comprueba avanzando desde el primer número en la recta.':'Comprova-ho avançant des del primer nombre sobre la recta.',
'Si hay dos signos seguidos, conserva los paréntesis.':'Si hi ha dos signes seguits, conserva els parèntesis.',
'Un número par de signos negativos da signo positivo.':'Un nombre parell de signes negatius dona signe positiu.',
'Comprueba signos y que el divisor no sea cero.':'Comprova els signes i que el divisor no sigui zero.',
'No calcules automáticamente de izquierda a derecha.':'No calculis automàticament d’esquerra a dreta.',
'Después multiplica por el tercer valor.':'Després multiplica pel tercer valor.'
}
assert len(hints)==len(reasons)==11
def question(text):
 s=text
 s=s.replace('Partes de ','Surts de ').replace(' y te desplazas ',' i et desplaces ').replace(' unidades con signo.',' unitats amb signe.').replace(' ¿A qué número llegas?',' A quin nombre arribes?')
 s=s.replace('¿Cuál es el opuesto aditivo de ','Quin és l’oposat additiu de ')
 s=s.replace('Calcula el valor absoluto de ','Calcula el valor absolut de ')
 s=s.replace('¿Qué distancia hay en la recta entre ','Quina distància hi ha a la recta entre ').replace(' y (',' i (')
 s=s.replace('Compara ','Compara ').replace(' Elige <, = o > en ese orden.',' Tria <, = o >, en aquest ordre.')
 s=s.replace(' (división exacta)',' (divisió exacta)').replace(' respetando la jerarquía',' respectant la jerarquia')
 s=s.replace(' Selecciona la respuesta numérica correcta.',' Selecciona la resposta numèrica correcta.')
 if s==text and s.startswith('Calcula '):s='Calcula el resultat de '+s[len('Calcula '):]
 assert s!=text,('Untranslated prompt',text)
 return s
def explain(src,h):
 assert src.startswith('Método: '),src
 rem=src[len('Método: '):]
 assert rem.startswith(h+' '),(h,src)
 reason,sep,tail=rem[len(h)+1:].partition(' Datos utilizados: ')
 assert sep and reason in reasons,(h,reason)
 m=re.fullmatch(r'(.+)\. Resultado: ([^.]*)\. Verifica el cálculo y la unidad del enunciado\.',tail)
 assert m,tail
 data,answer=m.groups()
 return 'Mètode: '+hints[h]+' '+reasons[reason]+' Dades utilitzades: '+data+'. Resultat: '+answer+'. Comprova el càlcul i la unitat de l’enunciat.'
for a in bank['activities']:
 hint=a['hint']
 assert hint in hints
 p['activities'][a['exercise_id']]={'prompt':question(a['prompt']),
   'hint':hints[hint],
   'explanation':explain(a['explanation'],hint)}
assert len(p['lessons'])==6 and len(p['activities'])==30
target.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('E1_N02_FULL_DRAFT',len(p['lessons']),'lessons',len(p['activities']),'activities')
