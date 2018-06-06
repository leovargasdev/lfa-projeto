const assert = require('assert');
const DeterminizaAutomato = require('../determiniza_automato');
const Constantes = require ('../constantes');

describe('DeterminizaAutomato', function() {
    describe('#execute', function () {
        it('cria estado a partir de indeterminização', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: {},
                BB: {},
            };
            const estadosFinais = [];
            const automatoEsperado = {
                A: {
                    b: ['BBB']
                },
                B: {},
                BB: {},
                BBB: {},
            };

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(entrada, automatoEsperado);
            done();
        });

        it('não remove estados', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: {},
                BB: {},
            };
            const estadosFinais = [];
            const automatoEsperado = {
                A: {
                    b: ['BBB']
                },
                B: {},
                BB: {},
                BBB: {},
            };

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(entrada, automatoEsperado);
            done();
        });

        it('adiciona novo estado aos estados finais se o primeiro dos estados mesclados for final', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: {},
                BB: {},
            };
            let estadosFinais = ['B'];

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(estadosFinais, ['B', 'BBB']);
            done();
        });

        it('adiciona novo estado aos estados finais se o segundo dos estados mesclados for final', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: {},
                BB: {},
            };
            let estadosFinais = ['BB'];

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(estadosFinais, ['BB', 'BBB']);
            done();
        });

        it('adiciona novo estado aos estados finais se ambos estados mesclados forem finais', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: {},
                BB: {},
            };
            let estadosFinais = ['B', 'BB'];

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(estadosFinais, ['B', 'BB', 'BBB']);
            done();
        });

        it('mescla corretamente 3 estados sem transições', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB', 'BBB']
                },
                B: {},
                BB: {},
                BBB: {},
            };
            let estadosFinais = ['B', 'BB', 'BBB'];
            const automatoEsperado = {
                A: {
                    b: ['BBBBBB']
                },
                B: {},
                BB: {},
                BBB: {},
                BBBBBB: {},
            };

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(entrada, automatoEsperado);
            assert.deepStrictEqual(estadosFinais, ['B', 'BB', 'BBB', 'BBBBBB']);
            done();
        });

        it('adiciona as transições dos velhos estados ao novo estado', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: { c: ['C'] },
                BB: { cc: ['CC'] },
                C: {},
                CC: {},
            };
            const estadosFinais = [];
            const automatoEsperado = {
                A: {
                    b: ['BBB']
                },
                B: { c: ['C'] },
                BB: { cc: ['CC'] },
                BBB: {
                    c: ['C'],
                    cc: ['CC'],
                },
                C: {},
                CC: {},
            };

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(entrada, automatoEsperado);
            done();
        });

        it('adiciona transições únicas ao novo estado', function(done) {
            let entrada = {
                A: {
                    b: ['B', 'BB']
                },
                B: { c: ['C'] },
                BB: { c: ['C'] },
                C: {},
            };
            const estadosFinais = [];
            const automatoEsperado = {
                A: {
                    b: ['BBB']
                },
                B: { c: ['C'] },
                BB: { cc: ['CC'] },
                BBB: {
                    c: ['C'],
                },
                C: {},
            };

            DeterminizaAutomato.execute(
                entrada,
                estadosFinais
            )

            assert.deepStrictEqual(entrada, automatoEsperado);
            done();
        });
    });
});