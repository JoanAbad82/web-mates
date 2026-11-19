#!/usr/bin/env python3
"""Explicit Catalan translations for E1-N03/04/05 activity patterns; never edit canonical data."""
from pathlib import Path
import json,re
from i18n_math_guard import math_guard
R=Path(__file__).resolve().parents[1]
H={
# N03
'Un múltiplo se obtiene multiplicando por un natural.':'Un múltiple s’obté multiplicant per un nombre natural.',
'Cuenta divisores positivos exactos, sin repetirlos.':'Compta els divisors positius exactes sense repetir-los.',
'Comprueba si la división tiene resto cero.':'Comprova si el residu de la divisió és zero.',
'Busca el mayor múltiplo del divisor no superior al dividendo.':'Busca el múltiple més gran del divisor que no superi el dividend.',
'Busca divisores positivos distintos de uno y del propio número.':'Busca divisors positius diferents de l’u i del mateix nombre.',
'Divide sucesivamente por el primo indicado.':'Divideix successivament pel nombre primer indicat.',
'Descompón en producto de primos.':'Descompon en un producte de nombres primers.',
'Busca factores primos comunes con los exponentes menores.':'Busca els factors primers comuns amb els exponents menors.',
'Toma los factores primos con sus mayores exponentes.':'Pren els factors primers amb els exponents més grans.',
# N04
'Interpreta numerador entre denominador, no como dos números aislados.':'Interpreta el numerador dividit pel denominador, no com dos nombres separats.',
'Primero identifica el total de referencia y qué fracción se utiliza.':'Identifica primer el total de referència i la fracció que s’utilitza.',
'La fracción equivalente debe conservar su valor numérico.':'La fracció equivalent ha de conservar el mateix valor numèric.',
'Ambos términos cambian por el mismo factor positivo.':'Tots dos termes canvien pel mateix factor positiu.',
'Busca un divisor común y simplifica sin alterar la razón.':'Busca un divisor comú i simplifica sense canviar la raó.',
'Ambas fracciones se comparan usando la misma unidad.':'Compara totes dues fraccions fent servir la mateixa unitat.',
'Identifica si necesitas denominador común o inverso del divisor.':'Identifica si necessites un denominador comú o l’invers del divisor.',
'Distingue cantidad utilizada de cantidad que aún queda.':'Distingeix la quantitat utilitzada de la que encara queda.',
# N05
'Cada unidad tiene cien centésimas.':'Cada unitat conté cent centèsimes.',
'Estima primero la magnitud esperada del resultado.':'Estima primer l’ordre de magnitud esperat del resultat.',
'Reduce la fracción antes de mirar el denominador.':'Redueix la fracció abans d’examinar el denominador.',
'Por ciento significa dividir entre cien.':'Per cent vol dir dividir per cent.',
'Determina la base sobre la que se aplica el porcentaje.':'Determina la base a la qual s’aplica el percentatge.',
'Distingue descuento o aumento del precio final.':'Distingeix el descompte o l’augment del preu final.'
}
R1={
# N03
'Escribe un producto y comprueba.':'Escriu un producte i comprova’l.',
'Busca parejas cuyo producto dé el número.':'Busca parelles de factors amb aquest producte.',
'También puedes intentar expresar el número como producto.':'També pots intentar expressar el nombre com un producte.',
'El resto debe ser menor que el divisor.':'El residu ha de ser inferior al divisor.',
'Recuerda que uno es un caso especial.':'Recorda que l’u és un cas especial.',
'Cuenta los exponentes sin confundirlos con el producto.':'Compta els exponents sense confondre’ls amb el producte.',
'Suma los exponentes de sus factores primos.':'Suma els exponents dels factors primers.',
'El resultado debe dividir a ambos números.':'El resultat ha de dividir tots dos nombres.',
'Debe ser múltiplo de ambos y el menor positivo.':'Ha de ser múltiple de tots dos i el positiu més petit.',
# N04
'Divide las partes tomadas entre las partes de una unidad.':'Divideix les parts preses entre el nombre de parts de la unitat.',
'Multiplica el total por el numerador y divide por el denominador.':'Multiplica el total pel numerador i divideix pel denominador.',
'Calcula el factor de ampliación de denominadores y aplícalo al numerador.':'Calcula el factor d’ampliació dels denominadors i aplica’l al numerador.',
'Compara el numerador original y el nuevo, y amplía el denominador.':'Compara el numerador original amb el nou i amplia el denominador.',
'Divide numerador y denominador por su máximo común divisor.':'Divideix numerador i denominador pel seu màxim comú divisor.',
'Multiplica en cruz con denominadores positivos antes de elegir el signo.':'Multiplica en creu amb denominadors positius abans de triar el signe.',
'Suma/resta con denominador común; producto directo; cociente con inverso.':'Suma o resta amb denominador comú; multiplica directament; divideix emprant l’invers.',
'Calcula la parte usada y réstala al total original.':'Calcula la part utilitzada i resta-la del total original.',
# N05
'Multiplica el número decimal por cien.':'Multiplica el nombre decimal per cent.',
'Respeta valores posicionales y alinea decimales si sumas o restas.':'Respecta els valors posicionals i alinea els decimals si sumes o restes.',
'Solo los factores 2 y 5 en el denominador reducido permiten un decimal exacto.':'Només els factors 2 i 5 en el denominador reduït permeten un decimal exacte.',
'Divide el porcentaje entre cien, no lo uses como número entero.':'Divideix el percentatge per cent; no l’utilitzis com a nombre enter.',
'Multiplica el total por porcentaje/100.':'Multiplica el total per percentatge/100.',
'Multiplica por 1+p/100 si sube o por 1−p/100 si baja.':'Multiplica per 1+p/100 si puja o per 1−p/100 si baixa.'
}
assert len(H)==23,(len(H),len(R1))
assert len(R1)==23
def pattern(full,source,output):
 m=re.fullmatch(source,full)
 return output(*m.groups()) if m else None
