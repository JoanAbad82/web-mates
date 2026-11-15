// F3-26: representación declarativa sin JavaScript evaluado ni llamadas remotas.
// Mantiene renderer probado de F3-25; adopta solo formato y etiquetas del nuevo grupo.
import {renderWave25InferenceVisual} from './f3_wave25_inference.js';
export function renderWave26InferenceVisual(spec,alt){
 if(!spec||spec.render_family!=='wave26'||!Array.isArray(spec.rows)||!spec.model)return null;
 const copy={...spec,render_family:'wave25'};
 const figure=renderWave25InferenceVisual(copy,alt);
 if(figure){
  figure.classList.add('f3-wave26-inference');
  figure.setAttribute('data-wave','26');
 }
 return figure;
}
