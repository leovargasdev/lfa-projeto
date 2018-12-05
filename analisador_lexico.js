const ler = require('./lerArquivos');

const execute = (automato, alfabeto, estadosFinais, analiseLexica) => {
    const {gramatica: arquivo} = ler.execute(['gramatica']);
    for(const l in arquivo){
        // Ignora as linhas vazias
        if(arquivo[l]){
            // Usa o número da linha como índice
            analiseLexica['linha' + l] = [];
            const linha = arquivo[l].split(' ');
            // Percorre cada token/rotulo da linha
            for(const r in linha){
                // Garante que não vai considerar um espaço vazio como token, por exemplo um TAB
                if(linha[r] != ''){
                    let estado = 'S', error = false;
                    for(const c in linha[r]){
                        const caracter = linha[r][c];
                        // O caracter não está no alfabeto ou alcançou o estado de ERRO
                        if(!alfabeto.has(caracter) || estado == "estadoERRO"){
                            error = true;
                            break;
                        }
                        estado = automato[estado][caracter].values().next().value;
                    }
                    // Não alcançou o estado final ou ocorreu algum erro no reconhecimento do token
                    if(error || !estadosFinais.has(estado)){
                        analiseLexica['error'] = analiseLexica['error'] || [];
                        analiseLexica['error'].push({
                            linha: l,
                            rotulo: linha[r]
                        });
                    } else { // Reconheceu o token
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
    for(k in analiseLexica['error']){
        console.log("\n[error] Análise Léxica, token [", analiseLexica['error'][k].rotulo, "] não identificado");
        console.log("linha", analiseLexica['error'][k].linha + ":", arquivo[analiseLexica['error'][k].linha], "\n");
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
