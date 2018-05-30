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
            interpretaRegra(linhaAlterada, automato, estadosFinais, controle);
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
*
* A função não retorna nada.
* Os exemplos nas instruções vão levar em conta esses parâmetros:
* "<S>::=a<A>|b<B>|c", {}, [], 1
*/
const interpretaRegra = (regraCompleta, automato, estadosFinais, numeroControle)  => {
    const [estado, regra] = regraCompleta.split('::='); // ['<S>', 'a<A>|b<B>|c']
    let estadoRegra = estado.match(/<(.)>/)[1]; // S
    const transicoes = regra.split('|'); // ['a<A>', 'b<B>', 'c']

    // Se o símbolo que dá nome à regra não for S, um número é adicionado no sufixo do estado
    if (estadoRegra != 'S') {
        estadoRegra = `${estadoRegra}${numeroControle}`;
    }

    automato[estadoRegra] = automato[estadoRegra] || {}; // { S: {} }

    transicoes.forEach((transicao) => {
        // ['a<A>', 'a', 'A']
        const [_, simboloTransicao, estadoTransicao] = transicao.match(/(.)<?(.)?>?/);
        let estadoTransicaoControle = estadoTransicao; // A

        // Se é epsilon transição, marca como estado final
        if (simboloTransicao === SIMBOLO_EPSILON) {
            estadosFinais.push(estadoRegra);
            return;
        }

        automato[estadoRegra][simboloTransicao] = automato[estadoRegra][simboloTransicao] || []; // { S: { a: [] } }

        // Se é só símbolo terminal, cria estado final
        if (!estadoTransicaoControle) {
            const novoEstadoFinal = `T${simboloTransicao}${estadoRegra}`;
            estadosFinais.push(novoEstadoFinal);
            automato[estadoRegra][simboloTransicao].push(novoEstadoFinal);
            automato[novoEstadoFinal] = {};
            return;
        };

        // Adiciona número no nome de estado se não for o inicial
        if (estadoTransicaoControle != 'S') {
            estadoTransicaoControle = `${estadoTransicaoControle}${numeroControle}`;
        }

        // Adiciona transição normal
        automato[estadoRegra][simboloTransicao].push(estadoTransicaoControle);  // { S: { a: ['A'] } }
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