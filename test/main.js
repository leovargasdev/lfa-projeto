const assert = require('assert');
const MainFile = require('../main');

describe('Main', function () {
    describe('#interpretaRegra', function () {
        let automato;
        let estadosFinais;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = [];
        });

        it('adiciona transição normal ao objeto de retorno', function (done) {
            let automatoEsperado = { A0: { a: ['A0'] } };
            const regra = '<A>::=aA';
            const retorno = MainFile.interpretaRegra(regra, { automato, estadosFinais }, 0);

            assert.deepEqual(automatoEsperado, automato);
            assert.deepEqual([], estadosFinais);
            done();
        });

        it('marca como estado final quando há epsilon transição', function (done) {
            const regra = `<A>::=${MainFile.SIMBOLO_EPSILON}`;
            const retorno = MainFile.interpretaRegra(regra, { automato, estadosFinais }, 0);

            assert.deepEqual({ A0: {} }, automato);
            assert.deepEqual(['A0'], estadosFinais);
            done();
        });

        it('cria estado final quando é só símbolo terminal', function(done) {
            const regra = `<A>::=a`;
            const automatoEsperado = {
                A0: {
                    a: ['TaA0']
                },
                TaA0: {}
            };
            const retorno = MainFile.interpretaRegra(regra, { automato, estadosFinais }, 0);

            assert.deepEqual(automatoEsperado, automato);
            assert.deepEqual(['TaA0'], estadosFinais);
            done();
        });

        it('trata transição normal, com epsilon e com símbolo terminal', function(done) {
            const regra = `<A>::=a<A>|b|${MainFile.SIMBOLO_EPSILON}`;
            const automatoEsperado = {
                A0: {
                    a: ['A0'],
                    b: ['TbA0']
                },
                TbA0: {}
            };
            const estadosFinaisEsperado = ['TbA0', 'A0'];
            const retorno = MainFile.interpretaRegra(regra, { automato, estadosFinais }, 0);

            assert.deepEqual(automatoEsperado, automato);
            assert.deepEqual(estadosFinaisEsperado, estadosFinais);
            done();
        });
    });
});