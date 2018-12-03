const ler = require('./lerArquivos');

const execute = () => {
    let {terminais, nTerminais, regras, estados} = ler.execute(['terminais', 'nTerminais', 'regras', 'estados']);
    regras = trataRegras(regras);
    terminais = trataTerminais(terminais);
    nTerminais = trataTerminais(nTerminais);
    estados = trataEstados(estados);
    return { regras, terminais, nTerminais, estados};
};

const trataRegras = (regras) =>{
    const regrasTratada = {}
    let contador = 0;
    for(const r in regras){
        if(regras[r].match(/::=/)){
            regrasTratada['r' + contador] = regras[r].split('::=');
            contador++;
        }
    }
    return regrasTratada;
};

const trataTerminais = (file) =>{
    const result = new Set;
    // Percorre linha por linha do arquivo
    for(const f in file){
        result.add(file[f].replace(/[<> ]/g, ''));
    }
    return result;
};

const trataEstados = (estados) =>{
    let estado = '', result = {};
    for(const s in estados){
        if(estados[s].includes("State")){
            if(!estados[s].includes("Prior States")){
                estado = estados[s].replace(' ','\_');
                result[estado] = result[estado] || [];
            }
        } else {
            const aux = estados[s].replace(/[\']/g, '');
            if(aux != ''){
                result[estado].push(aux);
            }
        }
    }
    return result;
};

module.exports = {
    execute,
};
