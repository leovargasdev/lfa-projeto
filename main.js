var ler = require('fs');

ler.readFile('arquivo.txt', 'utf8' ,function(erro, linhas){
    if(erro) {
        console.error("Could not open file: %s", erro);
        process.exit(1);
    }
    var linha = linhas.split('\n');
    for (var k = 0; k < linha.length; k++){
        if(linha[k])
            console.log("linha nº " + k + ": " + linha[k]);
        else
            console.log("linha nº " + k + ": NULL");
    }
	console.log("\n\n *** Todas Linhas ***\n\n" + linhas);
});
