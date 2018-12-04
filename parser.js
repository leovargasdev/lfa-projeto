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
    const regrasTratada = [];
    for(const r in regras){
        if(regras[r].match(/::=/)){
            const regra = regras[r].split('::=');
            regrasTratada.push({
                'reducao': regra[0].replace(/[ ]/g, ''),
                'valor': regra[1].replace(' ', '').split(' ')
            });
        }
    }
    // console.log(regrasTratada);
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
            const producao_estado = estados[s].replace(/[\']/g, '').split(' ');
            if(producao_estado[0] != ''){ // Ignora linhas vazias
                const token = producao_estado[0];
                result[estado][token] = {
                    'acao': producao_estado[1],
                    'estado': Number(producao_estado[2])
                };
            }
        }
    }
    return result;
};

module.exports = {
    execute,
};
