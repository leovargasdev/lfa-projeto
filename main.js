const ConstroiAutomato = require('./constroi_automato');
const RemoveEpsilonProducoes = require('./remove_epsilon_producoes');
const DeterminizaAutomato = require('./determiniza_automato');
const MinimizaAutomato = require('./minimiza_automato');
const AdicionaEstadoErro = require('./adiciona_estado_erro');
const AnalizadorLexico = require('./analizador_lexico');

const tokens = 'inputs/tokens.in', gramatica = 'inputs/gramatica.in';
const automato = {}, analiseLexica = {};
const estadosFinais = new Set, alfabeto = new Set;

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

if (true) {
    ConstroiAutomato.execute(automato, estadosFinais, alfabeto, tokens);

    RemoveEpsilonProducoes.execute(automato, estadosFinais);

    DeterminizaAutomato.execute( automato, estadosFinais);

    MinimizaAutomato.execute(automato, estadosFinais);

    AdicionaEstadoErro.execute(automato, alfabeto);
}

AnalizadorLexico.execute(gramatica, automato, alfabeto, estadosFinais, analiseLexica);

if(analiseLexica['error']){
  for(k in analiseLexica['error']){
    console.log("[error] linha: ", analiseLexica['error'][k].linha, " rotulo: ", analiseLexica['error'][k].rotulo);
  }
}
