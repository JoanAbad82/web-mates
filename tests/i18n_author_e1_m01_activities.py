from pathlib import Path
import json,re
from i18n_author_activity_common import add_activities,R
from i18n_math_guard import math_guard
P=[
'Tria la unitat adequada per mesurar la longitud d’un passadís.',
'Tria la unitat adequada per mesurar la massa d’una bossa de pomes.',
'Tria la unitat adequada per mesurar la capacitat d’una ampolla.',
'Tria la unitat adequada per mesurar la durada d’una cursa.',
'Tria la unitat adequada per mesurar la massa d’una motxilla.',
'Converteix 2,4 km a m; indica només el valor numèric.',
'Converteix 750 g a kg; indica només el valor numèric.',
'Converteix 0,35 km a m; indica només el valor numèric.',
'Converteix 75 cm a m; indica només el valor numèric. Selecciona el valor exacte correcte.',
'Converteix 90 min a h; indica només el valor numèric. Selecciona el valor exacte correcte.',
'Arrodoneix 2,34 m a la dècima de metre més propera.',
'Arrodoneix 7,86 m a la dècima de metre més propera.',
'Arrodoneix 1,235 m a la dècima de metre més propera.',
'Quina és la diferència absoluta entre 2,34 i 2,3 (en les mateixes unitats)? Selecciona el valor exacte correcte.',
'Quina és la meitat d’una resolució de 0,1 unitats? Selecciona el valor exacte correcte.',
'En un plànol d’escala 1:25000, una distància de 4 cm equival a quants metres reals?',
'En un plànol d’escala 1:50000, una distància de 3 cm equival a quants metres reals?',
'En un plànol a escala 1:10000, quants centímetres es dibuixen per a 500 metres reals?',
'En un plànol d’escala 1:100, una distància de 6 cm equival a quants metres reals? Selecciona el valor exacte correcte.',
'En un plànol a escala 1:30000, quants centímetres es dibuixen per a 1200 metres reals? Selecciona el valor exacte correcte.',
'Calcula en cm el perímetre d’un rectangle de 7 × 4 cm.',
'Quin és el perímetre en cm d’un quadrat de costat 6 cm?',
'Calcula en cm el perímetre d’un rectangle de 12 × 5 cm.',
'Un polígon té longituds exteriors 4, 3, 4, 3 cm. Quin és el perímetre en cm? Selecciona el valor exacte correcte.',
'Quin és el perímetre en cm d’un quadrat de costat 9 cm? Selecciona el valor exacte correcte.',
'Uneix dues cintes: una de 5 m i una altra de 75 cm. Quants metres mesuren juntes?',
'Un trajecte té 1,2 km i després 850 m. Quants metres sumen?',
'Uneix dues cintes: una de 3 m i una altra de 40 cm. Quants metres mesuren juntes?',
'Un trajecte té 2,2 km i després 350 m. Quants metres sumen? Selecciona el valor exacte correcte.',
'Uneix dues cintes: una de 2 m i una altra de 50 cm. Quants metres mesuren juntes? Selecciona el valor exacte correcte.'
]
H={
'Identifica si la magnitud es longitud, masa, capacidad o tiempo.':'Identifica si la magnitud és longitud, massa, capacitat o temps.',
'Aplica una equivalencia exacta y cancela la unidad de origen.':'Aplica una equivalència exacta i cancel·la la unitat d’origen.',
'La cifra centesimal determina si cambia la décima.':'La xifra de les centèsimes determina si canvia la dècima.',
'Calcula la diferencia con un orden cualquiera.':'Calcula la diferència en qualsevol dels dos ordres.',
'Divide entre dos el tamaño del paso de redondeo.':'Divideix entre dos la mida del pas d’arrodoniment.',
'Multiplica los centímetros del plano por el denominador de la escala.':'Multiplica els centímetres del plànol pel denominador de l’escala.',
'Pasa primero metros reales a centímetros.':'Converteix primer els metres reals a centímetres.',
'Suma los cuatro lados exteriores.':'Suma els quatre costats exteriors.',
'Un cuadrado tiene cuatro lados iguales.':'Un quadrat té quatre costats iguals.',
'El contorno es la suma de los lados exteriores.':'El contorn és la suma dels costats exteriors.',
'Convierte la segunda cinta de centímetros a metros.':'Converteix la segona cinta de centímetres a metres.',
'Convierte kilómetros a metros antes de sumar.':'Converteix els quilòmetres a metres abans de sumar.'
}
R1={
'No confundas unidades que representen magnitudes diferentes.':'No confonguis unitats que representen magnituds diferents.',
'Multiplica la cantidad de partida por el factor de conversión correspondiente.':'Multiplica la quantitat inicial pel factor de conversió corresponent.',
'En empates positivos el valor se redondea hacia arriba.':'En els empats positius, el valor s’arrodoneix cap amunt.',
'Toma el valor absoluto: el resultado no puede ser negativo.':'Pren el valor absolut: el resultat no pot ser negatiu.',
'La mitad de un intervalo no certifica la precisión instrumental.':'La meitat d’un interval no certifica la precisió de l’instrument.',
'Convierte los centímetros reales a metros dividiendo entre cien.':'Converteix els centímetres reals a metres dividint per cent.',
'Divide la longitud real en centímetros entre la razón de escala.':'Divideix la longitud real en centímetres per la raó d’escala.',
'El perímetro del rectángulo es dos veces la suma de su base y altura.':'El perímetre del rectangle és el doble de la suma de la base i l’altura.',
'Multiplica el lado por cuatro, no lo eleves al cuadrado.':'Multiplica el costat per quatre, no l’elevïs al quadrat.',
'No confundas longitud del borde con área interior.':'No confonguis la longitud de la vora amb l’àrea interior.',
'Suma las longitudes expresadas en una sola unidad.':'Suma les longituds expressades en una mateixa unitat.',
'Un kilómetro equivale a mil metros.':'Un quilòmetre equival a mil metres.'
}
def explain(source,hint):
 head='Procedimiento: '
 assert source.startswith(head),source
 prefix,sep,after=source.partition('. '+hint+' ')
 assert sep,(source,hint)
 pre=prefix[len(head):]
 # Preserve the mathematical expression and its token sequence; replace only Spanish prose.
 pre=pre.replace('Relaciona la magnitud física con una unidad de esa misma dimensión','Relaciona la magnitud física amb una unitat de la mateixa dimensió')
 pre=pre.replace('Cantidad × factor','Quantitat × factor').replace('redondeo a paso','arrodoniment al pas')
 reason,sep,tail=after.partition(' Resultado correcto: ')
 assert sep and reason in R1,reason
 result,sep,finish=tail.partition('. Verifica unidades y condiciones geométricas antes de avanzar.')
 assert sep and not finish,tail
 # Textual answers are localized only in explanations, never in canonical choices or validators.
 result={'metro (m)':'metre (m)','kilogramo (kg)':'quilogram (kg)','litro (L)':'litre (L)',
         'segundo (s)':'segon (s)'}.get(result,result)
 return 'Procediment: '+pre+'. '+H[hint]+' '+R1[reason]+' Resultat correcte: '+result+'. Comprova les unitats i les condicions geomètriques abans de continuar.'
bank=json.loads((R/'site/data/f3_e1_m01_exercises.json').read_text(encoding='utf8'))['activities']
assert len(bank)==len(P)==30 and len(H)==len(R1)==12
translations=[]
for a,prompt in zip(bank,P):
 assert a['hint'] in H
 translations.append({'prompt':prompt,'hint':H[a['hint']],'explanation':explain(a['explanation'],a['hint'])})
add_activities('E1-M01',translations)
