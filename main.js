const FileSystem = require('fs');

const CaminhoArquivo = 'arquivo.txt';

const interpretaArquivo = (erro, arquivo) => {
    if (erro) {
        console.error("Could not open file: %s", erro);
        process.exit(1);
    }

    var linhas = arquivo.split('\n');
    var entrada = [], estados = [];
    var controle = 0;
    linhas.forEach(function(linha) {
        if(!linha){
            controle++;
        } else if(controle){ // Se o controle estiver com zero, ainda é a entrada
            var l = linha.replace(' ', '').split(':');
            var estado = (l[0].replace(/[<>]/g, '')).concat("n"+controle);
            estados.push(estado);
        } else {
            entrada.push(linha);
        }
    });
    console.log(" *** entrada ***\n" + entrada);
    console.log("\n *** estados ***\n" + estados);
};

FileSystem.readFile(CaminhoArquivo, 'utf8' ,interpretaArquivo);