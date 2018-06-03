let DEBUG_MODE = false;
DEBUG_MODE = true;
const ConstroiAutomato = require('./constroi_automato');
const RemoveEpsilonProducoes = require('./remove_epsilon_producoes');

const CaminhoArquivo = 'arquivo.in';
const automato = {};
const estadosFinais = new Set;

ConstroiAutomato.execute(
    automato,
    estadosFinais,
    CaminhoArquivo
);

RemoveEpsilonProducoes.execute(
    automato,
    estadosFinais
);

// DeterminizaAutomato.execute(
//     automato,
//     estadosFinais
// );

// MinimizaAutomato.execute(
//     automato,
//     estadosFinais
// );

if (DEBUG_MODE) {
    console.log('=============================================');
    console.log('Autômato Finito Não-Determinístico: ', automato);
    console.log('=============================================');
    console.log('Estados Finais: ', estadosFinais);
    console.log('=============================================');
}