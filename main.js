const FileSystem = require('fs');

const CaminhoArquivo = 'arquivo.txt';
class InterpretaArquivoArgumentsError extends Error {};

const interpretaArquivo = (arquivo, objetoRetorno) => {
    const automatoFinitoNaoDeterministico = objetoRetorno['automato'];
    const estadosFinais = objetoRetorno['estadosFinais'];

    if (!automatoFinitoNaoDeterministico || !estadosFinais) {
        return InterpretaArquivoArgumentsError.new();
    }

    const linhas = arquivo.split('\n');
    let entrada = [];
    let estados = [];
    let tabelaTransicao = {};
    let controle = 0;
    linhas.forEach(function(linha) {
        if(!linha){
            controle++;
        } else if(controle){ // Se o controle estiver com zero, ainda é a entrada
            var l = linha.replace(' ', '').split('::=');
            var estado = (l[0].replace(/[<>]/g, '')).concat("n"+controle);
            estados.push(estado);
        } else {
            entrada.push(linha);
        }
    });
    console.log(" *** entrada ***\n" + entrada);
    console.log("\n *** estados ***\n" + estados);
};


// "Main" parte =======================================================
let arquivo;
let error;
const automatoFinitoNaoDeterministico = {};
const estadosFinais = [];

try {
    arquivo = FileSystem.readFileSync(CaminhoArquivo, 'utf8');
} catch (erro) {
        console.error("Could not open file: %s", erro);
        process.exitCode = 1;
}

error = interpretaArquivo(arquivo, {
    automato: automatoFinitoNaoDeterministico,
    estadosFinais: estadosFinais
});

if (error instanceof InterpretaArquivoArgumentsError) {
    console.log('Erro nos argumentos do interpretaArquivos');
    process.exitCode = 1;
}