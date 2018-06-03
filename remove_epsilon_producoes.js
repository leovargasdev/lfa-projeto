const Constantes = require('./constantes');

const execute = (automato, estadosFinais) => {
    let changed = true;

    while (changed) {
        changed = false;
        for (const estado in automato) {
            const transicoesEpsilon = automato[estado][Constantes.SIMBOLO_EPSILON];

            // Se não tem transição por epsilon, pula
            if (!transicoesEpsilon || transicoesEpsilon.size == 0) {
                continue;
            }

            // Pega todos os estados que são o destino da epsilon transição
            transicoesEpsilon.forEach((estadoTransicao) => {

                // Pega as transições do estado destino para adicionar ao estado origem
                for (const transicao in automato[estadoTransicao]) {
                    automato[estadoTransicao][transicao].forEach((estadoVizinhoEstadoTransicao) => {

                        // O estado pode não ter transições por esse símbolo terminal
                        automato[estado][transicao] = automato[estado][transicao] || new Set;

                        if (!automato[estado][transicao].has(estadoVizinhoEstadoTransicao)) {
                            changed = true; // Marca alteração para dar iterar novamente
                            automato[estado][transicao].add(estadoVizinhoEstadoTransicao);
                        }
                    });
                };
            });
        };
    };

    // Remove a chave epsilon dos estados do autômato
    for (const estado in automato) {
        delete automato[estado][Constantes.SIMBOLO_EPSILON];
    }
};

module.exports = {
    execute
};