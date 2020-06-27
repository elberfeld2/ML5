//Utilidades
const espera = ms => new Promise(resuelve => setTimeout(resuelve, ms))
const ocultar_elemento = (e) => e.style.display = 'none';
const mostrar_elemento = (e) => e.style.display = 'block';

//Agregar un texto por epoca
let vEpocas = document.getElementById("vEpocas")
function agregar(texto) {
    vEpocas.innerHTML += texto
}
//Menu
function crearMenu(opciones) {
    const opcs_dom = opciones.map(ocp => [document.getElementById("v" + ocp), "v" + ocp])
    const menu = (ocp) => {
        opcs_dom.forEach(opc_dom => ocp == opc_dom[1] ? mostrar_elemento(opc_dom[0]) : ocultar_elemento(opc_dom[0]))
    }
    opciones.forEach(ocp => {
        const btn = document.getElementById("b" + ocp)
        btn.onclick = (e) => menu("v" + ocp)
    })
    return menu
}


//Red neuronal

//Variable para la red neuronal
let red_neuronal

//Funciones para la red neuronal
function crearRedNeuronal(data_entrenar) {
    let opciones_nn = {
        task: 'classification',
        debug: false
    }
    red_neuronal = ml5.neuralNetwork(opciones_nn)

    data_entrenar.forEach(i => {
        red_neuronal.addData([i.sepalLength, i.sepalWidth, i.petalLength, i.petalWidth], [i.species])
    })
    red_neuronal.normalizeData()
}
async function comenzarEntrenamiento(){
    const opciones_entrenamiento = {
        epochs: 20,
        batchSize: 64
    }
    await red_neuronal.train(opciones_entrenamiento, duranteEntrenamiento, () => { })
}
function duranteEntrenamiento(epoch, logs) {
    agregar(`Epoca : ${epoch + 1} - Perdida : ${logs.loss.toFixed(2)}<br>`)
}
async function testeo(data_testear) {
    const resultados = []
    
    for (let i = 0; i < data_testear.length; i++) {
        const item = data_testear[i];
        let result = await red_neuronal.classify([item.sepalLength, item.sepalWidth, item.petalLength, item.petalWidth])
        resultados.push({ ...item, clasificacion: result[0].label })
    }
    return resultados
}




//Agregar datos a una tabla
function agregarDatosTabla(data,idTabla) {
    const tDatos = document.getElementById(idTabla)
    tDatos.innerHTML = data.reduce(
        (acc, item) => acc + `
          <tr>
              <td>${item.sepalLength}</td>
              <td>${item.sepalWidth}</td>
              <td>${item.petalLength}</td>
              <td>${item.petalWidth}</td>
              <td>${item.species}</td>
          </tr>` , "")
}
function agregarDatosClasificados(data,idTabla) {
    const tDatos = document.getElementById(idTabla)
    tDatos.innerHTML = data.reduce(
        (acc, item) => acc + `
          <tr>
              <td>${item.sepalLength}</td>
              <td>${item.sepalWidth}</td>
              <td>${item.petalLength}</td>
              <td>${item.petalWidth}</td>
              <td>${item.species}</td>
              <td>${item.clasificacion}</td>
          </tr>` , "")
}
function dividirTabla(datos,porcentaje_de_entrenamiento){
    let data_entrenar = []
    let data_testear = []
    datos.forEach(item => Math.random() <= porcentaje_de_entrenamiento ? data_entrenar.push(item) : data_testear.push(item))
    return [data_entrenar,data_testear]
}





async function main() {
    //Inicializamos el menu
    const menu = crearMenu(["Datos", "DatosEnt", "Epocas", "Red", "DatosTes"])
    //No mostramos nada
    menu("")
    //Octenemos los datos
    const datos = (await (await fetch("data/iris.json")).json()).entries
    //Agregamos los datos a la tabla
    agregarDatosTabla(datos,"tDatos")
    //Mostramos la vista
    menu("vDatos")
    //Esperamos
    await espera(1000)
    //Partimos el array en dos 
    const [data_entrenar,data_testear] = dividirTabla(datos,0.8)
    //Agregamos los datos a la tabla
    agregarDatosTabla(data_entrenar,"tDatosEnt")
    //Mostramos la vista
    menu("vDatosEnt")
    //Esperamos
    await espera(1000)
    //Creamos la red neuronal
    crearRedNeuronal(data_entrenar)
    //Mostramos la vista
    menu("vRed")
    await espera(1000)
    //Mostramos la vista 
    menu("vEpocas")
    //inciamos entrenamiento
    comenzarEntrenamiento()
    //Iniciamos testeo
    const datos_claseificados = await testeo(data_testear)
    //Agregamos los datos a la tabla
    agregarDatosClasificados(datos_claseificados,"tDatosTes")
    //Mostramos la vista
    menu("vDatosTes")   
}

main()