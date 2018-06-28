const Constantes = require('./constantes');

const execute = (automato, alfabeto) => {
    criaEstadoErro(automato, alfabeto); // Pega todos os possiveis simbolos e cria o estado de erro.
    incluiEstadoErro(automato, alfabeto); // Simbolos que ainda não estavam sendo listados na regra agora são inseridos com destino ao estado de erro.
};

const criaEstadoErro = (automato, alfabeto) => {
    automato[Constantes.ESTADO_ERRO] = {}; // Inserindo o Estado de erro no automato
    alfabeto.forEach((simbolo) => {
        automato[Constantes.ESTADO_ERRO][simbolo] = new Set; // A cada simbolo criando um set
        automato[Constantes.ESTADO_ERRO][simbolo].add(Constantes.ESTADO_ERRO);
    });
};

const incluiEstadoErro = (automato, alfabeto) => {
    for(const estado in automato){
        alfabeto.forEach((simbolo) => {
            if(!automato[estado][simbolo] || !automato[estado][simbolo].size){
                automato[estado][simbolo] = new Set([Constantes.ESTADO_ERRO]);
            }
        });
    }
};

module.exports = {
    execute,
    criaEstadoErro,
    incluiEstadoErro
};
