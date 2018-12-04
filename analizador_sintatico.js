const Parser = require('./parser');
const execute = (automato, analiseLexica, analiseSintatica) => {
    const parser = Parser.execute();
    analiseSintatica = { 'fila': obterFila(analiseLexica), 'pilha': ['$', 0], 'acao': '', 'ac': false };

    while(!analiseSintatica['ac']){

        const prox_estado = 'State_' + analiseSintatica['pilha'].slice(-1); // Pega o topo da pilha, que deve ser o próximo estado
        let estado = parser['estados'][prox_estado];

        console.log("prox_estado:", prox_estado);
        console.log("token:", analiseSintatica['fila'][0]);
        estado.forEach((e)=>{
            if(e.token == analiseSintatica['fila'][0])
                console.log(e, "achou bem topper!");
        });
        analiseSintatica['ac'] = true;
        // for(const e in estado){
        //     if(estado[e].includes(analiseSintatica['fila'][0])){
        //         console.log("analiseSintatica", JSON.stringify(analiseSintatica, null, 4));
        //         analiseSintatica['acao'] = estado[e].replace(/[ ]/g, '').replace(analiseSintatica['fila'][0], '');
        //         if(analiseSintatica['acao'][0] == 'r'){
        //             //REDUCAO: pegar valor da tabela de regras de acordo com número
        //             analiseSintatica['pilha'].push(parser['regras'][analiseSintatica['acao']][0]);
        //             analiseSintatica['pilha'].push(Number(analiseSintatica['acao'].replace('r', '')));
        //         }else if(analiseSintatica['acao'][0] == 's'){
        //             analiseSintatica['pilha'].push(analiseSintatica['fila'][0]);
        //             analiseSintatica['pilha'].push(Number(analiseSintatica['acao'].replace('s', '')));
        //             analiseSintatica['fila'].shift();
        //         }else if(analiseSintatica['acao'][0] == 'a'){
        //             console.log('reconheceu');
        //             return true;
        //         }
        //         break;
        //     }
        // }

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
