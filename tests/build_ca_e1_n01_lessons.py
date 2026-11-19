#!/usr/bin/env python3
"""E1-N01: manually authored Catalan lesson translations, all numbers/math left semantically unchanged."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'site/data/f3_e1_n01.json').read_text(encoding='utf8'))
bank=json.loads((ROOT/'site/data/f3_e1_n01_exercises.json').read_text(encoding='utf8'))
target=ROOT/'site/i18n/ca-ES/E1-N01.v1.json'
pack=json.loads(target.read_text(encoding='utf8'))
lesson_texts={
'E1-N01-L02':{
'title':'Arrodoniment i estimació',
'objectives':['Arrodonir nombres naturals a desenes, centenes o milers.',
              'Distingir el resultat exacte d’una estimació raonada.'],
'blocks':[
'Arrodonir a una posició vol dir triar el múltiple més proper de la unitat corresponent. Si un nombre natural queda just a la meitat entre dos múltiples, arrodonim cap amunt. Mira la xifra immediatament a la dreta de la posició: de 0 a 4 es manté i de 5 a 9 s’incrementa una unitat. Una estimació serveix per orientar-nos, però no substitueix un càlcul exacte quan cal precisió.',
'3 472 arrodonit a les centenes és 3 500, perquè 72 és més a prop de 100 que de 0.',
'Si sumem 248 i 352, arrodonits a les centenes estimem 200 + 400 = 600; en aquest cas particular, la suma exacta també és 600.',
'Posicions per arrodonir 3 472. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Arrodonir 2 449 a les centenes dona 2 400 o 2 500?||Dona 2 400: la xifra de les desenes és quatre i la resta 49 és inferior a 50.',
'Idea essencial: arrodonir a una posició vol dir triar el múltiple més proper d’aquella unitat; si el nombre natural és just a la meitat, arrodonim cap amunt. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'figure_alt':'Posicions per arrodonir 3 472. Totes les dades de la representació també apareixen en una taula semàntica.',
'figure_title':'Posicions per arrodonir 3 472'
},
'E1-N01-L03':{
'title':'Operacions amb nombres naturals',
'objectives':['Fer operacions amb nombres naturals i comprovar-les amb les operacions inverses.',
              'Interpretar divisions exactes i les restriccions del divisor.'],
'blocks':[
'La suma i el producte de nombres naturals també són nombres naturals. En canvi, una resta només dona un nombre natural si el resultat no és negatiu; una divisió pot no ser exacta i no es pot dividir mai entre zero. Comprova les sumes mitjançant restes, les multiplicacions mitjançant divisions i les divisions exactes multiplicant el quocient pel divisor. Escriu les unitats quan resolguis problemes.',
'367 + 128 = 495; per comprovar-ho, resta 128 de 495 i recupera 367.',
'864 ÷ 12 = 72 perquè 72 × 12 = 864. Dividir entre zero no representa cap repartiment possible.',
'Comprovació d’una operació. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Per què 13 ÷ 4 no és una divisió exacta entre nombres naturals?||Perquè 4 × 3 = 12 i en sobra 1; no hi ha cap quocient natural que, multiplicat per quatre, doni tretze.',
'Idea essencial: la suma i el producte de nombres naturals són nombres naturals. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'figure_alt':'Comprovació d’una operació. Totes les dades de la representació també apareixen en una taula semàntica.',
'figure_title':'Comprovació d’una operació'
},
'E1-N01-L04':{
'title':'Jerarquia de les operacions',
'objectives':['Resoldre operacions combinades respectant les prioritats.',
              'Justificar el paper dels parèntesis, els productes i les sumes.'],
'blocks':[
'Els parèntesis tenen prioritat sobre les operacions que queden fora; després es fan multiplicacions i divisions d’esquerra a dreta, i finalment sumes i restes, també d’esquerra a dreta. Quan hi ha operacions de nivells diferents, no n’hi ha prou de calcular-les totes d’esquerra a dreta. Separar els passos redueix els errors d’interpretació i facilita revisar el resultat.',
'6 + 4 × 3 = 6 + 12 = 18, perquè la multiplicació es fa abans que la suma.',
'(6 + 4) × 3 = 10 × 3 = 30; afegir parèntesis canvia l’expressió i el seu valor.',
'Ordre de càlcul de 6 + 4 × 3. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Per què 8 + 2 × 5 no és 50?||Perquè abans de sumar 8 cal multiplicar 2 × 5; el resultat correcte és 18.',
'Idea essencial: els parèntesis tenen prioritat; a continuació fem multiplicacions i divisions d’esquerra a dreta, i finalment sumes i restes en el mateix ordre. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'figure_alt':'Ordre de càlcul de 6 + 4 × 3. Totes les dades de la representació també apareixen en una taula semàntica.',
'figure_title':'Ordre de càlcul de 6 + 4 × 3'
},
'E1-N01-L05':{
'title':'Propietats de les operacions',
'objectives':['Fer servir les propietats commutativa, associativa i distributiva.',
              'Triar transformacions equivalents que simplifiquin els càlculs.'],
'blocks':[
'Amb nombres naturals, la suma i la multiplicació són commutatives i associatives; la resta i la divisió, en general, no ho són. La propietat distributiva permet substituir a × (b + c) per a × b + a × c. Descompondre nombres en sumes convenients ajuda a calcular mentalment sense canviar el resultat; comprova sempre que la transformació respecti els parèntesis i els signes.',
'C\u00e0lcul equivalent: 25 × 16 = 25 × (4 × 4) = (25 × 4) × 4 = 400.',
'7 × 19 = 7 × (20 − 1) = 140 − 7 = 133; és una aplicació de la distributiva de la multiplicació respecte d’una diferència.',
'Propietat distributiva a 7 × 19. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'És correcte intercanviar els termes de 15 − 6?||No: 15 − 6 = 9 i 6 − 15 = −9; la resta no és commutativa.',
'Idea essencial: la suma i la multiplicació de naturals són commutatives i associatives; la resta i la divisió, en general, no. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'figure_alt':'Propietat distributiva a 7 × 19. Totes les dades de la representació també apareixen en una taula semàntica.',
'figure_title':'Propietat distributiva a 7 × 19'
},
'E1-N01-L06':{
'title':'Problemes de diverses operacions',
'objectives':['Modelitzar problemes que requereixen diverses operacions.',
              'Comprovar que la resposta és coherent amb el context i les unitats.'],
'blocks':[
'Un problema de diverses etapes requereix identificar les dades, la incògnita i l’ordre lògic de les operacions. Dibuixa o escriu quantitats parcials, calcula amb les unitats correctes i comprova que el resultat tingui sentit. Quan hi ha agrupacions o repartiments, distingeix el nombre de grups del nombre d’elements per grup. En problemes de capacitat, de vegades cal arrodonir cap amunt.',
'Una escola compra 5 caixes de 24 llapis i en reparteix 37: en queden 5 × 24 − 37 = 83.',
'A una excursió hi van 67 persones i en cada autocar n’hi caben 20: calen 4 autocars, perquè tres només tenen capacitat per a 60 persones.',
'Problema d’existències. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Per què tres autocars de 20 places no són suficients per a 67 persones?||Perquè 3 × 20 = 60 places; en falten 7 i cal un quart autocar.',
'Idea essencial: un problema de diverses etapes requereix identificar les dades, la incògnita i l’ordre lògic de les operacions. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'figure_alt':'Problema d’existències. Totes les dades de la representació també apareixen en una taula semàntica.',
'figure_title':'Problema d’existències'
}
}
docs={x['lesson_id']:x for x in data['lesson_documents']}
assert len(lesson_texts)==5
for lid,entry in lesson_texts.items():
 src=docs[lid]
 assert len(src['objectives'])==len(entry['objectives'])==2
 assert len(src['content_blocks'])==len(entry['blocks'])==6
 blocks=[]
 for n,(block,body) in enumerate(zip(src['content_blocks'],entry['blocks'])):
  result={'body':body}
  if 'alt' in block:result['alt']=entry['figure_alt']
  if 'visual_spec' in block and 'title' in block['visual_spec']:
   result['visual_spec']={'title':entry['figure_title']}
  blocks.append(result)
 pack['lessons'][lid]={'title':entry['title'],'objectives':entry['objectives'],'content_blocks':blocks}
target.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('LESSONS_AUTHORED',len(pack['lessons']))
