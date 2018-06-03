const assert = require('assert');
const RemoveEpsilonProducoes = require('../remove_epsilon_producoes');
const Constantes = require ('../constantes');

describe('RemoveEpsilonProducoes', function () {
    describe('#execute', function() {
        // Se A Epsilon→ B e B a→ C, então A a→ C
        describe('adiciona as transições do estado destino às transições do estado origem', function () {
            let automato;
            let estadosFinais;

            beforeEach('reseta variáveis', function() {
                automato = {};
                estadosFinais = {};
            });

            it ('resolve transições simples', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: ['A'],
                        a: ['D']
                      },
                    A: { a: ['B', 'C'] },
                    B: {},
                    C: {},
                    D: {}
                };

                const automatoEsperado = {
                    S: { a: ['D', 'B', 'C'] },
                    A: { a: ['B', 'C'] },
                    B: {},
                    C: {},
                    D: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições para o próprio estado', function(done) {
                done('pending');
            });

            it('resolve transições duplas', function(done) {
                done('pending');
            });

            it ('resolve transições triplas', function(done) {
                done('pending');
            });
        });
    });


});