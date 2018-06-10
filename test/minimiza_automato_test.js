const assert = require('assert');
const MinimizaAutomato = require('../minimiza_automato');
const Constantes = require ('../constantes');
const GeralTest = require('./geral_test');

describe('MinimizaAutomato', function() {
    describe('#execute', function() {
        it('resolve caso geral: remove inalcançáveis e mortos', function(done) {
            let entrada = {
                S: {
                    a: new Set(['morto']),
                    b: new Set(['próprio']),
                },
                próprio: {},
                inalcançável: {
                    a: new Set(['S']),
                },
                morto: {
                    a: new Set(['morto']),
                },
            };
            let estadosFinais = new Set(['próprio']);

            MinimizaAutomato.removeEstadosInalcancaveis(
                entrada,
                estadosFinais
            );
            const automatoEsperado = {
                S: {
                    b: new Set(['próprio']),
                },
                próprio: {},
            };

            assert(GeralTest.testaIgualdadeObjeto(entrada, automatoEsperado));
            done();
        });
    });

    describe('#removeEstadosInalcancaveis', function() {
        it('remove estados inalcançáveis a partir do estado inicial', function(done) {
            let entrada = {
                S: {},
                B: {},
                C: {},
                D: {},
            };
            let estadosFinais = new Set;

            MinimizaAutomato.removeEstadosInalcancaveis(
                entrada,
                estadosFinais
            );
            const automatoEsperado = {
                S: {},
            };

            assert(GeralTest.testaIgualdadeObjeto(entrada, automatoEsperado));
            done();
        });

        it('remove estados inalcançáveis dos estados finais', function(done) {
            let entrada = {
                S: {},
                B: {},
                C: {},
                D: {},
            };
            let estadosFinais = new Set(['B', 'C', 'D']);

            MinimizaAutomato.removeEstadosInalcancaveis(
                entrada,
                estadosFinais
            );

            assert(GeralTest.testaIgualdadeObjeto(estadosFinais, new Set));
            done();
        });

        it('mantém estados alcançáveis nos estados finais', function(done) {
            let entrada = {
                S: { a: new Set(['Z']) },
                B: {},
                C: {},
                D: {},
                Z: {},
            };
            let estadosFinais = new Set(['Z', 'B', 'C', 'D']);

            MinimizaAutomato.removeEstadosInalcancaveis(
                entrada,
                estadosFinais
            );

            assert(GeralTest.testaIgualdadeObjeto(estadosFinais, new Set(['Z'])));
            done();
        });
    });

    describe('#removeEstadosMortos', function() {
        it('caso geral: Remove estado e transições', function(done) {
            let entrada = {
                S: {
                    a: new Set(['A']),
                    z: new Set(['Z']),
                },
                A: {
                    a: new Set(['A']),
                },
                Z: {},
            };
            let estadosFinais = new Set(['Z']);
            const automatoEsperado = {
                S: {
                    z: new Set(['Z']),
                },
                Z: {},
            };

            MinimizaAutomato.removeEstadosMortos(entrada, estadosFinais);

            assert(GeralTest.testaIgualdadeObjeto(entrada, automatoEsperado));
            done();
        });

        it('(não) remove estado inicial', function(done) {
            pending('Não sei se é pra remove ou não o estado inicial');
            // let entrada = {
            //     S: {
            //         a: new Set(['A']),
            //     },
            //     A: {
            //         a: new Set(['A']),
            //     },
            // };
            // let estadosFinais = new Set;
            // const automatoEsperado = {
            //     // S: {},
            // };

            // MinimizaAutomato.removeEstadosMortos(automato, estadosFinais);

            // assert(GeralTest.testaIgualdadeObjeto(automato, automatoEsperado));
            // done();
        });

        it('remove estado mesmo que "antecessor" não seja morto', function(done) {
            let entrada = {
                S: {
                    a: new Set(['A']),
                },
                A: {
                    a: new Set(['S']),
                    z: new Set(['Z']),
                },
                Z: {
                    z: new Set(['Z']),
                },
            };
            let estadosFinais = new Set(['S']);
            const automatoEsperado = {
                 S: {
                    a: new Set(['A']),
                },
                A: {
                    a: new Set(['S']),
                },
            };

            MinimizaAutomato.removeEstadosMortos(entrada, estadosFinais);

            assert(GeralTest.testaIgualdadeObjeto(entrada, automatoEsperado));
            done();
        });

        it('remove estado mesmo que "antecessor" seja final', function(done) {
            let entrada = {
                S: {
                    a: new Set(['A']),
                },
                A: {
                    z: new Set(['Z']),
                },
                Z: {
                    z: new Set(['Z']),
                },
            };
            let estadosFinais = new Set(['A']);
            const automatoEsperado = {
                 S: {
                    a: new Set(['A']),
                },
                A: {},
            };

            MinimizaAutomato.removeEstadosMortos(entrada, estadosFinais);

            assert(GeralTest.testaIgualdadeObjeto(entrada, automatoEsperado));
            done();
        });
    });
});