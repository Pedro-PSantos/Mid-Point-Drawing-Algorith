/*///////////////////////////////////*/
//  File main.js                     //
//                                   //
//  Ficheiro de entrada do script    //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/



//Importação das bibliotecas requeridas
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import * as addOns from './modules/addOns .mjs';
import * as uiControls from './modules/uiControls.mjs';
import * as rendering from './modules/rendering.mjs';
import * as skySphere from './modules/skySphere.mjs';
import * as terrainCostumization from './modules/terrainCustomization.mjs';
import * as terrainGeneration from './modules/terrainGeneration.mjs';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { randomizer, moving, reset } from './modules/uiControls.mjs'; 



//Funções para o htlm 
const slider = document.getElementById("myRange");
const output = document.getElementById("sliderValue");
output.innerHTML = slider.value; // Exibir o valor inicial

slider.oninput = function() {
    // Atualizar o valor exibido em percentagem conforme a barra deslizante é movida
    output.innerHTML = Math.round((this.value - this.min) / (this.max - this.min) * 100) + "%";
}
slider.oninput();

document.addEventListener("DOMContentLoaded", function(event) {
    // Mostrar o menu quando o conteúdo estiver pronto
    document.getElementById("menu").style.display = "block";
    slider.oninput();
})
// Selecionar o input do tipo "color"
let colorInput = document.getElementById('style1');

// Obter o valor da cor selecionada
let selectedColor = colorInput.value;
///////////////////////////CORES///////////////////////////


//Variáveis globais
let ratio = 2;//este valor modifica a velocidade do sol
let Altura = slider.value*2;
let step = 0.0;

//Vars da cena
const scene = rendering.createScene(THREE);
const camera = rendering.createCamera(THREE);
const renderer = rendering.createRenderer(THREE);

//Adicionar o renderizador ao documento HTML
document.body.appendChild( renderer.domElement);

//Add controls to the scene
let controls = new OrbitControls(camera, renderer.domElement);

/*///////////////////////////////////*/
//                                   //  
//              SKYBOX               //
//                                   //
/*///////////////////////////////////*/
//Criação de um mapa de terreno com Perlin Noise no módulo terrainGeneration. O terreno
let terreno = terrainGeneration.gerarTerreno(THREE,50);//Criação do terreno

let terrenoBaseStatus = terreno.geometry.clone(); //salva os valores de origem do terreno
const Sun = skySphere.gerarSkySphere(THREE);//Criação da esfera amarela no céu
let terrenoAtual = terreno.clone(); //salva os valores de origem do terreno

rendering.addScene(scene,Sun);//Adicionar o Sol à cena
rendering.addScene(scene,terreno);//Adicionar o terreno à cena

const skyboxGeometry = new THREE.BoxGeometry(15000,15000,15000);
const skyboxTexture = new THREE.CubeTextureLoader().load([
    './images/skybox_right.png',
    './images/skybox_left.png',
    './images/skybox_down.png',
    './images/skybox_up.png',
    './images/skybox_front.png',
    './images/skybox_back.png'
]);

 // Set the texture wrapping mode to RepeatWrapping for all 6 textures
    skyboxTexture.wrapS = THREE.RepeatWrapping;
    skyboxTexture.wrapT = THREE.RepeatWrapping;

// Create a shader material for the skybox using the loaded textures
const skyboxMaterial = new THREE.MeshBasicMaterial( { envMap: skyboxTexture, side: THREE.BackSide } );

// Create the skybox mesh
const skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterial );

scene.add(skybox);

document.addEventListener("keydown", function(event){
    
    //Tecla “A” permite aleatorizar o mapa de alturas para uma nova geometria
    if(event.code == "KeyA"){
        
        //randomizer = true;
        //reset = false;
        terrainGeneration.aplicarNoise(terreno,slider.value);
        //terreno.geometry = terrenoAtual.geometry.clone();
        terrenoAtual = terreno.clone();
    }
    //Tecla “R” permite fazer reset ao terreno original 
    if(event.code == "KeyR"){
        terreno.geometry = terrenoBaseStatus.clone();
        slider.value = 50;
        slider.oninput();
    }
    //Tecla “S” permite pausa/continuação da trajetória da esfera através do ceu.
    if(event.code == "KeyS"){
        ratio == 0 ? ratio = 2 : ratio = 0;

        /*sun.customProperties.isTranslating = !sun.customProperties.isTranslating;*/
    }
});
/*///////////////////////////////////*/
//               FIM                 //  
//              SKYBOX               //
//                                   //
/*///////////////////////////////////*/

function animate(){

    
    let distance = 650;
    
    Sun.position.x +=   ratio*3*Math.cos(step);
    Sun.position.z +=   ratio*3*Math.sin(step);
    if(ratio != 0)
        step += (Math.PI / (distance));//Este valor é o que faz o raio da circunferência
    
    /////Atualização da cor do terreno/////
    if(selectedColor != document.getElementById('style1').value)
    {
        selectedColor = document.getElementById('style1').value;
    }

    terreno.material.color.set(selectedColor);
    //////////////////////////////////////////


    /////Atualização da altitude do terreno/////
    if(Altura != slider.value*2){
        Altura = slider.value*2;
        
        terreno.geometry = terrenoAtual.geometry.clone();
        var vertices = terreno.geometry.attributes.position.array;

        
        for (var i = 0; i < vertices.length; i += 3) {
            vertices[i+2] = (Altura / 100) * vertices[i+2];
        }
        
        terreno.geometry.attributes.position.needsUpdate = true; // Informa ao Three.js que as posições foram atualizadas
        terreno.geometry.computeVertexNormals();
    }

    //////////////////////////////////////////
    skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
    requestAnimationFrame(animate);//Criação de uma animação
    renderer.render(scene,camera);//Renderizar a cena
    controls.update();//Atualizar os controlos da câmara

    
}
animate();







