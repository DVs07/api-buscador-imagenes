const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginadorDiv = document.querySelector('#paginacion');
let elemento;
const registrosPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);   
}
function validarFormulario(event){
    event.preventDefault();

    const busqueda = document.querySelector('#termino').value;

    if(busqueda === ''){
        mostrarAlerta('No se ingresaron datos de busqueda.');
        return;
    }

    buscarImagenes();

}
function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');
    if(!existeAlerta){
        const alerta = document.createElement('DIV');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','border');

        alerta.innerHTML = `
            <strong class="font-bold"> ERROR! </strong>
            <span class="block sm:inline">${mensaje}</span>
            `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);  
    }
    
}

function buscarImagenes(){
    
    const busqueda = document.querySelector('#termino').value;

    const key = '2816069-4182c25b2660eba3ff921e3c7';
    const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // console.log(url);

    fetch(url)
        .then(respuesta => respuesta.json())
    .then(resultado => {
        totalPaginas = paginador(resultado.totalHits);
        console.log('Cantidad de indices del paginador: ' + totalPaginas);
        console.log('Total de imagenes: ' + resultado.totalHits);
        console.log('Cantidad de imagenes por pagina: ' + resultado.hits.length);
        
        mostrarImagenes(resultado.hits)
    });
    
}

function mostrarImagenes(imagenes){
    // console.log(imagenes);

    limpiarHTML( resultado);

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-full md:w-1/3 lg:w-1/4 p-3 mb-4"> 
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class="p-4 flex flex-col">
                    <div class="flex justify-between mb-3">
                        <p class="font-bold flex row"> ${likes} <span class="ml-2"><svg class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/></svg>
                        </span> </p>
                        <p class="font-bold flex row"> ${views} <span class="ml-2"> 
                        <svg class="w-6 h-6 text-gray-600 dark:text-white font-light" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                        <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg></span> 
                        </p> 
                    </div>
                    
                    <a class="block w-full bg-blue-600 mt-5 p-2 text-white uppercase font-bold text-center rounded-lg" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
            </div>
        </div>
        `;

        limpiarHTML(paginadorDiv);
        mostrarPaginador();

    });
}

function paginador(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function *crearPaginador(total){
    for (let i = 1; i <= total; i++ ) {
        yield i;
        
    }
}

function mostrarPaginador(){
    iterador = crearPaginador(totalPaginas);

    // console.log(iterador.next().done);
    
    // console.log(iterador.next());

    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        const botonPaginador = document.createElement('a');
        botonPaginador.href = '#';
        botonPaginador.dataset.pagina = value;
        botonPaginador.textContent = value;
        botonPaginador.classList.add('siguiente', 'bg-blue-600', 'px-4', 'py-1', 'mr-2', 'mb-4', 'rounded');

        botonPaginador.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginadorDiv.appendChild(botonPaginador);
    }
}
function limpiarHTML(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}