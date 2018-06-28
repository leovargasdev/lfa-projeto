const assert = require('assert');
const AdicionaEstadoErro = require('../adiciona_estado_erro');
const Constantes = require('../constantes');

describe('AdicionaEstadoErro', function () {
    describe('#execute', function() {
        it('Preenche todas as transições do alfabeto com o estado de Erro', function (done) {
            const alfabeto = new Set(['a','b','c']);
            const entrada = {
              S: {
                a: new Set(['S']),
                b: new Set,
              }
            };
            const automatoEsperado = {
              S: {
                a: new Set(['S']),
                b: new Set([Constantes.ESTADO_ERRO]),
                c: new Set([Constantes.ESTADO_ERRO]),
            },
              [Constantes.ESTADO_ERRO]: {
                  a: new Set([Constantes.ESTADO_ERRO]),
                  b: new Set([Constantes.ESTADO_ERRO]),
                  c: new Set([Constantes.ESTADO_ERRO]),
              }
            };
            AdicionaEstadoErro.execute(entrada, alfabeto);
            assert.deepStrictEqual(entrada, automatoEsperado);
            done();
        });
    });
});
