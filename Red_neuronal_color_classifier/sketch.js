//Red neuronal (neuralNetwork)
let red_neuronal
let entrenamiento_terminado = false
//Menu de slider para (RGB) a predecir
let rojo_slider, verde_slider, azul_slider

//Resultado de la predicion 
let label_resultados

//Muestra del estado del entrenamiento
let entrenando = document.getElementById("entrenando")

//Muestra del estado de cada epoca
let epocas = document.getElementById("epocas")

//Funcion para las opciones
const agregarPadre = (padre)=>(hijo)=>hijo.parent(padre)


function crearResultado(){
  //Contienes el resultado de la predicion y el canvas 
  const resultado = agregarPadre(document.getElementById("resultado"))
  label_resultados = createP('<br>Resultado.')
  resultado(createCanvas(100, 100))
  resultado(label_resultados)
}
function crearMenu(){
  //Menu que contiene la opciones o sliders en este caso
  const menu = agregarPadre(document.getElementById("menu"))
  rojo_slider = createSlider(0, 255, 255)
  verde_slider = createSlider(0, 255, 0)
  azul_slider = createSlider(0, 255, 255)
  menu(createP('Rojo'))
  menu(rojo_slider)
  menu(createP('Verde'))
  menu(verde_slider)
  menu(createP('Azul'))
  menu(azul_slider)
}

function crearRedNeuronal(){
  let nnOptions = {
    dataUrl: 'data/colorData.json',
    inputs: ['r', 'g', 'b'],
    outputs: ['label'],
    task: 'classification',
    debug: false
  }
  red_neuronal = ml5.neuralNetwork(nnOptions, comenzarModelo)
}

function comenzarModelo() {
  red_neuronal.normalizeData()
  const opciones_entrenamiento = {
    epochs: 20,
    batchSize: 64
  }
  red_neuronal.train(opciones_entrenamiento, duranteEntrenamiento, terminadoEntrenamiento)
}

let final = ""

function duranteEntrenamiento(epoch, logs){
  final = (`Época   : ${epoch+1} - Perdida : ${logs.loss.toFixed(2)}<br>`)
  epocas.innerHTML += final
}

function terminadoEntrenamiento(anything) {
  entrenamiento_terminado = true
  //Finalizamos los datos
  epocas.innerHTML = "Prueba moviendo los sliders <br>"+final+"<br>"
  entrenando.innerHTML = "Entrenamiento terminado<br><br>"
  //Creamos los menus
  crearMenu()
  crearResultado()
  //Iniciamos la clasificacion
  clasificar()
}

function clasificar() {
  let inputs = {
    r: rojo_slider.value(),
    g: verde_slider.value(),
    b: azul_slider.value()
  }
  red_neuronal.classify([inputs.r, inputs.g, inputs.b], mostrarResultados)
}

function mostrarResultados(error, results) {
  if (error) {//Mostar error
    console.error(error)
  } else {//Motar Resultado
    label_resultados.html(`<br>Resultado : ${results[0].label} , Certeza : ${results[0].confidence.toFixed(2)}`)
    clasificar()//Volever a clasificar
  }
}

//Funciones propias de p5

//(setup) inicializa las variables 
function setup() {
  crearRedNeuronal()
}
//(draw) se ejecuta cada cierto tiempo
function draw() {
  if(entrenamiento_terminado){
    //Actualizamos el color 
    background(rojo_slider.value(), verde_slider.value(), azul_slider.value())
  }
}