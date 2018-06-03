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
                        [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        a: new Set(['D'])
                      },
                    A: { a: new Set(['B', 'C']) },
                    B: {},
                    C: {},
                    D: {}
                };

                const automatoEsperado = {
                    S: { a: new Set(['D', 'B', 'C']) },
                    A: { a: new Set(['B', 'C']) },
                    B: {},
                    C: {},
                    D: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepStrictEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições para o próprio estado', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['S']),
                        a: new Set(['D'])
                      },
                    D: {}
                };

                const automatoEsperado = {
                    S: { a: new Set(['D']) },
                    D: {}
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepStrictEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições duplas', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        e: new Set(['E']),
                      },
                    A: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['B']),
                        f: new Set(['F']),
                    },
                    B: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {}
                };

                const automatoEsperado = {
                    S: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        e: new Set(['E']),
                      },
                    A: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        f: new Set(['F']),
                    },
                    B: {
                        c: new Set(['C']),
                        d: new Set(['D']),
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
                assert.deepStrictEqual(automato, automatoEsperado);
                done();
            });

            it('resolve transições triplas', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        e: new Set(['E']),
                      },
                    A: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['B']),
                        f: new Set(['F']),
                    },
                    B: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        [Constantes.SIMBOLO_EPSILON]: new Set(['G'])
                    },
                    C: {},
                    D: {},
                    E: {},
                    F: {},
                    G: { h: new Set(['H']), }
                };

                const automatoEsperado = {
                    S: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        e: new Set(['E']),
                        h: new Set(['H']),
                      },
                    A: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        f: new Set(['F']),
                        h: new Set(['H']),
                    },
                    B: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        h: new Set(['H']),
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
                assert.deepStrictEqual(automato, automatoEsperado);
                done();
            });

            it('resolve quando há indeterminismo na epsilon produção', function(done) {
                const entrada = {
                    S: {
                        [Constantes.SIMBOLO_EPSILON]: new Set(['A', 'C']),
                    },
                    A: { b: new Set(['B']), },
                    B: {},
                    C: { d: new Set(['D']), },
                    D: {},
                };

                const automatoEsperado = {
                    S: {
                        b: new Set(['B']),
                        d: new Set(['D']),
                      },
                    A: { b: new Set(['B']), },
                    B: {},
                    C: { d: new Set(['D']), },
                    D: {},
                };

                RemoveEpsilonProducoes.execute(
                    automato,
                    estadosFinais
                );
                assert.deepStrictEqual(automato, automatoEsperado);
                done();
            });
        });
    });


});