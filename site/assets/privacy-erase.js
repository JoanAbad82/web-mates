'use strict';
// Solo datos v1 propios en este origen; jamás borrar el almacenamiento completo.
// Un borrado confirmado reinicia la pestaña para invalidar estados F2/F3 en memoria.
(() => {
  const button=document.getElementById('clear-webmates-local');
  const status=document.getElementById('clear-webmates-status');
  const ownKey=/^webmates:f2:[A-Za-z0-9_-]{3,90}:(?:consent|state):v1$/;
  if(!button||!status)return;
  const keys=(store)=>{
    const result=[];
    for(let i=0;i<store.length;i++){
      const key=store.key(i);
      if(typeof key==='string'&&ownKey.test(key))result.push(key);
    }
    return result;
  };
  button.addEventListener('click',()=>{
    if(!window.confirm('Se eliminarán los datos antiguos de repaso v1 de WEB MATES de este perfil de navegador. Esta variante no crea datos nuevos. La acción no puede deshacerse. ¿Continuar?'))return;
    try{
      const store=window.localStorage;
      for(const key of keys(store))store.removeItem(key);
      if(keys(store).length){
        status.textContent='No se ha confirmado el borrado completo. Comprueba los datos del navegador.';
        return;
      }
      status.textContent='Datos de repaso antiguos de WEB MATES borrados. Se reiniciará esta pestaña.';
      // Los motores previamente instanciados pueden guardar de nuevo si siguen activos.
      // Recargar descarta su estado, no afecta datos de otras aplicaciones del origen.
      window.location.reload();
    }catch(_){
      status.textContent='No se ha podido confirmar el borrado. Borra los datos del sitio en el navegador.';
    }
  });
})();
