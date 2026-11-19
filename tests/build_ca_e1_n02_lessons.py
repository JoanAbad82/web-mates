#!/usr/bin/env python3
"""E1-N02 Catalan educational content; original mathematical statements retained."""
from pathlib import Path
from hashlib import sha256
import json
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'site/data/f3_e1_n02.json'
bank=ROOT/'site/data/f3_e1_n02_exercises.json'
d=json.loads(source.read_text(encoding='utf8'))
translated={
'E1-N02-L01':(
'El significat dels nombres enters',
['Representar situacions mitjançant enters positius, negatius i zero.',
 'Interpretar els canvis com a desplaçaments amb signe.'],
[
'Els nombres enters amplien els naturals amb els nombres negatius i el zero. Un signe negatiu pot representar deutes, temperatures sota zero o altures inferiors a una referència; la interpretació depèn de la unitat i de l’origen escollit. Un canvi positiu fa augmentar el valor i un de negatiu el redueix. No confonguis el signe d’una quantitat amb l’operació que la modifica.',
'Si la temperatura és −3 °C i puja 5 °C, passa a 2 °C.',
'Un deute de 12 € s’expressa amb un saldo de −12 €; ingressar 7 € deixa un saldo de −5 €.',
'Temperatures i referència zero. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Una temperatura de −4 °C és més gran o més petita que 0 °C?||És més petita; se situa quatre unitats a l’esquerra de zero a la recta numèrica.',
'Idea essencial: els nombres enters amplien els naturals amb els nombres negatius i el zero. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'Temperatures i referència zero'),
'E1-N02-L02':(
'Ordre i valor absolut',
['Comparar nombres enters segons la seva posició a la recta numèrica.',
 'Calcular el valor absolut com a distància fins a zero.'],
[
'A la recta numèrica els nombres creixen d’esquerra a dreta. Entre dos enters negatius, el que és més proper a zero és més gran: −2 > −7. El valor absolut |a| és la distància no negativa des de a fins a 0; per això |−7| = 7 i |7| = 7. No confonguis distància i signe, perquè no expressen el mateix.',
'−8 < −3 perquè −8 és més a l’esquerra; en canvi |−8| = 8 > 3.',
'Els punts −5 i 3 estan separats per 8 unitats: |3 − (−5)| = |8| = 8.',
'Ordre i valor absolut. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Per què |−6| no és −6?||Perquè el valor absolut mesura la distància fins a zero i les distàncies no poden ser negatives.',
'Idea essencial: a la recta numèrica els nombres creixen d’esquerra a dreta. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'Ordre i valor absolut'),
'E1-N02-L03':(
'La recta dels enters i les distàncies',
['Situar enters en una recta amb escala uniforme.',
 'Calcular desplaçaments i distàncies entre posicions.'],
[
'Cada marca consecutiva d’una recta dels enters representa una unitat de longitud igual. Desplaçar-se cap a la dreta equival a sumar una quantitat positiva; cap a l’esquerra, a sumar-ne una de negativa. La distància entre les posicions a i b és |b − a| i mai no és negativa. En canvi, la diferència orientada b − a pot ser positiva o negativa, encara que la distància sigui la mateixa en tots dos sentits.',
'Sortir de −4 i avançar 7 unitats porta a 3: −4 + 7 = 3.',
'Entre −6 i 2 hi ha vuit unitats, tant si vas d’esquerra a dreta com si vas a la inversa.',
'De −4 a 3: set unitats. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'És el mateix el desplaçament que la distància de −2 a 4?||El desplaçament és +6; la distància és 6 unitats, sense signe.',
'Idea essencial: cada marca consecutiva d’una recta dels enters representa una mateixa unitat de longitud. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'De −4 a 3: set unitats'),
'E1-N02-L04':(
'Suma i resta de nombres enters',
['Sumar enters amb signes iguals o diferents.',
 'Transformar restes en sumes de l’oposat.'],
[
'En sumar dos enters amb el mateix signe, se sumen els valors absoluts i es manté el signe. Si tenen signes diferents, es resten els valors absoluts i es conserva el signe del que té més valor absolut; si coincideixen, el resultat és zero. Restar un enter equival a sumar el seu oposat: a − b = a + (−b). Els parèntesis ajuden a distingir el signe d’un nombre del signe de l’operació.',
'(−9) + (+4) = −5; el valor absolut de nou és més gran que el quatre.',
'6 − (−3) = 6 + 3 = 9, perquè sumem l’oposat de −3.',
'Suma amb signes diferents. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Per què −5 − (−2) és −3?||Perquè restar −2 equival a sumar +2: −5 + 2 = −3.',
'Idea essencial: en sumar enters amb el mateix signe, se sumen els valors absoluts i es conserva el signe. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'Suma amb signes diferents'),
'E1-N02-L05':(
'Multiplicació i divisió de nombres enters',
['Aplicar la regla dels signes en multiplicar i dividir enters.',
 'Comprovar quocients exactes amb una multiplicació.'],
[
'En un producte de dos factors diferents de zero, dos signes iguals donen un resultat positiu i dos signes diferents donen un resultat negatiu. La mateixa regla serveix per a les divisions exactes d’enters, però mai no es divideix entre zero. Un producte amb un factor zero és zero. La regla dels signes no substitueix el càlcul correcte dels valors absoluts.',
'(−6) × (−4) = +24 perquè dos factors negatius donen un resultat positiu.',
'−42 ÷ 7 = −6; comprova-ho: −6 × 7 = −42. No es pot dividir 42 entre 0.',
'Producte de signes. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Un producte de tres factors negatius és positiu o negatiu?||És negatiu, perquè el nombre de factors negatius és imparell.',
'Idea essencial: en un producte de dos factors diferents de zero, els signes iguals donen un resultat positiu i els diferents, negatiu. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'Producte de signes'),
'E1-N02-L06':(
'Operacions combinades amb enters',
['Resoldre operacions combinades amb nombres enters.',
 'Justificar el signe i la prioritat de cada pas.'],
[
'A les operacions amb enters es manté la jerarquia: primer parèntesis, després multiplicacions i divisions, i finalment sumes i restes, sempre d’esquerra a dreta dins de cada nivell. Calcula primer els productes i quocients tenint en compte el signe; després suma o resta. Distingeix −(3 + 4) de (−3) + 4, que no són expressions equivalents. Comprova el resultat amb l’operació original.',
'A l?expressi? −7 + 3 × (−2), primer 3 × (−2) = −6; després −7 + (−6) = −13.',
'(−7 + 3) × (−2) = (−4) × (−2) = 8. Els parèntesis canvien el resultat.',
'Ordre de càlcul amb enters. Fes servir la taula alternativa per llegir els valors exactes, independentment del gràfic.',
'Què cal fer primer a −5 + 2 × (−4)?||Multiplicar 2 × (−4) = −8; després sumar −5 + (−8) = −13.',
'Idea essencial: les operacions amb enters segueixen la jerarquia de parèntesis, multiplicació i divisió, suma i resta, d’esquerra a dreta dins de cada nivell. Identifica el procediment, explica’l i comprova un exemple nou sense mirar les pistes.'],
'Ordre de càlcul amb enters')
}
assert set(translated)=={x['lesson_id'] for x in d['lesson_documents']}
pack={
 'schema':'webmates.ca-ES.unit-overlay.v1','version':'1.0.0','locale':'ca-ES',
 'unit_id':'E1-N02','translation_status':'draft_unreviewed',
 'source_files_sha256':{'data/'+source.name:sha256(source.read_bytes()).hexdigest(),
                        'data/'+bank.name:sha256(bank.read_bytes()).hexdigest()},
 'lessons':{},'activities':{}
}
for source_lesson in d['lesson_documents']:
 lid=source_lesson['lesson_id']
 title,objectives,bodies,figure_title=translated[lid]
 assert len(objectives)==len(source_lesson['objectives'])==2
 assert len(bodies)==len(source_lesson['content_blocks'])==6
 blocks=[]
 for source_block,body in zip(source_lesson['content_blocks'],bodies):
  entry={'body':body}
  if 'alt' in source_block:
   entry['alt']=figure_title+'. Totes les dades d’aquesta representació també apareixen en una taula semàntica.'
  if 'visual_spec' in source_block and 'title' in source_block['visual_spec']:
   entry['visual_spec']={'title':figure_title}
  blocks.append(entry)
 pack['lessons'][lid]={'title':title,'objectives':objectives,'content_blocks':blocks}
target=ROOT/'site/i18n/ca-ES/E1-N02.v1.json'
assert not target.exists()
target.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('E1_N02_LESSON_DRAFTS',len(pack['lessons']))
