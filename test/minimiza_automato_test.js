const assert = require('assert');
const MinimizaAutomato = require('../minimiza_automato');
const Constantes = require ('../constantes');

describe('MinimizaAutomato', function() {
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

            assert.deepStrictEqual(entrada, automatoEsperado);
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

            assert.deepStrictEqual(estadosFinais, new Set);
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

            assert.deepStrictEqual(estadosFinais, new Set(['Z']));
            done();
        });
    });
});