import json
from i18n_author_activity_common import add_activities,R
P=[
'Quants graus mesura el complement de 37°?',
'Quants graus mesura el suplement de 115°?',
'Classifica un angle de 60°: agut, recte o obtús.',
'Quants graus mesura el suplement de 145°? Selecciona el valor exacte correcte.',
'Classifica un angle de 125°: agut, recte o obtús.',
'Dos angles interiors d’un triangle són de 48° i 72°. Quants graus mesura el tercer?',
'Les longituds 2, 3 i 6 cm formen un triangle no degenerat?',
'Dos angles interiors d’un triangle són de 35° i 65°. Quants graus mesura el tercer?',
'Les longituds 4, 5 i 8 cm formen un triangle no degenerat?',
'Classifica segons els costats el triangle 3, 3, 3: equilàter, isòsceles o escalè.',
'Un quadrilàter té tres angles interiors de 90, 80, 100 graus. Quant mesura el quart?',
'Un polígon té longituds exteriors de 6, 3, 6, 3 cm. Quin és el perímetre en cm?',
'Un quadrilàter té tres angles interiors de 100, 90, 80 graus. Quant mesura el quart?',
'Quina figura té quatre costats iguals i quatre angles interiors de 90°?',
'Un polígon té longituds exteriors de 5, 5, 5, 5, 5 cm. Quin és el perímetre en cm? Selecciona el valor exacte correcte.',
'Una circumferència té un radi de 4 cm. Quants cm mesura el seu diàmetre?',
'Una circumferència té un diàmetre de 10 cm. Quants cm mesura el seu radi?',
'Una circumferència té un radi de 7 cm. Quants cm mesura el seu diàmetre?',
'Quina és la longitud EXACTA de la circumferència de radi 4 cm? Selecciona l’expressió amb π.',
'Quina és la longitud EXACTA de la circumferència de radi 5 cm? Selecciona l’expressió amb π.',
'Quina és l’àrea en cm² d’un rectangle de base 7 cm i altura 4 cm?',
'Quina és l’àrea en cm² d’un triangle de base 10 cm i altura perpendicular 6 cm?',
'Calcula l’àrea en cm² d’un paral·lelogram de base 8 cm i altura perpendicular 5 cm.',
'Quina és l’àrea EXACTA d’un cercle de radi 3 cm? Selecciona l’expressió amb π.',
'Quina és l’àrea en cm² d’un triangle de base 13 cm i altura perpendicular 8 cm? Selecciona el valor exacte correcte.',
'Una placa de 8×6 cm té un buit interior sense superposició de 3×2 cm. Quina àrea de material hi queda (cm²)?',
'Dos rectangles SENSE superposició mesuren 4×3 cm i 2×5 cm. Quina àrea conjunta tenen en cm²?',
'Una placa de 10×8 cm té un buit interior sense superposició de 4×3 cm. Quina àrea de material hi queda (cm²)?',
'Dos rectangles SENSE superposició mesuren 5×2 cm i 3×4 cm. Quina àrea conjunta tenen en cm²? Selecciona el valor exacte correcte.',
'Una placa de 12×9 cm té un buit interior sense superposició de 5×2 cm. Quina àrea de material hi queda (cm²)? Selecciona el valor exacte correcte.'
]
H={
'Los ángulos complementarios suman noventa grados.':'Els angles complementaris sumen noranta graus.',
'Los suplementarios suman ciento ochenta grados.':'Els angles suplementaris sumen cent vuitanta graus.',
'Compara la abertura con noventa grados.':'Compara l’obertura amb noranta graus.',
'La suma de ángulos interiores es ciento ochenta.':'La suma dels angles interiors és de cent vuitanta graus.',
'El lado mayor debe ser menor que la suma de los otros dos.':'El costat més llarg ha de ser menor que la suma dels altres dos.',
'Cuenta cuántos lados son iguales.':'Compta quants costats són iguals.',
'La suma de sus cuatro ángulos es trescientos sesenta.':'La suma dels quatre angles és de tres-cents seixanta graus.',
'El contorno es la suma de los lados exteriores.':'El contorn és la suma dels costats exteriors.',
'Identifica lados iguales y todos los ángulos rectos.':'Identifica els costats iguals i tots els angles rectes.',
'El diámetro pasa por el centro y mide dos radios.':'El diàmetre passa pel centre i mesura dos radis.',
'El radio es la mitad del diámetro.':'El radi és la meitat del diàmetre.',
'Recuerda que la longitud es dos veces pi por el radio.':'Recorda que la longitud és dues vegades pi pel radi.',
'El área del rectángulo es base por altura.':'L’àrea del rectangle és base per altura.',
'Multiplica base por altura perpendicular.':'Multiplica base per altura perpendicular.',
'Área es base por altura perpendicular, no lado oblicuo.':'L’àrea és base per altura perpendicular, no per costat oblic.',
'El área es pi multiplicado por radio al cuadrado.':'L’àrea és pi multiplicat pel radi al quadrat.',
'Calcula superficie exterior y área del hueco.':'Calcula la superfície exterior i l’àrea del buit.',
'Calcula las dos áreas de rectángulos.':'Calcula les dues àrees dels rectangles.'
}
R1={
'Resta el ángulo conocido a noventa.':'Resta l’angle conegut de noranta.',
'Resta el ángulo conocido a ciento ochenta.':'Resta l’angle conegut de cent vuitanta.',
'Agudo es menor que 90°; recto igual a 90°; obtuso mayor.':'Un angle agut és menor que 90°; un de recte és igual a 90°; un d’obtús és més gran.',
'Resta los dos ángulos conocidos a ciento ochenta.':'Resta els dos angles coneguts de cent vuitanta.',
'Si hay igualdad o superioridad, los segmentos no cierran un triángulo.':'Si hi ha igualtat o el costat més llarg no és menor, els segments no tanquen un triangle.',
'Todos iguales: equilátero; dos iguales: isósceles; todos distintos: escaleno.':'Tots iguals: equilàter; dos iguals: isòsceles; tots diferents: escalè.',
'Resta los tres ángulos conocidos a trescientos sesenta.':'Resta els tres angles coneguts de tres-cents seixanta.',
'No confundas longitud del borde con área interior.':'No confonguis la longitud de la vora amb l’àrea interior.',
'Un cuadrado reúne ambas propiedades; es un caso de rectángulo.':'Un quadrat compleix totes dues propietats; és un cas particular de rectangle.',
'Multiplica por dos el radio dado.':'Multiplica per dos el radi donat.',
'Divide el diámetro entre dos. Comprueba el cálculo con la operación inversa.':'Divideix el diàmetre entre dos. Comprova el càlcul amb l’operació inversa.',
'Se trata de una longitud, no del área del círculo.':'És una longitud, no l’àrea del cercle.',
'El resultado se expresa en unidades cuadradas.':'El resultat s’expressa en unitats quadrades.',
'Divide por dos porque es la mitad de un paralelogramo equivalente.':'Divideix per dos perquè és la meitat d’un paral·lelogram equivalent.',
'Conserva centímetros cuadrados.':'Conserva els centímetres quadrats.',
'No confundas área πr² con longitud 2πr.':'No confonguis l’àrea πr² amb la longitud 2πr.',
'Resta el hueco que está completamente dentro de la placa.':'Resta el buit que queda completament dins de la placa.',
'Suma solo porque no hay superficies superpuestas.':'Suma només perquè no hi ha superfícies superposades.'
}
def prose_formula(s):
 # Keep all mathematical tokens unchanged, including numeric and operator order.
 pairs=[
 ('Comprueba los dos lados menores sumados frente al mayor','Comprova la suma dels dos costats menors comparant-la amb el més llarg'),
 ('Cuatro lados iguales y cuatro ángulos rectos definen un cuadrado','Quatre costats iguals i quatre angles rectes defineixen un quadrat'),
 ('Compara los tres lados','Compara els tres costats'),
 ('se compara con','es compara amb'),
 ('Agudo','Agut'),('Obtuso','Obtús'),('Equilátero','Equilàter')
 ]
 for src,dst in pairs:s=s.replace(src,dst)
 return s
