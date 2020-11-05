function agregar(id){
    let input = document.getElementById(id).value;
    if(input === ""){
        alert("Ingrese una tarea");
        return false;
    }else{
        let li = document.createElement("li");
        let t = document.createTextNode(input);
        let cb = document.createElement("input");
        let i = document.createElement("i");
        
        i.setAttribute("class","fa fa-trash eliminar");
        i.setAttribute("aria-hidden","true");
        
        li.appendChild(i);

        cb.setAttribute("type", "checkbox");
        cb.setAttribute("class","finalizar");
        
        li.appendChild(cb);
        li.appendChild(t);
        
        document.getElementById("tasks").appendChild(li);
        document.getElementById(id).value = "";
        finalizar();
        eliminar();
    }
}

function eliminar(){
    let eliminar = document.getElementsByClassName("eliminar");
    let i = 0;
    for(i=0; i<eliminar.length ; i++){
        eliminar[i].onclick = function(){
            let li = this.parentElement;
            li.style.display = "none";
        }
    }
}

function finalizar(){
    let finalizar = document.getElementsByClassName("finalizar");
    let i = 0;
    for(i=0; i<finalizar.length ; i++){
        finalizar[i].onclick = function(){
            let li = this.parentElement;
            if(li.style.textDecoration == "line-through"){
                li.style.textDecoration = "none";
            }else{
                li.style.textDecoration = "line-through";
            }
        }
    }
}