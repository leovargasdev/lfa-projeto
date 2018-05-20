const FileSystem = require('fs');
const DEBUG_MODE = false;
const SIMBOLO_EPSILON = 'ε';

const CaminhoArquivo = 'arquivo.txt';
class InterpretaArquivoArgumentsError extends Error {};

const interpretaArquivo = (arquivo, objetoRetorno) => {
    const automato = objetoRetorno['automato'];
    const estadosFinais = objetoRetorno['estadosFinais'];

    if (!automatoFinitoNaoDeterministico || !estadosFinais) {
        return InterpretaArquivoArgumentsError.new();
    }

    const linhasArquivo = arquivo.split('\n');
    let entrada = [];
    let estados = [];
    let tabelaTransicao = {};
    let controle = 0;
    linhasArquivo.forEach((linhaArquivo) => {
        let linhaAlterada = linhaArquivo.replace(' ', '');
        if (!linhaAlterada) { return; }
        if (linhaAlterada.match(/<.>::=/)) {
            interpretaRegra(linhaAlterada, {
                automato,
                estadosFinais,
                numeroControle: controle
            });
        } else {
            // interpretaToken(linhaAlterada);
        }
        // if (!linha){
        //     controle++;
        // } else if (controle) { // Se o controle estiver com zero, ainda é a entrada
        //     var l = linha.replace(' ', '').split('::=');
        //     var estado = (l[0].replace(/[<>]/g, '')).concat("n"+controle);
        //     estados.push(estado);
        // } else {
        //     entrada.push(linha);
        // }
    });
    // console.log(" *** entrada ***\n" + entrada);
    // console.log("\n *** estados ***\n" + estados);
};

/**
* regraCompleta: Uma string no formato padrão de regras, sem espaço. Exemplo: <A>::=a<A>|b<B>|ε
* objetoRetorno: {
*    automato: Objeto que guarda o autômato onde as transições da regra serão salvas
*    estadosFinais: Array que contém os estados finais do autômato presente em +autômato+
* }
* numeroControle: Um inteiro que servirá de sufixo para os estados presentes na +regraCompleta+
*/
const interpretaRegra = (regraCompleta, objetoRetorno, numeroControle)  => {
    const [estado, regra] = regraCompleta.split('::=');
    const estadoRegra = `${estado.match(/<(.)>/)[1]}${numeroControle}`;
    objetoRetorno.automato[estadoRegra] = {};

    regra.split('|').forEach((transicao) => {
        const [_, simboloTransicao, estadoTransicao] = transicao.match(/(.)<?(.)?>?/);
        estadoTransicaoControle = `${estadoTransicao}${numeroControle}`;

        // Se é epsilon transição, marca como estado final
        if (simboloTransicao === SIMBOLO_EPSILON) {
            objetoRetorno.estadosFinais.push(estadoRegra);
            return;
        }

        objetoRetorno.automato[estadoRegra][simboloTransicao] = objetoRetorno.automato[estadoRegra][simboloTransicao] || [];

        // Se é só símbolo terminal, cria estado final
        if (!estadoTransicao) {
            const novoEstadoFinal = `T${simboloTransicao}${estadoRegra}`;
            objetoRetorno.estadosFinais.push(novoEstadoFinal);
            objetoRetorno.automato[estadoRegra][simboloTransicao].push(novoEstadoFinal);
            objetoRetorno.automato[novoEstadoFinal] = {};
            return;
        };

        // Adiciona transição normal
        objetoRetorno.automato[estadoRegra][simboloTransicao].push(estadoTransicaoControle);
    });
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
    estadosFinais,
    automato: automatoFinitoNaoDeterministico
});

if (error instanceof InterpretaArquivoArgumentsError) {
    console.log('Erro nos argumentos do interpretaArquivos');
    process.exitCode = 1;
}

module.exports = {
    interpretaRegra,
    SIMBOLO_EPSILON
};