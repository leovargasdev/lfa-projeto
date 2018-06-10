const Constantes = require('./constantes');

const execute = (automato, estadosFinais) => {
    for (const estado in automato) {
        for (const simboloTransicao in automato[estado]) {
            let novoEstado;
            let estadosDestinos = Array.from(automato[estado][simboloTransicao]);
            estadosDestinos = estadosDestinos.sort();


            if (estadosDestinos.length <= 1) {
                continue;
            }

            novoEstado = estadosDestinos.join(Constantes.SIMBOLO_SEPARADOR);
            automato[novoEstado] = automato[novoEstado] || {};

            // Passa as transições dos estados "mesclados" para o novo estado
            estadosDestinos.forEach((estadoDestino) => {
                for (const simboloTransicao in automato[estadoDestino]) {
                    automato[novoEstado][simboloTransicao] = automato[novoEstado][simboloTransicao] || new Set;
                    automato[estadoDestino][simboloTransicao].forEach((proximoEstado) => {
                        automato[novoEstado][simboloTransicao].add(proximoEstado);
                    });
                }

                // Se algum dos estados mesclados for final, novoEstado também é
                if (estadosFinais.has(estadoDestino)) {
                    estadosFinais.add(novoEstado);
                }
            });

            // Transição agora vai somente para o novo estado
            automato[estado][simboloTransicao].clear()
            automato[estado][simboloTransicao].add(novoEstado)
        }
    }
};

module.exports = {
    execute
};