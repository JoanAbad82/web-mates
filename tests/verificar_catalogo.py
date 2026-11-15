"""Portable structure checks for WEB MATES staged source. No internet or user data."""
from pathlib import Path
from collections import Counter
import json
R=Path(__file__).resolve().parent.parent;W=R/"site";D=W/"data"
assert (W/"index.html").is_file() and (W/"assets/app.js").is_file()
cat=json.loads((D/"catalogo.json").read_text(encoding="utf8"))
courses=cat["courses"];units=[u for c in courses for u in c["units"]]
lessons=[l for u in units for l in u["lessons"]]
assert (len(courses),len(units),len(lessons))==(9,85,505)
ids=[l["lesson_id"] for l in lessons]
assert len(set(ids))==len(ids)
unitids={u["unit_id"] for u in units}
total=0
for p in D.glob("*.json"):
 json.loads(p.read_text(encoding="utf8"))
for u in units:
 id=u["unit_id"]
 stem="f1_e3_a02" if id=="E3-A02" else "f3_"+id.lower().replace("-","_")
 meta=json.loads((D/(stem+".json")).read_text(encoding="utf8"))
 bank=json.loads((D/(stem+"_exercises.json")).read_text(encoding="utf8"))
 assert meta["unit_id"]==bank["unit_id"]==id
 unitlesson={l["lesson_id"] for l in meta["lesson_documents"]}
 assert unitlesson=={l["lesson_id"] for l in u["lessons"]}
 items=bank["activities"]
 assert len(items)==len(unitlesson)*5
 assert all(x["lesson_id"] in unitlesson for x in items)
 total+=len(items)
assert total==2525
assert "Proyecto y desarrollo web: Joan" in (W/"index.html").read_text(encoding="utf8")
print("PASS source integrity 9 itineraries, 85 units, 505 lessons, 2525 draft exercises, Joan credit")
print("NOTE: This test validates structure only. It does NOT validate mathematics, rights or educational approval.")
