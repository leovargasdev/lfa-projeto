const ler = require('./lerArquivos');

const execute = () => {
    let {terminais, nTerminais, regras} = ler.execute(['terminais', 'nTerminais', 'regras']);
    regras = trataRegras(regras);
    terminais = trataTerminais(terminais);
    nTerminais = trataTerminais(nTerminais);
    console.log("regras:", regras);
    console.log("nTerminais:", nTerminais);
    console.log("terminais:", terminais);
};

const trataRegras = (regras) =>{
    const regrasTratada = {};
    for(const r in regras){
        if(regras[r].match(/::=/)){
            let [regra, producao] = regras[r].split('::=');
            regra = regra.replace(/[<> ]/g, '');
            regrasTratada[regra] = regrasTratada[regra] || [];
            regrasTratada[regra].push(producao)
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

module.exports = {
    execute,
};
