/*///////////////////////////////////*/
//  File lineMP.mjs                  //
//                                   //
//  Algoritmo do ponto médio         //
//                                   //
//  Autor: Pedro Santos 2000809      //
/*///////////////////////////////////*/

export function lineMP(P1,P2){

    const R=[];//Vetor para guardar os pontos da reta
    //Verificação se as coordenadas são inteiras
    if(Number.isInteger(P1.x)==false||Number.isInteger(P1.y)==false||Number.isInteger(P2.x)==false||Number.isInteger(P2.y)==false){
        console.log("Coordenadas não são inteiras");
        return R;
    }

    // Criação objeto do ponto, atribuindo de uma vez as coordenadas x e y do ponto inicial
    const P = {x:P1.x,y:P1.y}; 

    const dx=P2.x-P1.x;//Variação da ordenada
    const dy=P2.y-P1.y;//Variação da abscissa
    const da=Math.abs(dx);//Variação absoluta da ordenada
    const db=Math.abs(dy);//Variação absoluta da abscissa
    
    const incrementX = P2.x>P1.x ? 1 : -1;//Condicional para saber se a reta é crescente ou decrescente em x
    const incrementY = P2.y>P1.y ? 1 : -1;//Condicional para saber se a reta é crescente ou decrescente em y

    //Declive da reta
    const m = (P2.x-P1.x == 0) ? 0 : (dy)/(dx);//adiciona-se a condicional para evitar divisão por 0
    
    R.push({...P});//Adiciona o ponto inicial ao vetor

    if(Math.abs(m)<=1&&dx!=0){//Octantes 1,4,5,8

        //Variaveis de decisão e incremento da decisão
        let decision=2*db-da;
        const incrementm1=2*db;
        const incrementm2=(-2)*da;

         while((P.x!=P2.x)){
            
            P.x+=incrementX;//X aumenta sempre 1            
            if(decision>0){
                P.y+=incrementY;
                decision+=incrementm2;
            }            
            decision+=incrementm1;
            R.push({...P});
        }
    }
    else{//Octantes 2,3,6,7
            
        //Variaveis de decisão e incremento da decisão
        let decision=2*da-db;
        const incrementm1=2*da;
        const incrementm2=(-2)*db;

        while((P.y!=P2.y)){
            
            P.y+=incrementY;//Y aumenta sempre 1
            if(decision>0){
                P.x+=incrementX;
                decision+=incrementm2;
            }
            decision+=incrementm1;            
            R.push({...P});
        }
    }
    return R;
}

//EOF
