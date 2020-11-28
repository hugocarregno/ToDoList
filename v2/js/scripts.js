let tareas = [];
let geolocalizacion = {
    latitud : null,
    longitud : null
}

window.onload = function(){
    
    tareas = getTareasStorage();

    tareas.map((tarea) => {
        agregar(tarea);
    });

    getGeolocalizacion();
    document.getElementById("input").focus();
}

//FullScreen inicio

let $ = document.querySelector.bind(document);
let $$ = function (selector) {
    return [].slice.call(document.querySelectorAll(selector), 0);
}


let prefix = null;
if ('requestFullscreen' in document.documentElement) {
    prefix = 'fullscreen';
} else if ('mozRequestFullScreen' in document.documentElement) {
    prefix = 'mozFullScreen';
} else if ('webkitRequestFullscreen' in document.documentElement) {
    prefix = 'webkitFullscreen';
} else if ('msRequestFullscreen') {
    prefix = 'msFullscreen';
}

let onFullscreenChange = function () {
    let elementName = 'not set';
    if (document[prefix + 'Element']) {
        elementName = document[prefix + 'Element'].nodeName;
    }
    //console.log('New fullscreen element is ' + elementName + '');
    onFullscreenHandler(!!document[prefix + 'Element']);
    }

if (document[prefix + 'Enabled']) {
    var onFullscreenHandler = function (started) {
    $('#exit').style.display = started ? 'inline-block' : 'none';
    $$('.fullscreen').forEach(function (x) {
        x.style.display = started ? 'none' : 'inline-block';
    });
    };

    document.addEventListener(prefix.toLowerCase() + 'change', onFullscreenChange);

    let goFullScreen = null;
    let exitFullScreen = null;
    if ('requestFullscreen' in document.documentElement) {
        goFullScreen = 'requestFullscreen';
        exitFullScreen = 'exitFullscreen';
    } else if ('mozRequestFullScreen' in document.documentElement) {
      goFullScreen = 'mozRequestFullScreen';
      exitFullScreen = 'mozCancelFullScreen';
    } else if ('webkitRequestFullscreen' in document.documentElement) {
      goFullScreen = 'webkitRequestFullscreen';
      exitFullScreen = 'webkitExitFullscreen';
    } else if ('msRequestFullscreen') {
      goFullScreen = 'msRequestFullscreen';
      exitFullScreen = 'msExitFullscreen';
    }
    let goFullscreenHandler = function (element) {
      return function () {
        let maybePromise = element[goFullScreen]();
            if (maybePromise && maybePromise.catch) {
              maybePromise.catch(function (err) {
                //console.log('Cannot acquire fullscreen mode: ' + err);
              });
            }
      };
    };
    
    $('#startFull').addEventListener('click', goFullscreenHandler(document.documentElement));

    $('#exit').addEventListener('click', function () {
        document[exitFullScreen]();
      });
    }
//FullScreen fin

function getGeolocalizacion(){
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                geolocalizacion.latitud = location.coords.latitude;
                geolocalizacion.longitud = location.coords.longitude;
            },
            (err) => {
                console.warn(err);
                geolocalizacion.latitud = null;
                geolocalizacion.longitud = null;
            }
        );
    } else {
        return null;
    }
}    
    
function setTareasStorage(){
    if ('localStorage' in window || 'sessionStorage' in window) {
        sessionStorage.setItem("tareas",JSON.stringify(tareas))
        //localStorage.setItem("tareas",JSON.stringify(tareas))
    }else {
        alert("SessionStorage no es soportado!");
    }
}

function getTareasStorage() {
    if ('localStorage' in window || 'sessionStorage' in window) {
        return JSON.parse(sessionStorage.getItem("tareas")) || [];
        //return JSON.parse(localStorage.getItem("tareas") || []);
    } else {
        return []
    }
}

function compartirTexto(){
    let compartir = document.querySelectorAll('.compartir');
    let i = 0;
    for(i=0; i<compartir.length ; i++){
        compartir[i].onclick = function(){
        let li = this.parentElement.parentElement;

        let tarea = tareas.filter(t => t.id == li.getAttribute('data-tarea-id'))[0];

        if (!("share" in navigator)) {
            alert('Web Share API no es soportada.');
            return;
        }
        navigator.share({
            title: 'Tarea',
            text: `${tarea.done ? 'Terminada' : 'Pendiente'}: ${tarea.name} (#${tarea.id})`,
            url: ''
        }).then(() => console.log('ok!'))
        .catch(error => console.log('Error:', error));
        }
    }
}