def prompt(s,unit):
 suffixes=(' Selecciona la respuesta numérica correcta.',' Selecciona el valor correcto.')
 suffix=''
 for k in suffixes:
  if s.endswith(k):
   suffix=' Selecciona la resposta numèrica correcta.' if 'numérica' in k else ' Selecciona el valor correcte.'
   s=s[:-len(k)]
   break
 if unit=='E1-N03':
  patterns=[
   (r'¿Cuál es el múltiplo de (\d+) obtenido al multiplicarlo por (\d+)\?',lambda a,b:f'Quin és el múltiple de {a} que s’obté multiplicant-lo per {b}?'),
   (r'¿Cuántos divisores positivos tiene (\d+)\?',lambda a:f'Quants divisors positius té {a}?'),
   (r'¿Es (\d+) divisor exacto de (\d+)\?',lambda a,b:f'És {a} divisor exacte de {b}?'),
   (r'¿Qué resto deja (\d+) al dividirlo por (\d+)\?',lambda a,b:f'Quin residu deixa {a} en dividir-lo per {b}?'),
   (r'Clasifica (\d+): primo, compuesto o ni primo ni compuesto\.',lambda a:f'Classifica {a}: primer, compost o ni primer ni compost.'),
   (r'En la factorización prima de (\d+), ¿cuántas veces aparece el factor (\d+)\?',lambda a,b:f'A la factorització primera de {a}, quantes vegades apareix el factor {b}?'),
   (r'¿Cuántos factores primos tiene (\d+) contando repeticiones\?',lambda a:f'Quants factors primers té {a} comptant les repeticions?'),
   (r'Calcula el máximo común divisor de (\d+) y (\d+)\.',lambda a,b:f'Calcula el màxim comú divisor de {a} i {b}.'),
   (r'Calcula el mínimo común múltiplo positivo de (\d+) y (\d+)\.',lambda a,b:f'Calcula el mínim comú múltiple positiu de {a} i {b}.')]
 elif unit=='E1-N04':
  patterns=[
   (r'Calcula como número la fracción ([\d/]+)\.?',lambda a:f'Calcula el valor numèric de la fracció {a}.'),
   (r'¿Cuánto es ([\d/]+) de (\d+) lápices\? Da el número\.',lambda a,b:f'Quant és {a} de {b} llapis? Indica el nombre.'),
   (r'¿Cuánto es ([\d/]+) de (\d+) kilómetros\? Da el número\.?',lambda a,b:f'Quant és {a} de {b} quilòmetres? Indica el nombre.'),
   (r'¿Cuánto es ([\d/]+) de (\d+) litros\? Da el número',lambda a,b:f'Quant és {a} de {b} litres? Indica el nombre.'),
   (r'Completa ([\d/?= ]+)\. Escribe el numerador que falta\.?',lambda a:f'Completa {a}. Escriu el numerador que falta.'),
   (r'Completa ([\d/?= ]+)\. ¿Qué denominador falta\?',lambda a:f'Completa {a}. Quin denominador falta?'),
   (r'Simplifica ([\d/]+) hasta irreducible\. ¿Cuál es el numerador final\?',lambda a:f'Simplifica {a} fins a obtenir una fracció irreductible. Quin és el numerador final?'),
   (r'Entre ([\d/]+) y ([\d/]+), ¿qué símbolo corresponde en ese orden\?',lambda a,b:f'Entre {a} i {b}, quin símbol correspon en aquest ordre?'),
   (r'Calcula (.+)\. Responde con el resultado numérico\.?',lambda a:f'Calcula {a}. Respon amb el resultat numèric.'),
   (r'De (\d+) kilómetros, se usa ([\d/]+)\. ¿Cuántas quedan\?',lambda a,b:f'De {a} quilòmetres, se’n fa servir {b}. Quants en queden?'),
   (r'De (\d+) entradas, se usa ([\d/]+)\. ¿Cuántas quedan\?',lambda a,b:f'De {a} entrades, se’n fa servir {b}. Quantes en queden?')]
 elif unit=='E1-N05':
  match=re.fullmatch(r'Calcula como número la fracción ([\d/]+)\.',s)
  if match:return f'Calcula el valor numèric de la fracció {match[1]}.'+suffix
  patterns=[
   (r'Convierte ([\d,]+) unidades a centésimas: ¿cuántas centésimas representa\?',lambda a:f'Converteix {a} unitats en centèsimes: quantes centèsimes representa?'),
   (r'Entre ([\d/]+) y ([\d/]+), ¿qué símbolo corresponde en ese orden\?',lambda a,b:f'Entre {a} i {b}, quin símbol correspon en aquest ordre?'),
   (r'Calcula (.+)\.?',lambda a:f'Calcula el resultat de {a.rstrip(".")}.'),
   (r'Calcula como número la fracción ([\d/]+)\.',lambda a:f'Calcula el valor numèric de la fracció {a}.'),
   (r'La fracción ([\d/]+) da un decimal exacto o periódico\?',lambda a:f'La fracció {a} dona un decimal exacte o periòdic?'),
   (r'Convierte ([\d,]+) % a número decimal\.?',lambda a:f'Converteix {a} % en nombre decimal.'),
   (r'¿Cuánto es el ([\d]+) % de ([\d]+) (euros|personas|libros|unidades)\?',lambda a,b,c:f'Quant és el {a} % de {b} '+{'euros':'euros','personas':'persones','libros':'llibres','unidades':'unitats'}[c]+'?'),
   (r'Un artículo cuesta ([\d]+) €\. Tras una (descuento|subida) del ([\d]+) %, ¿cuál es el precio final en euros\?',lambda a,b,c:f'Un article costa {a} €. Després d’un '+('descompte' if b=='descuento' else 'augment')+f' del {c} %, quin és el preu final en euros?')]
 else:raise ValueError(unit)
 for expression,transform in patterns:
  result=pattern(s,expression,transform)
  if result is not None:
   assert result!=s,(unit,s)
   return result+suffix
 raise AssertionError(('Unmatched activity prompt',unit,s))
