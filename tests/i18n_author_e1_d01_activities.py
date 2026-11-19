from i18n_author_activity_common import add_activities,R
import json
P=[
'En Població, variable i dada: d’una població de 80 unitats se n’observen 20; calcula la MIDA de la mostra n. Introdueix el resultat numèric exacte sense unitats.',
'En Població, variable i dada: d’una població de 50 unitats se n’observen 12; calcula la MIDA de la mostra n. Introdueix el resultat numèric exacte sense unitats.',
'En Població, variable i dada: en el conjunt de dades [1, 3, 2, 3, 1], compta el NOMBRE d’observacions. Introdueix el resultat numèric exacte sense unitats.',
'En Població, variable i dada: tota mostra coincideix necessàriament amb la població completa? Sí/No. Tria l’opció vàlida.',
'En Població, variable i dada: el nombre de llibres llegits per estudiant és una variable: Quantitativa discreta, Qualitativa nominal o Contínua. Tria l’opció vàlida.',
'En Taules de freqüències: en les dades [1, 1, 2, 3, 3, 3], calcula la freqüència ABSOLUTA del valor 3. Introdueix el resultat numèric exacte sense unitats.',
'En Taules de freqüències: en les dades [1, 1, 2, 3, 3, 3], calcula la freqüència RELATIVA exacta del valor 3. Introdueix el resultat numèric exacte sense unitats.',
'En Taules de freqüències: una taula presenta les freqüències absolutes [2, 1, 3]. Calcula la mida n total. Introdueix el resultat numèric exacte sense unitats.',
'En Taules de freqüències: poden sumar 1,5 les freqüències relatives exactes de categories disjuntes i exhaustives? Sí/No. Tria l’opció vàlida.',
'En Taules de freqüències: en les dades [1, 1, 2, 3, 3, 3], calcula la freqüència ABSOLUTA del valor 1. Tria l’opció vàlida.',
'En Diagrames de barres i sectors: en un diagrama de sectors amb 3 dades sobre un total de 12, calcula l’ANGLE corresponent en graus. Introdueix el resultat numèric exacte sense unitats.',
'En Diagrames de barres i sectors: en un diagrama de sectors amb 6 dades sobre un total de 12, calcula l’ANGLE corresponent en graus. Introdueix el resultat numèric exacte sense unitats.',
'En Diagrames de barres i sectors: en un diagrama de sectors amb 2 dades sobre un total de 8, calcula l’ANGLE corresponent en graus. Introdueix el resultat numèric exacte sense unitats.',
'En Diagrames de barres i sectors: mitja mostra representa un sector de 50° en un diagrama circular? Sí/No. Tria l’opció vàlida.',
'En Diagrames de barres i sectors: quants graus ha de SUMAR un cercle complet ben repartit en sectors? Tria l’opció vàlida.',
'En Mitjana, mediana i moda inicials: calcula la MITJANA aritmètica exacta de la llista de dades [1, 2, 2, 3, 12]. Introdueix el resultat numèric exacte sense unitats.',
'En Mitjana, mediana i moda inicials: ordena les dades [1, 2, 2, 3, 12] i calcula la MEDIANA exacta. Introdueix el resultat numèric exacte sense unitats.',
'En Mitjana, mediana i moda inicials: per a les dades [1, 2, 2, 3, 12], calcula la MODA numèrica més freqüent. Introdueix el resultat numèric exacte sense unitats.',
'En Mitjana, mediana i moda inicials: és vàlid calcular la mitjana de colors nominals assignant nombres arbitraris a les categories? Sí/No. Tria l’opció vàlida.',
'En Mitjana, mediana i moda inicials: ordena les dades [1, 2, 3, 4] i calcula la MEDIANA exacta. Tria l’opció vàlida.',
'En Interpretació crítica de gràfiques: calcula la DIFERÈNCIA absoluta dels recomptes 52−48. Introdueix el resultat numèric exacte sense unitats.',
'En Interpretació crítica de gràfiques: calcula el CREIXEMENT relatiu de 48 a 52, com a fracció exacta respecte del valor inicial. Tria l’opció vàlida.',
'En Interpretació crítica de gràfiques: calcula el quocient exacte dels recomptes 52/48. Tria l’opció vàlida.',
'En Interpretació crítica de gràfiques: un eix truncat que dibuixa barres d’altures 1 i 5 demostra que els valors reals 48 i 52 estan en proporció 1:5? Sí/No. Tria l’opció vàlida.',
'En Interpretació crítica de gràfiques: calcula la DIFERÈNCIA absoluta dels recomptes 25−20. Tria l’opció vàlida.',
'En Experiments aleatoris i freqüència relativa: s’observen 7 casos en 10 assaigs. Calcula la FREQÜÈNCIA relativa exacta. Introdueix el resultat numèric exacte sense unitats.',
'En Experiments aleatoris i freqüència relativa: s’observen 9 casos en 20 assaigs. Calcula la FREQÜÈNCIA relativa exacta. Introdueix el resultat numèric exacte sense unitats.',
'En Experiments aleatoris i freqüència relativa: en 10 assaigs hi ha 7 èxits. Calcula la freqüència com a PERCENTATGE numèric (sense el símbol %). Introdueix el resultat numèric exacte sense unitats.',
'En Experiments aleatoris i freqüència relativa: set cares en deu llançaments demostren una probabilitat real de cara de 0,7? Sí/No. Tria l’opció vàlida.',
'En Experiments aleatoris i freqüència relativa: s’observen 3 casos en 10 assaigs. Calcula la FREQÜÈNCIA relativa exacta. Tria l’opció vàlida.'
]
H='Distingeix mostra, variable i dada; identifica el total n abans de convertir freqüències.'
TAIL=('Distingeix mostra, variable i dada; identifica el total n abans de convertir freqüències. '
      'La freqüència relativa és nᵢ/n, el sector mesura 360°·nᵢ/n; ordena les dades per a la mediana i compara la mitjana amb els extrems. '
      'La mostra no demostra res sobre tota la població. Comprova les condicions i el significat del denominador, la unitat, l’interval o el polígon.')
def explain(source):
 start='Solución verificada con aritmética exacta: '
 suffix=('. Distingue muestra, variable y dato; identifica el total n antes de convertir frecuencias. '
  'La frecuencia relativa es nᵢ/n, el sector mide 360°·nᵢ/n; ordena datos para mediana y compara media con extremos. '
  'La muestra no prueba la población. Comprueba las condiciones y el significado del denominador, unidad, intervalo o polígono.')
 assert source.startswith(start) and source.endswith(suffix),source[:80]
 answer=source[len(start):-len(suffix)]
 answer={'Cuantitativa discreta':'Quantitativa discreta','Cualitativa nominal':'Qualitativa nominal',
         'Continua':'Contínua'}.get(answer,answer)
 return 'Solució verificada amb aritmètica exacta: '+answer+'. '+TAIL
src=json.loads((R/'site/data/f3_e1_d01_exercises.json').read_text(encoding='utf8'))['activities']
assert len(src)==len(P)==30
for x in src:assert x['hint']=='Distingue muestra, variable y dato; identifica el total n antes de convertir frecuencias.'
items=[{'prompt':p,'hint':H,'explanation':explain(a['explanation'])} for p,a in zip(P,src)]
add_activities('E1-D01',items)
