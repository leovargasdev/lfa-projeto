const FileSystem = require('fs');

const execute = (arquivos) => {
    const result = {};
    for(const a in arquivos){
        let error, arquivo;
        const ca = ('inputs/' + arquivos[a] + '.in'); // Caminho completro arquivo
        try {
            arquivo = FileSystem.readFileSync(ca, 'utf8');
        } catch (erro) {
            console.error("Could not open file: %s", erro);
            process.exitCode = 1;
        }
        result[arquivos[a]] = arquivo.split('\n');
    }
    return result;
};

module.exports = { execute };
