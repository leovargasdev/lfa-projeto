const FileSystem = require('fs');
const DEBUG_MODE = false;
const SIMBOLO_EPSILON = 'ε';

const CaminhoArquivo = 'arquivo2.txt';
class InterpretaArquivoArgumentsError extends Error {};

class Regra{
    constructor(nome, lArquivo){
        this.linhaArquivo = lArquivo;
        this.regra = nome;
        this.producoes = [];
    }
}

class Automato{
    constructor(){
        this.regras = [];
    }
    addRegra(novaRegra, producoes){
        this.regras.push(novaRegra);
        this.regras[this.regras.length - 1].producoes = producoes;
    }
}

const interpretaArquivo = (arquivo, entrada, tabelao) => {
    const linhasArquivo = arquivo.split('\n');
    let controle = 0;
    linhasArquivo.forEach((linhaArquivo) => {
        if (!linhaArquivo)
            controle++;
        else if (controle) // Se o controle estiver com zero, ainda é a entrada
            interpretaRegra(linhaArquivo, controle, tabelao);
        else
            entrada.push(linhaArquivo);
    });
};

const interpretaRegra = (regraCompleta, nControle, tabelao)  => {
    let aux = []
    const [nomeR, sentencas] = regraCompleta.replace(/ /g, '').split('::=');
    let nome = nomeR.replace(/[<>]/g, '');

    if (nome != 'S')
        nome = `${nome}${nControle}`;

    sentencas.split('|').forEach((transicao) => {
        const [valor, e] = transicao.split("<");
        let estado = e || "END";
        let novoEstado = true;
        estado = estado.split('>')[0];
        if (estado != 'S')
            estado = `${estado}${nControle}`;

        aux.forEach((item) => {
            if(item['estado'] == estado){
                item['valor'].push(valor);
                novoEstado = false;
                // Descobrir como para o forEach
            }
        });

        if(novoEstado){
            aux.push({estado: estado, valor: []});
            aux[aux.length - 1]['valor'].push(valor);
        }
        
    });

    tabelao.addRegra(new Regra(nome,regraCompleta), aux);
};

//                  ** MAIN PROGRAMA **
let arquivo;
let error;
let tabelao = new Automato();
let entrada = [];

try {
    arquivo = FileSystem.readFileSync(CaminhoArquivo, 'utf8');
} catch (erro) {
        console.error("Could not open file: %s", erro);
        process.exitCode = 1;
}

error = interpretaArquivo(arquivo, entrada, tabelao);

console.log("entrada:\n" + entrada + "\n");

console.log(JSON.stringify(tabelao.regras, null, 2));

if (error instanceof InterpretaArquivoArgumentsError) {
    console.log('Erro nos argumentos do interpretaArquivos');
    process.exitCode = 1;
}

module.exports = {
    interpretaRegra,
    SIMBOLO_EPSILON
};
