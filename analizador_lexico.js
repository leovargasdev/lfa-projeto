const ler = require('./lerArquivos');

const execute = (automato, alfabeto, estadosFinais, analiseLexica, print) => {
    const {gramatica: arquivo} = ler.execute(['gramatica']);
    for(const l in arquivo){
        if(arquivo[l]){ // Ignora as linhas vazias com \n
            analiseLexica['linha' + l] = [];
            const linha = arquivo[l].split(' ');
            for(const r in linha){
                if(linha[r] != ''){
                    let estado = 'S', error = false;
                    for(const c in linha[r]){
                        const caracter = linha[r][c];
                        if(!alfabeto.has(caracter) || estado == "estadoERRO"){
                            error = true;
                            break;
                        }
                        estado = automato[estado][caracter].values().next().value;
                    }
                    // Caso o caracter não esteja no alfabeto ou seja o estado de ERROR
                    if(error || !estadosFinais.has(estado)){
                        analiseLexica['error'] = analiseLexica['error'] || [];
                        analiseLexica['error'].push({
                            linha: l,
                            rotulo: linha[r]
                        });
                    } else { // Caso seja um estado final, assim reconheceu o rotulo
                        analiseLexica['linha' + l].push({
                            rotulo: linha[r],
                            estado_final: estado,
                            token: trataToken(estado, linha[r])
                        });
                    }
                }
            }
        }
    }
    if(analiseLexica['error']){
        for(k in analiseLexica['error']){
            console.log("[error] linha: ", analiseLexica['error'][k].linha, " rotulo: ", analiseLexica['error'][k].rotulo);
        }
    } else {
        if(print)
            console.log("fita", JSON.stringify(analiseLexica, null, 4));
    }
};

const trataToken = (estado,rotulo) =>{
    if(estado.includes("int")) return "int";

    else if(estado.includes("float")) return "float";

    else if(estado.includes("var")) return "var";

    return rotulo;
}

module.exports = {
    execute
};
