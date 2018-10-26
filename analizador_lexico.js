const FileSystem = require('fs');

const execute = (caminhoArquivo, automato, alfabeto, estadosFinais, analizeLexica) => {
    const arquivo = trataAquivo(caminhoArquivo);
    for(let linha in arquivo){
        if(arquivo[linha]){ // Ignora as linhas vazias com \n
            analizeLexica['linha' + linha] = [];
            let estado = 'S', error = false;
            for(let c in arquivo[linha]){
                const caracter = arquivo[linha][c];
                if(confereAlfabeto(alfabeto, caracter)){
                    estado = automato[estado][caracter];
                    estado = estado.values().next().value;
                    if(estado == "estadoERRO"){
                        error = true;
                    }
                } else {
                    error = true;
                }
                if(error){
                    console.log("error lexico, linha:" + linha);
                    return;
                }
            }
        }
    }
};

const confereAlfabeto = (alfabeto, caracter) => {
    for(let a of alfabeto)
        if(a == caracter)
            return true;
    return false;
};

const trataAquivo = (caminhoArquivo) =>{
    let arquivo, error;
    try {
        arquivo = FileSystem.readFileSync(caminhoArquivo, 'utf8');
    } catch (erro) {
            console.error("Could not open file: %s", erro);
            process.exitCode = 1;
    }
    return arquivo.split("\n");
}


module.exports = {
    execute
};
