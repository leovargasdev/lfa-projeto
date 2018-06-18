
const execute = (automato, alfabeto) => {
    criaEstadoErro(automato, alfabeto); // Pega todos os possiveis simbolos e cria o estado de erro.
    incluiEstadoErro(automato, alfabeto); // Simbolos que ainda não estavam sendo listados na regra agora são inseridos com destino ao estado de erro.
};

const criaEstadoErro = (automato, alfabeto) => {
    let estado = "estadoERRO";
    automato[estado] = {}; // Inserindo o Estado de erro no automato
    alfabeto.forEach((simbolo) => {
        automato[estado][simbolo] = new Set; // A cada simbolo criando um set
        automato[estado][simbolo].add(estado);
    });
};

const incluiEstadoErro = (automato, alfabeto) => {
    for(const estado in automato){
        alfabeto.forEach((simbolo) => {
            if(!automato[estado][simbolo]){
                automato[estado][simbolo] = new Set;
                automato[estado][simbolo].add("estadoERRO");
            }
        });
    }
};

module.exports = {
    execute,
    criaEstadoErro
};
