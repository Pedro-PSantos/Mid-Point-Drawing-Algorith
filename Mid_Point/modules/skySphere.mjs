/*///////////////////////////////////*/
//  File skySphere.mjs               //
//                                   //
//  Contém o código da esfera        //
//  amarela no céu                   //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/





//Existência de uma esfera amarela no ceu, em rotação através do plano conveniente,
//iluminando o terreno abaixo.


export function gerarSkySphere(THREE) {

    /*const sunLight = new THREE.SpotLight(0xffff00);
    sunLight.position.set(0, 50, -60);
    sunLight.angle = Math.PI / 32; // Ângulo de abertura da luz
    sunLight.penumbra = 0.2; // Suavidade da sombra
    sunLight.decay = 0; // Atenuação da luz
    sunLight.distance = 0; // Distância máxima da luz (infinito)
    */
    const skySphereGeo = new THREE.SphereGeometry(100,300,300);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false });
    const Sun = new THREE.Mesh(skySphereGeo, material);

    Sun.position.set(0, 300, -1250);

    const sunlight = new THREE.PointLight(0xffff00, 2 , 5000);
    sunlight.position.set(0, 50, -60);

    

    Sun.add(sunlight);


    return Sun;//{Forma: Sun,Luz: sunlight/*sunLight*/};

}



