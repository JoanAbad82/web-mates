import json,re
from i18n_author_activity_common import R,add_activities
H={
'Multiplica la base por sí misma tantas veces como indica el exponente.':'Multiplica la base per si mateixa tantes vegades com indica l’exponent.',
'Para multiplicar potencias de igual base se suman exponentes.':'Per multiplicar potències de la mateixa base, sumem els exponents.',
'Con base no nula, resta el segundo exponente al primero.':'Amb una base no nul·la, resta el segon exponent del primer.',
'Multiplica los exponentes, sin sumarlos.':'Multiplica els exponents, sense sumar-los.',
'Encuentra el número no negativo cuyo cuadrado es el radicando.':'Troba el nombre no negatiu el quadrat del qual és el radicand.',
'Busca dos cuadrados perfectos consecutivos que encierren el radicando.':'Busca dos quadrats perfectes consecutius entre els quals es trobi el radicand.',
'Busca el denominador común y opera los numeradores con signos.':'Busca el denominador comú i opera els numeradors tenint en compte els signes.',
'Multiplica los numeradores y los denominadores.':'Multiplica els numeradors i els denominadors.',
'Lleva ambas fracciones a un mismo denominador positivo.':'Expressa totes dues fraccions amb un mateix denominador positiu.',
'Resuelve la potencia antes de sumar el racional.':'Calcula la potència abans de sumar el racional.'
}
R1={
'Si la base es negativa, el signo depende de la paridad del exponente.':'Si la base és negativa, el signe depèn de la paritat de l’exponent.',
'La base permanece inalterada y el signo se determina al final.':'La base es manté inalterada i el signe es determina al final.',
'Comprueba el cociente mediante la operación inversa.':'Comprova el quocient mitjançant l’operació inversa.',
'Aplica la regla de signos al exponente total.':'Aplica la regla dels signes a l’exponent total.',
'No escribas las dos soluciones de la ecuación cuadrática.':'No escriguis les dues solucions de l’equació quadràtica.',
'No reemplaces la raíz irracional por una igualdad decimal aproximada.':'No substitueixis l’arrel irracional per una igualtat decimal aproximada.',
'Simplifica la fracción resultante, sin redondear.':'Simplifica la fracció resultant sense arrodonir.',
'Simplifica factores comunes antes o después del producto.':'Simplifica els factors comuns abans o després del producte.',
'Compara los numeradores con el signo correcto.':'Compara els numeradors amb el signe correcte.',
'Mantén la fracción exacta y usa denominador común si hace falta.':'Mantén la fracció exacta i fes servir un denominador comú si cal.'
}
def prompt(s):
 suffix=' Selecciona el valor exacto correcto.'
 ends=s.endswith(suffix)
 core=s[:-len(suffix)] if ends else s
 if core.startswith('Calcula '):
  out='Calcula el valor de '+core[len('Calcula '):]
 elif core.startswith('¿Cuál es la raíz cuadrada principal de '):
  out='Quina és l’arrel quadrada principal de '+core[len('¿Cuál es la raíz cuadrada principal de '):]
 elif core.startswith('¿Qué entero positivo es el suelo de '):
  out=core.replace('¿Qué entero positivo es el suelo de ','Quin enter positiu és la part entera de ').replace(', es decir, el mayor entero k con ', ', és a dir, l’enter més gran k amb ')
 elif core.startswith('Compara '):
  out=core.replace(' y ',' i ',1).replace('; elige ','; tria ',1).replace(' o >',' o >')
 else:raise AssertionError(('Unknown prompt template',s))
 if ends:out+=' Tria el valor exacte correcte.'
 return out
def explanation(s,h):
 assert s.startswith('Método: '+h+' '),s
 text=s[len('Método: '+h+' '):]
 common='. Compara el procedimiento con la teoría de esta lección, no solamente con el resultado.'
 assert text.endswith(common)
 text=text[:-len(common)]
 kind='Respuesta exacta: '
 reason,sep,result=text.partition('. '+kind)
 if not sep:
  kind='Categoría correcta: '
  reason,sep,result=text.partition('. '+kind)
 assert sep and reason+'.' in R1,(reason,s)
 kind_ca='Resposta exacta: ' if kind=='Respuesta exacta: ' else 'Categoria correcta: '
 return ('Mètode: '+H[h]+' '+R1[reason+'.']+' '+kind_ca+result+
         '. Compara el procediment amb la teoria d’aquesta lliçó, no només amb el resultat.')
bank=json.loads((R/'site/data/f3_e2_n01_exercises.json').read_text(encoding='utf8'))['activities']
items=[]
for x in bank:
 assert x['hint'] in H
 items.append({'prompt':prompt(x['prompt']),'hint':H[x['hint']],
               'explanation':explanation(x['explanation'],x['hint'])})
assert len(bank)==len(items)==30
add_activities('E2-N01',items)
