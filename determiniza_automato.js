const Constantes = require('./constantes');

const execute = (automato, estadosFinais) => {
    let alterou = true;
    while (alterou) {
        alterou = false;

        for (const estado in automato) {
            for (const simboloTransicao in automato[estado]) {
                let novoEstado;
                let estadosDestinos = Array.from(automato[estado][simboloTransicao]);
                estadosDestinos = estadosDestinos.sort();

                // Se não tem indeterminização na transição, vai pro próximo
                if (estadosDestinos.length <= 1) {
                    continue;
                }

                alterou = true;
                novoEstado = estadosDestinos.join(Constantes.SIMBOLO_SEPARADOR);
                automato[novoEstado] = automato[novoEstado] || {};

                // Passa as transições dos estados "mesclados" para o novo estado
                estadosDestinos.forEach((estadoDestino) => {
                    for (const novaTransicao in automato[estadoDestino]) {
                        automato[novoEstado][novaTransicao] = automato[novoEstado][novaTransicao] || new Set;
                        automato[estadoDestino][novaTransicao].forEach((proximoEstado) => {
                            automato[novoEstado][novaTransicao].add(proximoEstado);
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
    }
};

module.exports = {
    execute
};