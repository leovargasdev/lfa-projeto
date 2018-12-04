const Parser = require('./parser');
const execute = (automato, analiseLexica, analiseSintatica) => {
    const parser = Parser.execute();
    analiseSintatica = { 'fila': obterFila(analiseLexica), 'pilha': ['$', 0], 'acao': '', 'ac': false };

    while(!analiseSintatica['ac']){

        const prox_estado = 'State_' + analiseSintatica['pilha'].slice(-1); // Pega o topo da pilha, que deve ser o próximo estado
        let estado = parser['estados'][prox_estado];

        estado.forEach((e)=>{
            if(e.token == analiseSintatica['fila'][0]){
                if(e.acao == 'r'){
                    //REDUCAO: pegar valor da tabela de regras de acordo com número
                    const regra = parser['regras'][e.acao+e.estado]; //[0]: Novo valor, [1]: Elemento da pilha que deve ser substituido
                    console.log("regra:", regra);
                    if(regra[1] != ''){
                        while(true){
                            if(regra[1] == analiseSintatica['pilha'].slice(-1)){
                                analiseSintatica['pilha'].pop();
                                break;
                            }
                            analiseSintatica['pilha'].pop();
                        }
                    }
                    analiseSintatica['pilha'].push(regra[0]); // Empilha a ação desta redução
                    analiseSintatica['pilha'].push(e.estado); // Empilha o próximo estado a ser executado
                }else if(e.acao == 's'){
                    //SHIT: Remover o primeiro elemento da fila e colocar ele na pilha
                    analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
                    analiseSintatica['pilha'].push(e.estado);
                    analiseSintatica['fila'].shift();
                }else if(e.acao == 'a' && analiseSintatica['pilha'].length < 3){
                    analiseSintatica['ac'] = true;
                }
                printEstrutura(analiseSintatica);
            }
        });


    }
};

const printEstrutura = (as) =>{
    console.log("FILA:", as['fila']);
    console.log("PILHA:", as['pilha']);
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n");
}

const obterFila = (tokens) =>{
    let fila = [];
    for(const a in tokens){
        for(const k in tokens[a]){
            fila.push(tokens[a][k].token);
        }
    }
    fila.push('$');
    return fila;
}

module.exports = {
    execute
};
