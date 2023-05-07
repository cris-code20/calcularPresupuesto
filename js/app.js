// 

const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')
const contenedor = document.querySelector('.contenido-principal')



// funcion listener
eventListener();
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    document.addEventListener('submit', agregarGastos)
}

// clases
class Presupuesto{
    constructor (presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []

    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.restarPresupuesto();
    }

    restarPresupuesto(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos =this.gastos.filter(gasto => gasto.id !== id)
        this.restarPresupuesto()
    }
}

class UI{
    mostrarCantidad(cantidad){
        const {presupuesto, restante} = cantidad
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('alert', 'text-center')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }


        divMensaje.textContent = mensaje

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        setTimeout(()=>{
            divMensaje.remove()
        },1500)
    }

    agregarGastosListado(gastos){

        this.limpiarHtml();

        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = ' list-group-item d-flex justify-content-between align-items-center '
            nuevoGasto.dataset.id = id

            nuevoGasto.innerHTML = 
            ` ${nombre}  <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`

            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = ()=>{
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante

    }

    comprarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante')

        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')

        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add( 'alert-success')
        }

        if(restante <= 0){
            ui.imprimirAlerta('SALDO INSUFICIENTE !!!')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }

}


const ui = new UI();
let presupuesto;

// funciones
function preguntarPresupuesto() {
    const presupuestoUser = prompt('cual es tu presupuesto ')
    if(presupuestoUser === '' || presupuestoUser === null || isNaN(presupuestoUser) || presupuestoUser <=0){
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUser)
    ui.mostrarCantidad(presupuesto)
}

function agregarGastos(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number( document.querySelector('#cantidad').value )  
    
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('ambos campos son obligatorios', 'error')
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida', 'error')
        return;
    }
  

   const gasto = { nombre, cantidad, id: Date.now() }

    presupuesto.nuevoGasto( gasto )

// imprimir gastos
    const { gastos, restante } = presupuesto
    ui.agregarGastosListado(gastos)
    ui.actualizarRestante(restante)
    ui.imprimirAlerta('gasto agregado correctamente')
    ui.comprarPresupuesto(presupuesto)
    formulario.reset()
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    const { gastos, restante } = presupuesto;
    ui.agregarGastosListado(gastos)
    ui.actualizarRestante(restante)
    ui.comprarPresupuesto(presupuesto) 
}

