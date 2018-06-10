const execute = (automato, estadosFinais) => {
    removeEstadosInalcancaveis(automato, estadosFinais);
    removeEstadosMortos(automato, estadosFinais);
};

const removeEstadosInalcancaveis = (automato, estadosFinais) => {
    const estadosVisitados = new Set;
    buscaProfundidadePadrao('S', automato, estadosVisitados);
    for (const estado in automato) {
        if (!estadosVisitados.has(estado)) {
            removeEstado(estado, automato, estadosFinais);
        }
    }
};

const removeEstadosMortos = (automato, estadosFinais) => {
    const estadosMortos = new Set;
    for(const estado in automato) {
        let estadoMorto;

        estadoMorto = checaEstadoMorto(estado, automato, estadosFinais, []);

        if (estadoMorto) { estadosMortos.add(estado); }

    }

    for (const estado of estadosMortos) {
        removeEstado(estado, automato, estadosFinais);
    }
};

const removeEstado = (estado, automato, estadosFinais) => {
    // Remove as transições
    for (const outroEstado in automato) {
        const transicoes = Object.keys(automato[outroEstado]);
        transicoes.forEach((transicao) => {
            const proximoEstado = automato[outroEstado][transicao].values().next().value;

            if (proximoEstado == estado) {
                delete automato[outroEstado][transicao];
            }
        });
    };

    delete automato[estado];

    estadosFinais.delete(estado);
};

const buscaProfundidadePadrao = (estadoAtual, automato, estadosVisitados) => {
    estadosVisitados.add(estadoAtual);
    for (const transicao in automato[estadoAtual]) {
        const simboloVizinho = automato[estadoAtual][transicao].values().next().value;
        if (!estadosVisitados.has(simboloVizinho)) {
            buscaProfundidadePadrao(simboloVizinho, automato, estadosVisitados);
        }
    }
};

const checaEstadoMorto = (estadoAtual, automato, estadosFinais, pilhaVisitacao) => {
    // Se já foi visitado, retorna resultado neutro
    if (pilhaVisitacao.indexOf(estadoAtual) >= 0) {
        return true;
    }

    // Se é final, não é morto
    if (estadosFinais.has(estadoAtual)) {
        return false;
    }

    for (const transicao in automato[estadoAtual]) {
        const simboloVizinho = automato[estadoAtual][transicao].values().next().value;
        const estadoMorto = checaEstadoMorto(simboloVizinho,
                                              automato,
                                              estadosFinais,
                                              [...pilhaVisitacao, estadoAtual]
                                             );

        if (!estadoMorto) { return false; }
    }

    return true;
};

module.exports = {
    removeEstadosInalcancaveis,
    removeEstadosMortos,
    execute
};