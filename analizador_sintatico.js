const Parser = require('./parser');
const execute = (automato, analiseLexica, analiseSintatica) => {
    const parser = Parser.execute();
    analiseSintatica = { 'fila': constroiFila(analiseLexica), 'pilha': [0], 'acao': '', 'ac': false };
    while(!analiseSintatica['ac']){
        // Obtém uma ação, como: REDUÇÃO, SHIT, ACEITAÇÃO, ERRO SINTÁTICO
        obterAcao(analiseSintatica, parser);
        // ERRO SINTÁTICO: Não foi possível identificar alguma ação a partir da tabela do Parser
        if(analiseSintatica['acao'] == undefined){
            console.log("[error] sintatico");
            break;
        // REDUÇÃO: Remover elementos da pilha até completar a redução
        } else if(analiseSintatica['acao'].acao == 'r'){
            //['reducao']: Novo valor, ['valor']: Elementos da pilha que devem ser substituídos
            const regra = parser['regras'][analiseSintatica['acao'].estado];
            // Quando não precisa remover nenhum elemento
            if(regra.valor[0]){
                // Pega a última posição, percorrendo assim de trás para frente
                let contador = regra.valor.length - 1;
                while(contador > -1){
                    if(regra.valor[contador] == analiseSintatica['pilha'].slice(-1)){
                        contador--;
                    }
                    analiseSintatica['pilha'].pop();
                }
            }
            analiseSintatica['pilha'].push(regra.reducao);
            // Atualiza o novo estado após ter feito a redução
            desvio(analiseSintatica, parser);
        // SHIT: O token atual da fila é removido e colocado na pilha
        } else if(analiseSintatica['acao'].acao == 's'){
            analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
            analiseSintatica['pilha'].push(analiseSintatica['acao'].estado);
            analiseSintatica['fila'].shift();
        // ACEITAÇÃO: A cadeia de tokens é aceita
        } else if(analiseSintatica['acao'].acao == 'ac'){
            analiseSintatica['ac'] = true;
        }
        printEstrutura(analiseSintatica);
    }
};
const desvio = (analiseSintatica, parser) =>{
    // Penúltimo elemento da pilha, que é um estado
    const estado = 'State_' + analiseSintatica['pilha'].slice(-2)[0];
    // Último elemento da pilha, que é um token
    const inicioPilha = analiseSintatica['pilha'].slice(-1)[0];
    // Adiciona o novo estado à pilha a partir da tabela do Parser
    analiseSintatica['pilha'].push(parser['estados'][estado][inicioPilha].estado);
};
const obterAcao = (analiseSintatica, parser) =>{
    // Último elemento da pilha, que é um estado
    const estado = 'State_' + analiseSintatica['pilha'].slice(-1)[0];
    // Pega o primeiro elemento da fila
    const inicioFila = analiseSintatica['fila'][0];
    analiseSintatica['acao'] = parser['estados'][estado][inicioFila];
};

const printEstrutura = (as) =>{
    console.log("PILHA:", as['pilha']);
    console.log("FILA:", as['fila']);
    console.log("ACAO:", (as['acao'].acao + (as['acao'].estado || ' ')));
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n");
};

const constroiFila = (tokens) =>{
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
