const Parser = require('./parser');
const execute = (automato, analiseLexica, analiseSintatica) => {
    const parser = Parser.execute();
    let a = 10;
    analiseSintatica = { 'fila': obterFila(analiseLexica), 'pilha': [0], 'acao': '', 'ac': false };
    // printEstrutura(analiseSintatica);
    while(!analiseSintatica['ac']){
        obterAcao(analiseSintatica, parser);
        printEstrutura(analiseSintatica);
        if(analiseSintatica['acao'].acao == 'r'){
            const regra = parser['regras'][analiseSintatica['acao'].estado]; //['reducao']: Novo valor, ['valor']: Elemento da pilha que deve ser substituido
            if(regra.valor[0]){
                let aux = regra.valor.length - 1;
                while(aux > -1){
                    if(regra.valor[aux] == analiseSintatica['pilha'].slice(-1)){
                        aux--;
                    }
                    analiseSintatica['pilha'].pop();
                }
                analiseSintatica['pilha'].push(regra.reducao);
                desvio(analiseSintatica, parser);
            } else {
                analiseSintatica['pilha'].push(regra.reducao);
                desvio(analiseSintatica, parser);
                // analiseSintatica['pilha'].push(analiseSintatica['acao'].estado);
            }
        } else if(analiseSintatica['acao'].acao == 's'){
            analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
            analiseSintatica['pilha'].push(analiseSintatica['acao'].estado);
            analiseSintatica['fila'].shift();
        } else if(analiseSintatica['acao'].acao == 'ac'){
            analiseSintatica['ac'] = true;
        }
    }
    // printEstrutura(analiseSintatica);
};
const desvio = (analiseSintatica, parser) =>{
    let estado = 'State_' + analiseSintatica['pilha'].slice(-2)[0], inicioPilha = analiseSintatica['pilha'].slice(-1)[0];
    analiseSintatica['pilha'].push(parser['estados'][estado][inicioPilha].estado);
};
const obterAcao = (analiseSintatica, parser) =>{
    let estado = 'State_' + analiseSintatica['pilha'].slice(-1)[0], inicioFila = analiseSintatica['fila'][0];
    analiseSintatica['acao'] = parser['estados'][estado][inicioFila];
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
