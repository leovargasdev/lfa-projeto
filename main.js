// Configurar o código =============
let DEBUG_MODE = false; //DEBUG_MODE = true;
let IMPRIME_APOS_CONSTRUCAO = false;// IMPRIME_APOS_CONSTRUCAO = true;
let IMPRIME_APOS_REMOVER_EPSILON_PRODUCOES = false;// IMPRIME_APOS_REMOVER_EPSILON_PRODUCOES = true;
let IMPRIME_APOS_DETERMINIZACAO = false;// IMPRIME_APOS_DETERMINIZACAO = true;
let IMPRIME_AUTOMATO_FINAL = false; IMPRIME_AUTOMATO_FINAL = true;

// =================================


const ConstroiAutomato = require('./constroi_automato');
const RemoveEpsilonProducoes = require('./remove_epsilon_producoes');
const DeterminizaAutomato = require('./determiniza_automato');
const MinimizaAutomato = require('./minimiza_automato');

const CaminhoArquivo = 'arquivo.in';
const automato = {};
const estadosFinais = new Set;
const alfabeto = new Set;

const imprimeAutomato = (automato, alfabeto, estadosFinais, mensagem) => {
    console.log("\n\n\033[31m" + mensagem + "\033[0m");
    console.log('\033[32m================= Automato =================\033[0m');
    console.log(automato);
    console.log('\033[32m================= Estados Finais: =================\033[0m');
    console.log(estadosFinais);
    console.log('\033[32m================= Alfabeto: =================\033[0m');
    console.log(alfabeto);
};

ConstroiAutomato.execute(
    automato,
    estadosFinais,
    alfabeto,
    CaminhoArquivo
);

if (IMPRIME_APOS_CONSTRUCAO) {
    imprimeAutomato(
        automato,
        alfabeto,
        estadosFinais,
        'Resultados depois da construção do autômato'
    );
}

RemoveEpsilonProducoes.execute(
    automato,
    estadosFinais
);

if (IMPRIME_APOS_REMOVER_EPSILON_PRODUCOES) {
    imprimeAutomato(
        automato,
        alfabeto,
        estadosFinais,
        'Resultados depois da remoção de epsilon produções do autômato'
    );
}

DeterminizaAutomato.execute(
    automato,
    estadosFinais
);

if (IMPRIME_APOS_DETERMINIZACAO) {
    imprimeAutomato(
        automato,
        alfabeto,
        estadosFinais,
        'Resultados depois da determinização do autômato'
    );
}

MinimizaAutomato.execute(
    automato,
    estadosFinais
);

if (IMPRIME_AUTOMATO_FINAL) {
    imprimeAutomato(
        automato,
        alfabeto,
        estadosFinais,
        'Resultado final'
    );
}

// AdicionaEstadoErro.execute(automato, estadosFinais);