def explain(source,hint):
 start='Procedimiento: '
 assert source.startswith(start)
 pre,sep,tail=source.partition('. '+hint+' ')
 assert sep,(hint,source)
 formula=prose_formula(pre[len(start):])
 reason,sep,rest=tail.partition(' Resultado correcto: ')
 assert sep and reason in R1,(reason,source)
 result,sep,more=rest.partition('. Verifica unidades y condiciones geométricas antes de avanzar.')
 assert sep and not more,rest
 result={'Agudo':'Agut','Obtuso':'Obtús','Equilátero':'Equilàter','Cuadrado':'Quadrat',
         'Sí':'Sí','No':'No'}.get(result,result)
 return 'Procediment: '+formula+'. '+H[hint]+' '+R1[reason]+' Resultat correcte: '+result+'. Comprova les unitats i les condicions geomètriques abans de continuar.'
bank=json.loads((R/'site/data/f3_e1_g01_exercises.json').read_text(encoding='utf8'))['activities']
assert len(bank)==len(P)==30 and len(H)==len(R1)==18
texts=[]
for a,prompt in zip(bank,P):
 assert a['hint'] in H,a['hint']
 texts.append({'prompt':prompt,'hint':H[a['hint']],'explanation':explain(a['explanation'],a['hint'])})
add_activities('E1-G01',texts)
