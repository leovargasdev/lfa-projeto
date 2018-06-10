const Constantes = require('./constantes');

/** Para efeitos de entendimento:
* estado origem: Estado que possui a Epsilon produção
* estado destino: Estado que é alcançado pegando a epsilon produção a partir do estado origem
*/
const execute = (automato, estadosFinais) => {
    let changed = true;

    while (changed) {
        changed = false;
        for (const estadoOrigem in automato) {
            const transicoesEpsilon = automato[estadoOrigem][Constantes.SIMBOLO_EPSILON];

            // Se não tem transição por epsilon, pula
            if (!transicoesEpsilon || transicoesEpsilon.size == 0) {
                continue;
            }

            // Pega todos os estados destinos da epsilon transição
            transicoesEpsilon.forEach((estadoDestino) => {

                // Pega as transições do estado destino para adicionar ao estado origem
                for (const transicao in automato[estadoDestino]) {
                    automato[estadoDestino][transicao].forEach((estadoVizinhoEstadoTransicao) => {

                        // Inicializa a transição caso esta não exista
                        automato[estadoOrigem][transicao] = automato[estadoOrigem][transicao] || new Set;

                        if (!automato[estadoOrigem][transicao].has(estadoVizinhoEstadoTransicao)) {
                            changed = true; // Marca alteração para iterar novamente
                            automato[estadoOrigem][transicao].add(estadoVizinhoEstadoTransicao);
                        }
                    });
                };

                // Adiciona estado origem aos estados finais caso o estado destino seja final
                if (estadosFinais.has(estadoDestino)) {
                    estadosFinais.add(estadoOrigem);
                }
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