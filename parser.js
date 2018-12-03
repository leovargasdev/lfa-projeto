const ler = require('./lerArquivos');

const execute = () => {
    const{terminais, nTerminais, regras} = ler.execute(['terminais', 'nTerminais', 'regras']);
    if(terminais) console.log("terminais [ ok ! ]");
    if(nTerminais) console.log("nTerminais [ ok ! ]");
    if(regras) console.log("regras [ ok ! ]");
};

module.exports = {
    execute,
};
