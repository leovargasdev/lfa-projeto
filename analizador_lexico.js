const FileSystem = require('fs');

const execute = (caminhoArquivo, automato, alfabeto, estadosFinais, analizeLexica) => {
    const arquivo = trataAquivo(caminhoArquivo);
    for(let l in arquivo){
        if(arquivo[l]){ // Ignora as linhas vazias com \n
            analizeLexica['linha' + l] = [];
            const linha = arquivo[l].split(' ');
            for(p in linha){
                let estado = 'S', erro = false;
                for(let c in linha[p]){
                    const caracter = linha[p][c];
                    if(!alfabeto.has(caracter) || estado == "estadoERRO"){ // Caso o caracter não esteja no alfabeto ou seja o estado de ERROR
                        erro = true;
                        break;
                    }
                    estado = automato[estado][caracter];
                    estado = estado.values().next().value;
                }
                if(!estadosFinais.has(estado) || erro){
                    console.log("[error]\t" + linha[p] + " linha:" + (l));
                } else {
                    console.log("[ok]\t" + linha[p]);
                    analizeLexica['linha' + l].push({
                        rotulo: linha[p],
                        estado_final: estado
                    });
                }
            }
        }
    }
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
