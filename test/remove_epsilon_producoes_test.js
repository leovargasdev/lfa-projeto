const assert = require('assert');
const RemoveEpsilonProducoes = require('../remove_epsilon_producoes');
const Constantes = require ('../constantes');
const GeralTest = require('./geral_test');

describe('RemoveEpsilonProducoes', function () {
    describe('#execute', function() {
        // Se A Epsilon→ B e B a→ C, então A a→ C
        describe('adiciona as transições do estado destino às transições do estado origem', function () {
            let automato;
            let estadosFinais = new Set;

            beforeEach('reseta variáveis', function () {
                automato = {};
                estadosFinais = new Set;
            });

            it ('resolve transições simples', function(done) {
                let entrada = {
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
                    entrada,
                    estadosFinais
                );
                assert.deepStrictEqual(entrada, automatoEsperado);
                done();
            });

            it('resolve transições para o próprio estado', function(done) {
                let entrada = {
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
                    entrada,
                    estadosFinais
                );
                assert.deepStrictEqual(entrada, automatoEsperado);
                done();
            });

            it('resolve transições duplas', function(done) {
                let entrada = {
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
                        f: new Set(['F']),
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
                    entrada,
                    estadosFinais
                );
                assert.deepStrictEqual(entrada, automatoEsperado);
                done();
            });

            it('resolve transições triplas', function(done) {
                let entrada = {
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
                        e: new Set(['E']),
                        c: new Set(['C']),
                        d: new Set(['D']),
                        h: new Set(['H']),
                        f: new Set(['F']),
                      },
                    A: {
                        c: new Set(['C']),
                        d: new Set(['D']),
                        h: new Set(['H']),
                        f: new Set(['F']),
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
                    G: { h: new Set(['H']) }
                };

                RemoveEpsilonProducoes.execute(
                    entrada,
                    estadosFinais
                );
                assert.deepStrictEqual(entrada, automatoEsperado);
                done();
            });

            it('resolve quando há indeterminismo na epsilon produção', function(done) {
                let entrada = {
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
                    entrada,
                    estadosFinais
                );
                assert.deepStrictEqual(entrada, automatoEsperado);
                done();
            });

            describe('adiciona estado de origem aos estados finais se o estado de destino estiver', function() {
                it('nível 1', function(done) {
                    let entrada = {
                        S: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        },
                        A: {},
                    };
                    let estadosFinais = new Set(['A']);
                    RemoveEpsilonProducoes.execute(
                        entrada,
                        estadosFinais
                        );
                    assert.deepStrictEqual(estadosFinais, new Set(['A', 'S']));
                    done();
                });

                it('nível 2', function(done) {
                    let entrada = {
                        S: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        },
                        A: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['B']),
                        },
                        B: {},
                    };
                    let estadosFinais = new Set(['B']);
                    RemoveEpsilonProducoes.execute(
                        entrada,
                        estadosFinais
                        );
                    assert.deepStrictEqual(estadosFinais, new Set(['B', 'A', 'S']));
                    done();
                });

                it('nível 3', function(done) {
                    let entrada = {
                        S: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['A']),
                        },
                        A: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['B']),
                        },
                        B: {
                            [Constantes.SIMBOLO_EPSILON]: new Set(['C']),
                        },
                        C: {},
                    };
                    let estadosFinais = new Set(['C']);
                    RemoveEpsilonProducoes.execute(
                        entrada,
                        estadosFinais
                        );
                    assert.deepStrictEqual(estadosFinais, new Set(['C', 'B', 'A', 'S']));
                    done();
                });
            });
        });
    });
});