const FileSystem = require('fs');

const execute = (caminhoArquivo) => {
    const arquivo = trataAquivo(caminhoArquivo);
    for(let a in arquivo){
        if(arquivo[a])
            console.log("linha: " + a + ", conteudo: " + arquivo[a]);
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
