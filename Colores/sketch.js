//Red neuronal (neuralNetwork)
let red_neuronal
let entrenamiento_terminado = false
//Menu de slider para (RGB) a predecir
let rojo_slider, verde_slider, azul_slider

//Resultado de la predicion 
let label_resultados

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
    task: 'classification'
  }
  red_neuronal = ml5.neuralNetwork(nnOptions)
  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  }
  red_neuronal.load(modelDetails, terminadoEntrenamiento)
}



function terminadoEntrenamiento() {
  entrenamiento_terminado = true
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