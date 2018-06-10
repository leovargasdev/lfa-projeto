const assert = require('assert');

const testaIgualdadeSets = (s1, s2) => {
    if (s1.size != s2.size) { return false; }

    const s1Elementos = Array.from(s1);
    for (const elemento of s1Elementos) {
        if (!s2.has(elemento)) { return false; }
    }

    return true;
};

const testaIgualdadeObjeto = (o1, o2) => {
    // quando está testando os estadosFinais
    if (o1.constructor.name == 'Set' && o2.constructor.name == 'Set') {
        return testaIgualdadeSets(o1, o2);
    };

    // quando está testando o autômato
    if (o1.constructor.name == 'Object' && o2.constructor.name == 'Object') {
        if (Object.keys(o1).length != Object.keys(o2).length) { return false; }

        for (const key in o1) {
            if (Object.keys(o1[key]).length != Object.keys(o2[key]).length) { return false; }

            for (const simboloTransicao in o1[key]) {
                if (!testaIgualdadeSets(o1[key][simboloTransicao], o2[key][simboloTransicao])) {
                    return false;
                }
            }
        };

        return true;
    };

    // quando não tá testando coisa igual
    return false;
};

describe('Testes gerais', function() {
    describe('#testaIgualdadeObjeto', function() {
        it('Deve testar corretamente um autômato', function(done) {
            const objetoPadrao = {
                A: {
                    a: new Set(['A', 'B'])
                },
                B: {}
            };
            const outroObjetoPadrao = {
                A: {
                    a: new Set(['A', 'B'])
                },
                B: {}
            };

            assert(testaIgualdadeObjeto(objetoPadrao, outroObjetoPadrao));
            done();
        });

        it('deve testar corretamento um Set', function(done) {
            const setPadrao = new Set(['A', 'B']);
            const outroSetPadrao = new Set(['A', 'B']);

            assert(testaIgualdadeObjeto(setPadrao, outroSetPadrao));
            done();
        });
    });

    describe('#testaIgualdadeSets', function () {
        it('retorna true para sets iguais', function(done) {
            assert(testaIgualdadeSets(new Set([1, 2, 3]), new Set([1, 2, 3])));
            done();
        });

        it('retorna false para sets com tamanhos diferentes', function(done) {
            assert(!testaIgualdadeSets(new Set([1, 2, 3]), new Set([1, 2])));
            done();
        });

        it('retorna false para sets com elementos diferentes', function(done) {
            assert(!testaIgualdadeSets(new Set([1, 2, 3]), new Set([1, 2, 4])));
            done();
        });

        it('retorna true para sets vazios', function(done) {
            assert(testaIgualdadeSets(new Set, new Set));
            done();
        });
    });
});

module.exports = {
    testaIgualdadeObjeto
};