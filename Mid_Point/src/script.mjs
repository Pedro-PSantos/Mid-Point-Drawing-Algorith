/*///////////////////////////////////*/
//  File script.js                   //
//                                   //
//  Ficheiro de entrada do script    //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/

//Importação das bibliotecas requeridas
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { lineMP } from '../lineMP.mjs';

//Variáveis Globais para as cores
const Azul = new THREE.Color(0x0000ff);
const Vermelho = new THREE.Color(0xff0000);
const AzulPlane = new THREE.Color(0x8e89b4);
const Black = new THREE.Color(0x000000);
const LaranjaPlane = new THREE.Color(0xf68968);
const Amarelo = new THREE.Color(0xffff00);

//Criação das variáveis a usar
const tiles = []; // Array para guardar os tiles da grid para verificar interceções
let P1 = {x:null,y:null};//Ponto 1
let P2 = {x:null,y:null};//Ponto 2
let R = [];//Vetor Reta
let CenterCameraCheck = false;//Variável para verificar se a função para centrar a câmara foi chamada
let targetPosition = new THREE.Vector3(0, 0, 30);//Posição inicial da câmara
let cameraSpeed = 0.05;
let size = 10;//Tamanho do lado de um quadrante da grid

//Criação da cena, câmara e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer();

//Expecificacoes dos objetos adicionados
renderer.setClearColor(0xFFFFFF);//Fundo Branco
renderer.setSize(window.innerWidth,window.innerHeight);//Tamanho da janela em relação ao browser
camera.position.copy(targetPosition);//Posição inicial da câmara
camera.lookAt(scene.position);//Câmara aponta para o centro da cena

//Adicionar o renderizador ao documento HTML
document.body.appendChild( renderer.domElement);

//Cria controlos da câmara
let controls = new OrbitControls(camera, renderer.domElement);

//Raio e vetor para deteção de interseções
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseGridPosition = new THREE.Vector2();

//Eixos x e y///////////////////////////////////////////////////////////////////////////////
//O tamanho dos eixos é o tamanho da grid + 2, para ficarem fora da grid e ver onde estão.//
//O lado que apresenta os eixos é o lado principal da grip na cena                        //
////////////////////////////////////////////////////////////////////////////////////////////
const xAxisGeometry = new THREE.Geometry();
xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
xAxisGeometry.vertices.push(new THREE.Vector3(size+2, 0, 0));
const xAxisMaterial = new THREE.LineBasicMaterial({ color: Azul });
const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
xAxis.position.z = 0.01;

const yAxisGeometry = new THREE.Geometry();
yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
yAxisGeometry.vertices.push(new THREE.Vector3(0, size+2, 0));
const yAxisMaterial = new THREE.LineBasicMaterial({ color: Vermelho });
const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
yAxis.position.z = 0.01;
////////////////////////////////////////////////////////////////////////////////////////////

//Função para desenhar os eixos
function DrawAxis(){
    scene.add(xAxis);
    scene.add(yAxis);
}
DrawAxis();

//Função para desenhar a grid
function DrawGrid(){
    //Definição das propriedades dos tiles da grid
    const tileGeometry = new THREE.PlaneGeometry( 1, 1);
    let material = null;
    
    //Ciclo para desenhar os tiles da grid, consoante a posição
    //São criados com DoubleSide, para melhorar estéticamente a grid
    for(let i=-size;i<=size;i++){
        for(let j=-size;j<=size;j++){
            //Condição para alternar as cores dos tiles
            if((i+j)%2==0){
                material = new THREE.MeshBasicMaterial( {color: LaranjaPlane, side: THREE.DoubleSide} );
            }
            else{
                material = new THREE.MeshBasicMaterial( {color: AzulPlane, side: THREE.DoubleSide} );
            }
            //Criação do tile e adição ao array de tiles e à cena
            const tile = new THREE.Mesh( tileGeometry, material );
            tile.position.set(i,j);
            tiles.push(tile);//Adiciona a posição ao tile para mais tarde verificar interceções
            scene.add(tile);
        }
    }
}
DrawGrid();

//Criar método para "ouvir" evento de movimento do rato, para obter a posição do rato
window.addEventListener('mousemove', (event) => {
    //obtem a posição do rato
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    //Define o raycaster para a posição do rato em relação à câmara
    raycaster.setFromCamera(mouse, camera);
    
    //Verifica as interceções do rato com os tiles
    const intersects = raycaster.intersectObjects(tiles);

    //Se houver interceção, guarda a posição do tile atual
    if (intersects.length > 0) {
        const OnSquare = intersects[0].object;
        const MouseX = OnSquare.position.x;
        const MouseY = OnSquare.position.y;
    
        //Condição para atualizar a posição do rato, em relação à grid, imprimindo-a na console
        if(mouseGridPosition.x != MouseX || mouseGridPosition.y != MouseY){
            mouseGridPosition.x = MouseX;
            mouseGridPosition.y = MouseY;
            console.log(`Posição do Rato: Pixel(${MouseX},${MouseY})`);
        }
    }
});


