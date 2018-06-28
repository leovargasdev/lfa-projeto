const Constantes = require('./constantes');

const execute = (automato, alfabeto) => {
    automato[Constantes.ESTADO_ERRO] = {}; // Inserindo o Estado de erro no automato
    incluiEstadoErro(automato, alfabeto); // Simbolos que ainda não estavam sendo listados na regra agora são inseridos com destino ao estado de erro.
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
    incluiEstadoErro
};
