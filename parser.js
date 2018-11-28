const ler = require('./lerArquivos');

const execute = () => {
    const{terminais, nTerminais, regras} = ler.execute(['terminais', 'nTerminais', 'regras']);
    console.log("terminais");
    console.log(terminais);
    console.log("nTerminais");
    console.log(nTerminais);
    console.log("regras");
    console.log(regras);
};

module.exports = {
    execute,
};