//Criar método para "ouvir" evento de clique em teclas,
//para obter a tecla clicada
window.addEventListener('keydown', (event) => {
    const keyPressed = event.key;

    //Se a tecla clicada for x, chama a função lightUpClickedTile, que seleciona o tile atual
    if(keyPressed == 'x'||keyPressed == 'X'){
        if(raycaster.intersectObjects(tiles).length>0)
            lightUpClickedTile();
        if(P2.x!=null && P2.y!=null){
            R = lineMP(P1,P2);
            //Caso o algoritmo tenha funcionado corretamente, desenha a linha e o caminho
            if(R.length>0){
                DrawPath(R);
                DrawLine(P1,P2);
            }
                P1.x = null;
                P1.y = null;
                P2.x = null;
                P2.y = null;
        }
    }
    //Se a tecla clicada for Backspace, chama a função CLearGrid, que apaga todos os tiles e linhas
    else if(keyPressed == 'Backspace'){
        CLearGrid();
    }
    //Se a tecla clicada for c, chama a função CenterCamera, que centra a câmara na posição inicial
    else if(keyPressed == 'c'||keyPressed == 'C'){
        CenterCamera();
    }
});

//Função para ativar a opção de centrar camera e desativar os controlos
function CenterCamera(){
    CenterCameraCheck = true;
    controls.enabled = false;
}

//Função para limpar a grid
function CLearGrid(){
    scene.remove(...scene.children);
    tiles.splice(0,tiles.length);
    DrawGrid();
    DrawAxis();
}

//Função para selecionar o tile atual, "iluminando-o"
function lightUpClickedTile(){
    const TileGeometry = new THREE.PlaneGeometry( 1, 1);
    const TileMaterial = new THREE.MeshBasicMaterial( {color: Vermelho, side: THREE.DoubleSide});
    const Tile = new THREE.Mesh( TileGeometry, TileMaterial );
    Tile.position.set(mouseGridPosition.x,mouseGridPosition.y);
    scene.add(Tile);

    //Se for o primeiro ponto, guarda-o em P1
    if(P1.x==null || P1.y==null)
        P1 = {x:mouseGridPosition.x,y:mouseGridPosition.y};
    //Se for o segundo ponto, guarda-o em P2
    else
        P2 = {x:mouseGridPosition.x,y:mouseGridPosition.y}; 
}

//Função para desenhar a linha entre P1 e P2
function DrawLine(P1,P2){
    //Usamos as funções de geometria de linha, com os pontos P1 e P2(o centro dos pixeis) nas extremidades
    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(P1.x, P1.y));
    lineGeometry.vertices.push(new THREE.Vector3(P2.x, P2.y));
    const lineMaterial = new THREE.LineBasicMaterial({ color: Black });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.position.z = 0.01;
    scene.add(line);    
}

//Função para desenhar o caminho entre P1 e P2, em Pixeis
function DrawPath(R){
    const PixelGeometry = new THREE.BoxGeometry(1,1,1/4);
    const PixelMaterial = new THREE.MeshBasicMaterial({
        color: Amarelo,
        transparent: true,
        opacity: 0.5 // Valor de transparência
        });
    //Ciclo para desenhar os pixeis do caminho
    for(let i=0;i<R.length;i++){
        const Pixel = new THREE.Mesh(PixelGeometry, PixelMaterial);
        Pixel.position.set(R[i].x,R[i].y);
        scene.add(Pixel);
    }  
}

//Função para animar a cena
function animate() {

    requestAnimationFrame(animate);
    //Usa a variavel de controlo para verificar se é para centrar a câmera
    if(CenterCameraCheck){
        //Usando a função lerp para interpolar a posição atual da câmara para a posição inicial
        camera.position.lerp(targetPosition, cameraSpeed);
    }
    //Se a câmara estiver centrada, ativa os controlos novamente e desativa a variável de controlo da câmara
    if(camera.position.distanceTo(targetPosition)<1){
        CenterCameraCheck = false;
        controls.enabled = true;
    }
    controls.update();//Atualiza os controlos da câmara
    renderer.render(scene, camera);//Renderiza a cena
}
//Chama a função para animar a cena, iniciado assim a animação da cena
animate();

//EOF