function copiarTexto(){
    let portapapel = document.querySelectorAll('.portapapel');
    let i = 0;
    for(i=0; i<portapapel.length ; i++){
        portapapel[i].onclick = function(){
            let li = this.parentElement.parentElement;
            navigator.clipboard.writeText(li.textContent)
            .then(() => console.log('Async writeText successful, "' + li.textContent + '" written'))
            .catch(err => console.log('Async writeText failed with error: "' + err + '"'));
            document.getElementById("input").focus();
        }
    }
}      

function agregar(nueva){
    let tarea = document.getElementById(nueva);
    let id = new Date().getTime();
    if(typeof nueva === 'string'){
        const nuevaTarea = {
            id,
            name: tarea.value,
            done: false,
            geolocalizacion
        }
        tareas.push(nuevaTarea); 
        setTareasStorage();
    }
    let li = document.createElement("li");
    li.setAttribute("data-tarea-id", typeof nueva === 'string' ? id : nueva.id);
    let t = document.createTextNode(typeof nueva === 'string' ? tarea.value : nueva.name);
    let p = document.createElement("p");
    p.appendChild(t);
    let cb = document.createElement("input");
    const SVG_NS = 'http://www.w3.org/2000/svg';
    

    cb.setAttribute("type", "checkbox");
    cb.setAttribute("class","finalizar");
    cb.setAttribute("value","");
    if(typeof nueva === 'object'){
        if(nueva.done){
            cb.setAttribute("checked",true);
            li.setAttribute('style','text-decoration: line-through');
        }    
    }   
    let div = document.createElement("div");
    
    div.appendChild(cb);
    //li.appendChild(t);
    div.appendChild(p);
    li.appendChild(div);

    let div2 = document.createElement("div");
    div2.setAttribute("class","botones");
    let clipboard = document.createElementNS(SVG_NS, 'svg');

    clipboard.setAttributeNS(null,"class","portapapel");
    clipboard.setAttributeNS(null,"viewBox","0 0 24 24");
    let path = document.createElementNS(SVG_NS, "path");
    path.setAttributeNS(null,"fill","currentColor");

    path.setAttributeNS(null,"d","M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z");
    clipboard.appendChild(path);
    div2.appendChild(clipboard);

    let share = document.createElementNS(SVG_NS, 'svg');

    share.setAttributeNS(null,"class","compartir");
    share.setAttributeNS(null,"viewBox","0 0 24 24");
    let path2 = document.createElementNS(SVG_NS, "path");
    path2.setAttributeNS(null,"fill","currentColor");

    path2.setAttributeNS(null,"d","M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z");
    share.appendChild(path2);
    div2.appendChild(share);

    let trash = document.createElementNS(SVG_NS, 'svg');

    trash.setAttributeNS(null,"class","eliminar");
    trash.setAttributeNS(null,"viewBox","0 0 24 24");
    let path3 = document.createElementNS(SVG_NS, "path");
    path3.setAttributeNS(null,"fill","currentColor");
    path3.setAttributeNS(null,"d","M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z");
        
    trash.appendChild(path3);
    div2.appendChild(trash);
    li.appendChild(div2);

    document.getElementById("tasks").appendChild(li);
    
    document.getElementById("input").value = "";
    finalizar();
    eliminar();
    copiarTexto();
    compartirTexto();
    document.getElementById("input").focus();

}

function eliminar(){
    let eliminar = document.getElementsByClassName("eliminar");
    let i = 0;
    for(i=0; i<eliminar.length ; i++){
        eliminar[i].onclick = function(){
            let li = (this.parentElement).parentElement;
            
            document.querySelector(`[data-tarea-id="${li.getAttribute('data-tarea-id')}"]`).remove();
            tareas = tareas.filter(t => t.id != li.getAttribute('data-tarea-id'));
            setTareasStorage();
            document.getElementById("input").focus();
            //li.style.display = "none"; 
        }
    }
}

function finalizar(){
    let finalizar = document.getElementsByClassName("finalizar");
    let i = 0;
    for(i=0; i<finalizar.length ; i++){
        finalizar[i].onclick = function(){
            let li = (this.parentElement).parentElement;

            if(li.style.textDecoration == "line-through"){
                li.style.textDecoration = "none";
                tareas[tareas.findIndex(t => t.id == li.getAttribute('data-tarea-id'))].done = false; 
            }else{
                li.style.textDecoration = "line-through";
                tareas[tareas.findIndex(t => t.id == li.getAttribute('data-tarea-id'))].done = true; 
            }
            
            setTareasStorage()
            document.getElementById("input").focus();
        }
    }
}