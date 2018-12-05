const ConstroiAutomato = require('./constroi_automato');
const RemoveEpsilonProducoes = require('./remove_epsilon_producoes');
const DeterminizaAutomato = require('./determiniza_automato');
const MinimizaAutomato = require('./minimiza_automato');
const AdicionaEstadoErro = require('./adiciona_estado_erro');
const AnalisadorLexico = require('./analisador_lexico');
const AnalisadorSintatico = require('./analisador_sintatico');

const tokens = 'inputs/tokens.in';
const automato = {}, analiseLexica = {}, analiseSintatica = {};
const estadosFinais = new Set, alfabeto = new Set;

ConstroiAutomato.execute(automato, estadosFinais, alfabeto, tokens);

RemoveEpsilonProducoes.execute(automato, estadosFinais);

DeterminizaAutomato.execute(automato, estadosFinais);

MinimizaAutomato.execute(automato, estadosFinais);

AdicionaEstadoErro.execute(automato, alfabeto);

AnalisadorLexico.execute(automato, alfabeto, estadosFinais, analiseLexica);

// Caso ocorrer algum erro na análise léxica não executa a análise sintática
if(!analiseLexica['error']){
    if(false){
        console.log("fita", JSON.stringify(analiseLexica, null, 4));
    }
    AnalisadorSintatico.execute(automato, analiseLexica, analiseSintatica)
}


const imprimeAutomato = (automato, alfabeto, estadosFinais, mensagem) => {
    console.log("\n\n\033[31m" + mensagem + "\033[0m");
    console.log('\033[32m================= Automato =================\033[0m');
    console.log(automato);
    console.log('\033[32m================= Estados Finais: =================\033[0m');
    estadosFinais.forEach(ef => (console.log(ef + "   ")));
    console.log('\n\n\033[32m================= Alfabeto: =================\033[0m');
    console.log(Array.from(alfabeto).sort().join(", "));//.forEach(s => (console.log(s + "  ")));
    console.log("\n");
};
