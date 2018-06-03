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
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: ['S'],
                        a: ['D']
                      },
                    D: {}
                };

                const automatoEsperado = {
                    S: { a: ['D'] },
                    D: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições duplas', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: ['A'],
                        e: ['E'],
                      },
                    A: {
                        [Constantes.SIMBOLO_EPSILON]: ['B'],
                        f: ['F'],
                    },
                    B: {
                        c: ['C'],
                        d: ['D'],
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {}
                };

                const automatoEsperado = {
                    S: {
                        c: ['C'],
                        d: ['D'],
                        e: ['E'],
                      },
                    A: {
                        c: ['C'],
                        d: ['D'],
                        f: ['F'],
                    },
                    B: {
                        c: ['C'],
                        d: ['D'],
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições triplas', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: ['A'],
                        e: ['E'],
                      },
                    A: {
                        [Constantes.SIMBOLO_EPSILON]: ['B'],
                        f: ['F'],
                    },
                    B: {
                        c: ['C'],
                        d: ['D'],
                        [Constantes.SIMBOLO_EPSILON]: ['G']
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {},
                    G: { h: ['H'], }
                };

                const automatoEsperado = {
                    S: {
                        c: ['C'],
                        d: ['D'],
                        e: ['E'],
                        h: ['H'],
                      },
                    A: {
                        c: ['C'],
                        d: ['D'],
                        f: ['F'],
                        h: ['H'],
                    },
                    B: {
                        c: ['C'],
                        d: ['D'],
                        h: ['H'],
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {},
                    G: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepEqual(automato, automatoEsperado);
                done();
            });

            it('resolve quando há indeterminismo na epsilon produção', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: ['A', 'C'],
                    },
                    A: { b: ['B'], },
                    B: {},
                    C: { d: ['D'], },
                    D: {},
                };

                const automatoEsperado = {
                    S: {
                        b: ['B'],
                        d: ['D'],
                      },
                    A: { b: ['B'], },
                    B: {},
                    C: { d: ['D'], },
                    D: {},
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepEqual(automato, automatoEsperado);
                done();
            });
        });
    });


});