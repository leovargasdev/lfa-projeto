const ler = require('./lerArquivos');

const execute = (automato, alfabeto, estadosFinais, analiseLexica) => {
    const {gramatica: arquivo} = ler.execute(['gramatica']);
    // console.log(estadosFinais);
    for(const l in arquivo){
        if(arquivo[l]){ // Ignora as linhas vazias com \n
            analiseLexica['linha' + l] = [];
            const linha = arquivo[l].replace(/ /g, '');
            let estado = 'S', rotulo = '';
            for(const c in linha){
                const caracter = linha[c];
                estado = automato[estado][caracter].values().next().value;
                rotulo += caracter;
                if(!alfabeto.has(caracter) || estado == "estadoERRO"){ // Caso o caracter não esteja no alfabeto ou seja o estado de ERROR
                    analiseLexica['error'] = analiseLexica['error'] || [];
                    analiseLexica['error'].push({
                        linha: l,
                        rotulo: rotulo
                    });
                    estado = 'S';
                    rotulo = '';
                } else if(estadosFinais.has(estado)){ // Caso seja um estado final, assim reconheceu o rotulo
                    if(verifica_prox_estado(automato[estado][linha[Number(c)+1]])){
                        analiseLexica['linha' + l].push({
                            rotulo: rotulo,
                            estado_final: estado,
                            token: trataToken(estado, rotulo)
                        });
                        estado = 'S';
                        rotulo = '';
                    }
                }
            }
        }
    }
    console.log("analiseLexica", analiseLexica);
};
const trataToken = (estado,rotulo) =>{
    if(estado.includes("int")) return "int";

    else if(estado.includes("float")) return "float";

    else if(estado.includes("var")) return "var";

    return rotulo;
}

const verifica_prox_estado = (estado) =>{
    if(!estado){
        return true;
    }
    console.log("estado:", estado);
    estado = estado.values().next().value
    if(estado.includes("float") || estado.includes("var") || estado.includes("int")){
        return false;
    }
    return true;
};

module.exports = {
    execute
};
