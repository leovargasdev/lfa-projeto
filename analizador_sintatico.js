const Parser = require('./parser');
const execute = (automato, analiseLexica, analiseSintatica) => {
    const parser = Parser.execute();
    analiseSintatica = { 'fila': obterFila(analiseLexica), 'pilha': ['$', 0], 'acao': '', 'ac': false };
    printEstrutura(analiseSintatica);
    // obterAcao(analiseSintatica, parser);
    while(!analiseSintatica['ac']){

        obterAcao(analiseSintatica, parser);

        if(analiseSintatica['acao'].acao == 'r'){
            //REDUCAO: pegar valor da tabela de regras de acordo com número
            const regra = parser['regras'][analiseSintatica['acao'].estado]; //['reducao']: Novo valor, ['valor']: Elemento da pilha que deve ser substituido
            if(regra.valor[0] != ''){
                let aux = regra.valor.length - 1;
                while(aux > -1){
                    if(regra.valor[aux] == analiseSintatica['pilha'].slice(-1)){
                        aux--;
                    }
                    analiseSintatica['pilha'].pop();
                }
            }

            analiseSintatica['pilha'].push(regra.reducao); // Empilha a ação desta redução
            if(regra.valor[0] == '') analiseSintatica['pilha'].push(analiseSintatica['acao'].estado); // Empilha o próximo estado a ser executado
        }else if(analiseSintatica['acao'].acao == 's'){
            //SHIT: Remover o primeiro elemento da fila e colocar ele na pilha
            analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
            analiseSintatica['pilha'].push(analiseSintatica['acao'].estado);
            analiseSintatica['fila'].shift();
        }else if(analiseSintatica['acao'].acao == 'ac'){
            analiseSintatica['ac'] = true;
        }
        printEstrutura(analiseSintatica);
    }
};

const obterAcao = (analiseSintatica, parser) =>{
    let estado = 'State_', topoPilha = analiseSintatica['fila'][0];
    if(typeof(analiseSintatica['pilha'].slice(-1)[0]) == 'number'){
        estado += analiseSintatica['pilha'].slice(-1);
    } else {
        estado += analiseSintatica['pilha'].slice(-2)[0];
        if(topoPilha == '$'){
            topoPilha = analiseSintatica['pilha'].slice(-1)[0];
        }
    }
    analiseSintatica['acao'] = parser['estados'][estado][topoPilha];
    if(analiseSintatica['acao'].acao == 'g'){
        analiseSintatica['pilha'].push(analiseSintatica['acao'].estado)
        obterAcao(analiseSintatica, parser);
        // console.log(analiseSintatica['acao'].estado);
    }
    // console.log("Acao:", analiseSintatica['acao'], "estado:", estado, "topoPilha:", topoPilha);

};

const printEstrutura = (as) =>{
    console.log("PILHA:", as['pilha']);
    console.log("FILA:", as['fila']);
    console.log("ACAO:", (as['acao'].acao + as['acao'].estado));
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n");
};

const obterFila = (tokens) =>{
    let fila = [];
    for(const a in tokens){
        for(const k in tokens[a]){
            fila.push(tokens[a][k].token);
        }
    }
    fila.push('$');
    return fila;
};

module.exports = {
    execute
};
