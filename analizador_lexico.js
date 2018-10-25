const FileSystem = require('fs');

const execute = (caminhoArquivo, analizeLexica) => {
    const arquivo = trataAquivo(caminhoArquivo);
    for(let linha in arquivo){
        if(arquivo[linha]){ // Ignora as linhas vazias com \n
            analizeLexica['linha' + linha] = [];
            let rotulo = "", aux = [' ', ',', '\n'];
            for(let caracter in arquivo[linha]){
                if(aux.includes(arquivo[linha][caracter])){
                    console.log(rotulo);
                }
                if(!aux.includes(arquivo[linha][caracter])){
                    rotulo += arquivo[linha][caracter];
                } else {
                    analizeLexica['linha' + linha].push({
                        rotulo: rotulo,
                        estado: 0,
                        token: ""
                    });
                    rotulo = "";
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
