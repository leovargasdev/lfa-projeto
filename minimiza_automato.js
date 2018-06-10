const estadosVisitados = new Set;

const execute = (automato, estadosFinais) => {
    removeEstadosInalcancaveis(automato, estadosFinais);
    removeEstadosMortos(automato, estadosFinais);
};

const removeEstadosInalcancaveis = (automato, estadosFinais) => {
    buscaProfundidadePadrao('S', automato);
    for (const estado in automato) {
        if (!estadosVisitados.has(estado)) {
            delete automato[estado];
            estadosFinais.delete(estado);
        }
    }
};

const buscaProfundidadePadrao = (estadoAtual, automato) => {
    estadosVisitados.add(estadoAtual);
    for (const transacao in automato[estadoAtual]) {
        const simboloVizinho = automato[estadoAtual][transacao].values().next().value;
        if (!estadosVisitados.has(simboloVizinho)) {
            buscaProfundidadePadrao(simboloVizinho, automato);
        }
    }
}

const removeEstadosMortos = (automato, estadosFinais) => {
    /** Sugestão de implementação (Avaliar se é boa):
    * Rodar uma DFS do tipo:
    const dfs = (estadoAtual, pilhaVisitacao, automato, estadosFinais, estadosMortos) => {
        let achouCaminhoNaoMorto = false;

        // Se é um estado final, então siginifica que o caminho que chegou até o
        // estadoAtual não é um caminho morto
        // if (estadosFinais.has(estadoatual)) return true;

        // Se estado atual está na pilha de visitacao, significa que a DFS já
        // passou por ele e ainda não achou um estado final, portanto esse CAMINHO
        // é morto
        if (pilhaVisitacao.indexOf(estadoAtual) >= 0) { return false; }

        // Se o estado atual já está adicionado aos estados mortos, não vale a
        // pena recomputar as condições.
        if (estadosMortos.indexOf(estadoAtual) >= 0) { return false; }

        // Para cada "vizinho" do estado, chamar a DFS e guardar o resultado na
        // variável booleana.
        for (const vizinho of automato[estadoAtual]) {
            achouCaminhoNaoMorto |= dfs(
                vizinho,
                [..pilhaVisitacao, estadoAtual],
                automato,
                estadosFinais,
                estadosMortos
            );
        }

        // Se nenhum dos caminhos a partir do estadoAtual é um caminho não morto,
        // o estadoAtual é adicionado ao vetor de estadosMortos
        if (!achouCaminhoNaoMorto) { estadosMortos.add(estadoAtual); }

        return achouCaminhoNaoMorto;
    }
    */
};

module.exports = {
    removeEstadosInalcancaveis,
    removeEstadosMortos,
    execute
};