const Parser = require('./parser');
const execute = (automato, analiseLexica) => {
    const parser = Parser.execute();
    console.log(parser);
};

module.exports = {
    execute
};
