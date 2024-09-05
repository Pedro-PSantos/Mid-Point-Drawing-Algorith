/*///////////////////////////////////*/
//  File rendering.mjs               //
//                                   //
//  Contém a lógica utilizada        //
//  no rendering                     //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';



export function createScene(THREE){
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x000055)); // Adiciona luz ambiente
    scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 0.1));// Luz hemisférica

    //HELPER
    //cores: x=vermelho, y=verde, z=azul
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    return scene;
}

export function createCamera(THREE){
    const camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,50000);
    camera.position.set(0,1000,1200);//Posição da câmara
    camera.lookAt(0,0,0);//Direção da câmara
    return camera;
}

export function createRenderer(THREE){
    const renderer = new THREE.WebGLRenderer();
    //Tamanho da janela em relação ao browser
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;

    return renderer;
}



/*
//Cria um cubo com arestas
const CubeGeometry = new THREE.BoxGeometry(10,10,10);//Criação da geometria do cubo
const CubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});//Criação do material do cubo
const Cube = new THREE.Mesh(CubeGeometry, CubeMaterial);//Criação do cubo

Cube.position.set(0,0,0);//Posição do cubos
Cube.rotateX(0.5);//Rodar o cubo no eixo X
addScene(scene,Cube);//Adicionar o cubo à cena

const CubeEdges = new THREE.EdgesGeometry(CubeGeometry);//Criação das arestas do cubo
const CubeLine = new THREE.LineSegments(CubeEdges, new THREE.LineBasicMaterial({color: 0xff00ff}));//Criação do material das arestas do cubo
CubeLine.rotateX(0.5);//Rodar as arestas do cubo no eixo X
CubeLine.position.set(0,20,0);//Posição das arestas do cubo
addScene(scene,CubeLine);//Adicionar as arestas do cubo à cena


const terrenoGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const terrenoMesh = new THREE.Mesh(terrenoGeo, material);
addScene(scene,terrenoMesh);

renderer.render(scene,camera);
*/



export function addScene(scene,object){
    scene.add(object);
}

export function render(scene,camera,renderer){
    renderer.render(scene,camera);
}








