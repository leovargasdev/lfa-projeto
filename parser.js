const ler = require('./lerArquivos');

const execute = () => {
    let {terminais, nTerminais, regras} = ler.execute(['terminais', 'nTerminais', 'regras']);
    regras = trataRegras(regras);
    console.log("regras:", regras);
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
}

module.exports = {
    execute,
};