def explanation(src,unit,original_hint):
 if unit=='E1-N03':
  assert src.startswith('Método: '+original_hint+' '),src
  raw=src[len('Método: '+original_hint+' '):]
  reason,sep,tail=raw.partition(' Datos utilizados: ')
  assert sep and reason in R1,(unit,reason)
  m=re.fullmatch(r'(.+)\. Resultado: (.+)\. Verifica el cálculo y la unidad del enunciado\.',tail)
  assert m,(unit,tail)
  return 'Mètode: '+H[original_hint]+' '+R1[reason]+' Dades utilitzades: '+m[1]+'. Resultat: '+m[2]+'. Comprova el càlcul i la unitat de l’enunciat.'
 assert src.startswith('Comprobación: '),src
 stem,sep,tail=src[len('Comprobación: '):].partition(' Con los datos del enunciado, el resultado es ')
 assert sep and stem in R1,(unit,stem)
 m=re.fullmatch(r'(.+)\. Revisa que unidades, base y operación correspondan a la pregunta\.',tail)
 assert m,(unit,tail)
 answer=m[1]
 if answer=='Periódico':answer='Periòdic'
 if answer=='Exacto':answer='Exacte'
 return 'Comprovació: '+R1[stem]+' Amb les dades de l’enunciat, el resultat és '+answer+'. Revisa que les unitats, la base i l’operació corresponguin a la pregunta.'
def main():
 for uid in ('E1-N03','E1-N04','E1-N05'):
  suffix='f3_'+uid.lower().replace('-','_')
  bank=json.loads((R/'site/data'/(suffix+'_exercises.json')).read_text(encoding='utf8'))
  path=R/'site/i18n/ca-ES'/(uid+'.v1.json')
  pack=json.loads(path.read_text(encoding='utf8'))
  assert len(pack['lessons'])==6
  if len(pack['activities'])==30:
   fixes=0
   for a in bank['activities']:
    key=a['exercise_id']
    wanted={'prompt':prompt(a['prompt'],uid),
      'hint':H[a['hint']],
      'explanation':explanation(a['explanation'],uid,a['hint'])}
    present=pack['activities'][key]
    if present==wanted:continue
    assert uid=='E1-N05' and key.startswith('F3-E1-N05-L03-') and \
      present['prompt'].startswith('Calcula el resultat de como número la fracción ') and \
      present['hint']==wanted['hint'] and present['explanation']==wanted['explanation'],(uid,key)
    present['prompt']=wanted['prompt']
    fixes+=1
   if fixes:
    assert fixes==3
    path.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
   print('VALIDATED_OR_FIXED_EXISTING',uid,'fixes',fixes)
   continue
  assert pack['activities']=={}
  for a in bank['activities']:
   key=a['exercise_id']
   source_hint=a['hint']
   assert source_hint in H,(uid,source_hint)
   d={'prompt':prompt(a['prompt'],uid),
      'hint':H[source_hint],
      'explanation':explanation(a['explanation'],uid,source_hint)}
   for k,val in d.items():math_guard(a[k],val,key+':'+k)
   pack['activities'][key]=d
  assert len(pack['activities'])==30,uid
  path.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
  print('COMPLETE_ACTIVITY_DRAFTS',uid,len(pack['activities']))
if __name__=='__main__':main()
