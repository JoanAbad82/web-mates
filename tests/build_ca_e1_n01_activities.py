#!/usr/bin/env python3
"""Catalan E1-N01 activity texts from a controlled, exact-phrase translation bank."""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
bank=json.loads((R/'site/data/f3_e1_n01_exercises.json').read_text(encoding='utf8'))
file=R/'site/i18n/ca-ES/E1-N01.v1.json'
pack=json.loads(file.read_text(encoding='utf8'))
hint_translations={
'Cada posición multiplica una cifra por una potencia de diez.':'Cada posició multiplica una xifra per una potència de deu.',
'Identifica la cifra y multiplícala por su unidad de orden.':'Identifica la xifra i multiplica-la pel valor de la seva posició.',
'En la recta los números crecen hacia la derecha.':'A la recta numèrica, els nombres creixen cap a la dreta.',
'Busca los dos múltiplos vecinos de la posición indicada.':'Busca els dos múltiples consecutius que delimiten el nombre, segons la posició indicada.',
'Redondea cada número por separado antes de sumar.':'Arrodoneix cada nombre per separat abans de sumar.',
'Suma las cantidades teniendo en cuenta sus signos.':'Suma les quantitats tenint en compte els signes.',
'Restar equivale a sumar el opuesto.':'Restar equival a sumar l’oposat.',
'Multiplica magnitudes y comprueba los signos.':'Multiplica els valors i comprova els signes.',
'Busca qué número, multiplicado por el divisor, da el dividendo.':'Busca el nombre que, multiplicat pel divisor, dona el dividend.',
'Primero multiplica; después suma.':'Primer multiplica i després suma.',
'Resuelve primero el paréntesis completo.':'Resol primer tot el parèntesi.',
'Puedes calcular primero el paréntesis o distribuir el factor.':'Pots calcular primer el parèntesi o distribuir el factor.',
'Resta las salidas y añade las entradas.':'Resta les sortides i afegeix-hi les entrades.',
'Multiplica número de artículos por precio unitario.':'Multiplica el nombre d’articles pel preu unitari.',
'Divide y considera si queda alguien sin plaza.':'Divideix i comprova si queda algú sense plaça.'
}
second={
'Separa miles, centenas, decenas y unidades.':'Separa milers, centenes, desenes i unitats.',
'El valor de una cifra no es siempre la cifra sola.':'El valor posicional d’una xifra no sempre coincideix amb el valor de la xifra aïllada.',
'Compara posiciones, no los valores absolutos.':'Compara les posicions, no els valors absoluts.',
'Comprueba si el resto alcanza la mitad del intervalo.':'Comprova si la resta arriba a la meitat de l’interval.',
'Una estimación no es necesariamente la suma exacta.':'Una estimació no és necessàriament igual a la suma exacta.',
'Comprueba avanzando desde el primer número en la recta.':'Comprova-ho avançant des del primer nombre sobre la recta.',
'Si hay dos signos seguidos, conserva los paréntesis.':'Si hi ha dos signes seguits, conserva els parèntesis.',
'Un número par de signos negativos da signo positivo.':'Un nombre parell de signes negatius dona signe positiu.',
'Comprueba signos y que el divisor no sea cero.':'Comprova els signes i que el divisor no sigui zero.',
'No calcules automáticamente de izquierda a derecha.':'No calculis automàticament d’esquerra a dreta.',
'Después multiplica por el tercer valor.':'Després multiplica pel tercer valor.',
'La suma puede contener un número negativo.':'La suma pot contenir un nombre negatiu.',
'La cantidad final lleva las mismas unidades.':'La quantitat final manté les mateixes unitats.',
'Resta el coste total del presupuesto.':'Resta el cost total del pressupost.',
'Si sobra al menos una persona, necesitas un vehículo adicional.':'Si queda com a mínim una persona sense plaça, necessites un vehicle addicional.'
}
assert len(hint_translations)==len(second)==15
def translate_prompt(source):
 s=source
 s=s.replace('Redondea ','Arrodoneix ').replace(' a la unidad de ',' a la unitat de ').replace(' más próxima',' més propera')
 s=s.replace('Estima ','Estima ').replace(' redondeando cada sumando a ',' arrodonint cada sumand a ').replace(' unidades.',' unitats.')
 s=s.replace(' (división exacta)',' (divisió exacta)')
 s=s.replace(' respetando la jerarquía',' respectant la jerarquia')
 s=s.replace(' usando la distributiva',' fent servir la propietat distributiva')
 s=s.replace(' Selecciona la respuesta numérica correcta.',' Selecciona la resposta numèrica correcta.')
 s=s.replace('Hay ','Hi ha ').replace(' unidades; salen ',' unitats; en surten ').replace(' y entran ',' i n’entren ').replace(' ¿Cuántas quedan?',' Quantes en queden?')
 s=s.replace('Con ','Amb ').replace(' se pagan ',' es paguen ').replace(' artículos de ',' articles de ').replace(' cada uno.',' cadascun.').replace(' ¿Cuánto queda?',' Quant en queda?')
 s=s.replace('Viajan ','Viatgen ').replace(' personas en vehículos de ',' persones en vehicles de ').replace(' plazas.',' places.').replace(' ¿Cuántos vehículos completos o parciales hacen falta?',' Quants vehicles, plens o parcials, fan falta?')
 if s==source and s.startswith('Calcula '):s='Calcula el resultat de '+s[len('Calcula '):]
 return s
def translate_explanation(src,hint):
 assert src.startswith('Método: '),src
 tail=src[len('Método: '):]
 assert tail.startswith(hint+' '),(hint,tail)
 second_text,sep,rest=tail[len(hint)+1:].partition(' Datos utilizados: ')
 assert sep and second_text in second,second_text
 match=re.fullmatch(r'(.+)\. Resultado: ([^.]*)\. Verifica el cálculo y la unidad del enunciado\.',rest)
 assert match,rest
 values,answer=match.groups()
 return 'Mètode: '+hint_translations[hint]+' '+second[second_text]+' Dades utilitzades: '+values+'. Resultat: '+answer+'. Comprova el càlcul i la unitat de l’enunciat.'
changed=0
for a in bank['activities']:
 if a['lesson_id']=='E1-N01-L01':continue
 assert a['hint'] in hint_translations
 original=a['prompt']
 translated_prompt=translate_prompt(original)
 assert translated_prompt!=original,(a['exercise_id'],original)
 translated_explanation=translate_explanation(a['explanation'],a['hint'])
 assert translated_explanation!=a['explanation']
 pack['activities'][a['exercise_id']]={'prompt':translated_prompt,
   'hint':hint_translations[a['hint']],
   'explanation':translated_explanation}
 changed+=1
assert changed==25 and len(pack['activities'])==30 and len(pack['lessons'])==6
file.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('E1_N01_COMPLETE_DRAFT',len(pack['lessons']),'lessons',len(pack['activities']),'activities')
