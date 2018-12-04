const Parser = require('./parser');
const execute = (automato, analiseLexica) => {
    const parser = Parser.execute();
    const analiseSintatica = {
        'fila': obterFila(analiseLexica),
        'pilha': ['$', 0],
        'acao': '',
    };
    while(true){
        const aux = analiseSintatica['pilha'].length - 1;
        if(typeof(analiseSintatica['pilha'][aux]) == 'number'){
            let estado = parser['estados']['State_' + analiseSintatica['pilha'][aux]];
            for(const e in estado){
                if(estado[e].includes(analiseSintatica['fila'][0] + ' ')){
                    console.log("analiseSintatica", JSON.stringify(analiseSintatica, null, 4));
                    analiseSintatica['acao'] = estado[e].replace(/[ ]/g, '').replace(analiseSintatica['fila'][0], '');
                    if(analiseSintatica['acao'][0] == 'r'){
                        //REDUCAO: pegar valor da tabela de regras de acordo com número
                        analiseSintatica['pilha'].push(parser['regras'][analiseSintatica['acao']][0]);
                        analiseSintatica['pilha'].push(Number(analiseSintatica['acao'].replace('r', '')));
                    }else if(analiseSintatica['acao'][0] == 's'){
                        analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
                        analiseSintatica['pilha'].push(Number(analiseSintatica['acao'].replace('s', '')));
                        analiseSintatica['fila'].shift();
                    }else if(analiseSintatica['acao'][0] == 'a'){
                        console.log('reconheceu');
                        return true;
                    }
                    break;
                }
            }
        }
    }
};

const obterFila = (tokens) =>{
    let fila = [];
    for(const a in tokens){
        for(const k in tokens[a]){
            fila.push(tokens[a][k].token);
        }
    }
    return fila;
}

module.exports = {
    execute
};
