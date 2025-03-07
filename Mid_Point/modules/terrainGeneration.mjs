/*///////////////////////////////////*/
//  File terrainGeneration.mjs       //
//                                   //
//  Contém o código para geração     //
//  do terreno                       //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/



//Criação de um mapa de terreno com Perlin Noise no módulo terrainGeneration. O terreno
//deverá ter uma deformação consistente com geometrias sensatas para o efeito (i.e. vértices
//não ultrapassarem largamente a altura do ecrã, vértices consecutivos com alturas
//excessivamente dispares, etc.).



function PerlinNoise (x,y){
    let n = x + y * 57;
    n = (n<<13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff)/1073741824.0);
}



const verde = 0x00ff00;
export function gerarTerreno(THREE,Size) {
    

    const terrenoGeo = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00,side: THREE.DoubleSide,flatShading: true});//, emissive: 0xff0000, shininess: 30, side: THREE.DoubleSide    });
    let terreno = new THREE.Mesh(terrenoGeo, material);
    
    aplicarNoise(terreno,Size);
    terreno.geometry.computeVertexNormals();

    terreno.rotateX(Math.PI / 2);
    terreno.castShadow = true;
    terreno.receiveShadow = true;

    return terreno;
}

export function aplicarNoise(terreno,Size){

    var Noise = new Perlin();

    var peak = Size;
    var vertices = terreno.geometry.attributes.position.array;
    for (var i = 0; i <= vertices.length; i += 3) {
        vertices[i+2] = peak*Noise.noise(vertices[i]/169,vertices[i+1]/169);//*/peak * Math.random();
    }
    terreno.geometry.attributes.position.needsUpdate = true;
    

}


class Perlin {
    constructor() {
        this.grad3 =    
            [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
        this.p = [];
        for (var i=0; i<256; i++) {
            this.p[i] = Math.floor(Math.random()*256);
        }
        
        // To remove the need for index wrapping, double the permutation table length 
        this.perm = []; 
        for(i=0; i<512; i++) {
            this.perm[i]=this.p[i & 255];
        } 

        // A lookup table to traverse the simplex around a given point in 4D. 
        // Details can be found where this table is used, in the 4D noise method. 
        this.simplex = [ 
            [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0], 
            [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0], 
            [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], 
            [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0], 
            [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0], 
            [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], 
            [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0], 
            [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]; 
    }

    dot(g, x, y) { 
        return g[0]*x + g[1]*y;
    }

    noise(xin, yin) { 
        var n0, n1, n2; // Noise contributions from the three corners 
        // Skew the input space to determine which simplex cell we're in 
        var F2 = 0.5*(Math.sqrt(3.0)-1.0); 
        var s = (xin+yin)*F2; // Hairy factor for 2D 
        var i = Math.floor(xin+s); 
        var j = Math.floor(yin+s); 
        var G2 = (3.0-Math.sqrt(3.0))/6.0; 
        var t = (i+j)*G2; 
        var X0 = i-t; // Unskew the cell origin back to (x,y) space 
        var Y0 = j-t; 
        var x0 = xin-X0; // The x,y distances from the cell origin 
        var y0 = yin-Y0; 
        // For the 2D case, the simplex shape is an equilateral triangle. 
        // Determine which simplex we are in. 
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords 
        if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1) 
        else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1) 
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
        // c = (3-sqrt(3))/6 
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords 
        var y1 = y0 - j1 + G2; 
        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords 
        var y2 = y0 - 1.0 + 2.0 * G2; 
        // Work out the hashed gradient indices of the three simplex corners 
        var ii = i & 255; 
        var jj = j & 255; 
        var gi0 = this.perm[ii+this.perm[jj]] % 12; 
        var gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12; 
        var gi2 = this.perm[ii+1+this.perm[jj+1]] % 12; 
        // Calculate the contribution from the three corners 
        var t0 = 0.5 - x0*x0-y0*y0; 
        if(t0<0) n0 = 0.0; 
        else { 
            t0 *= t0; 
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient 
        } 
        var t1 = 0.5 - x1*x1-y1*y1; 
        if(t1<0) n1 = 0.0; 
        else { 
            t1 *= t1; 
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); 
        }
        var t2 = 0.5 - x2*x2-y2*y2; 
        if(t2<0) n2 = 0.0; 
        else { 
            t2 *= t2; 
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); 
        } 
        // Add contributions from each corner to get the final noise value. 
        // The result is scaled to return values in the interval [-1,1]. 
        return 70.0 * (n0 + n1 + n2); 
    }
}
