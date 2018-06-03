const assert = require('assert');
const ConstroiAutomato = require('../constroi_automato');
const FileSystem = require('fs');
const Constantes = require ('../constantes');

describe('ConstroiAutomato', function () {
    describe('#execute', function() {
        let arquivo;
        let automato;
        let estadosFinais;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = [];
        });

        it('cria autômato finito não-determinístico corretamente e estados finais', function (done) {
            const automatoEsperado = {
              S: {
                s: ['Palavra0_Estado1', 'Palavra2_Estado1'],
                a: ['A1', 'A3'],
                e: ['A1', 'A3', 'Palavra4_Estado1'],
                i: ['A1', 'B3'],
                o: ['A1', 'A3'],
                u: ['A1', 'B3'],
                p: ['Palavra5_Estado1']
              },
              Palavra0_Estado1: { e: ['Palavra0_Estado2'] },
              Palavra0_Estado2: {},
              A1: {
                a: ['A1'],
                e: ['A1'],
                i: ['A1'],
                o: ['A1'],
                u: ['A1']
              },
              Palavra2_Estado1: { e: ['Palavra2_Estado2'] },
              Palavra2_Estado2: { n: ['Palavra2_Estado3'] },
              Palavra2_Estado3: { a: ['Palavra2_Estado4'] },
              Palavra2_Estado4: { o: ['Palavra2_Estado5'] },
              Palavra2_Estado5: {},
              A3: {
                a: ['A3'],
                e: ['B3'],
                i: ['A3'],
                o: ['A3'],
                u: ['S']
              },
              B3: {
                a: ['A3'],
                e: ['S'],
                i: ['A3'],
                o: ['A3'],
                u: ['A3']
              },
              Palavra4_Estado1: { n: ['Palavra4_Estado2'] },
              Palavra4_Estado2: { t: ['Palavra4_Estado3'] },
              Palavra4_Estado3: { a: ['Palavra4_Estado4'] },
              Palavra4_Estado4: { o: ['Palavra4_Estado5'] },
              Palavra4_Estado5: {},
              Palavra5_Estado1: { e: ['Palavra5_Estado2'] },
              Palavra5_Estado2: {}
            };

            ConstroiAutomato.execute(
                automato,
                estadosFinais,
                "./test/test_arquivo_exemplo.in"
            );
            assert.deepEqual(automato, automatoEsperado);
            done();
        });

        it('cria estados finais de autômato finito não determinístico', function (done) {
            const estadosFinaisEsperado = [
                'Palavra0_Estado2',
                'A1',
                'Palavra2_Estado5',
                'S',
                'B3', 'A3',
                'Palavra4_Estado5',
                'Palavra5_Estado2'
            ];

            ConstroiAutomato.execute(
                automato,
                estadosFinais,
                "./test/test_arquivo_exemplo.in"
            );
            assert.deepEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });
    });

    describe('#interpretaRegra', function () {
        let automato;
        let estadosFinais;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = [];
        });

        it('adiciona transição normal ao objeto de retorno', function (done) {
            const regra = '<A>::=a<A>';
            const automatoEsperado = { A0: { a: ['A0'] } };
            ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 0);

            assert.deepEqual(automato, automatoEsperado);
            assert.deepEqual([], estadosFinais);
            done();
        });

        it('marca como estado final quando há epsilon transição', function (done) {
            const regra = `<A>::=${Constantes.SIMBOLO_EPSILON}`;
            ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 0);

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
            ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 0);

            assert.deepEqual(automato, automatoEsperado);
            assert.deepEqual(['TaA0'], estadosFinais);
            done();
        });

        it('trata transição normal, com epsilon e com símbolo terminal', function(done) {
            const regra = `<A>::=a<A>|b|${Constantes.SIMBOLO_EPSILON}`;
            const automatoEsperado = {
                A0: {
                    a: ['A0'],
                    b: ['TbA0']
                },
                TbA0: {}
            };
            const estadosFinaisEsperado = ['TbA0', 'A0'];
            ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 0);

            assert.deepEqual(automato, automatoEsperado);
            assert.deepEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('usa o mesmo estado inicial para diferentes gramáticas', function (done) {
            const automatoEsperado = {
                S: {
                    a: ['A0', 'A1'],
                    b: ['A0'],
                    c: ['A1']
                },
                A0: { a: ['S'] },
                A1: { a: ['S'] }
            };
            const regras0 = ['<S>::=a<A>|b<A>', '<A>::=a<S>'];
            const regras1 = ['<S>::=a<A>|c<A>', '<A>::=a<S>'];

            regras0.forEach((regra) => {
                ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 0);
            });
            regras1.forEach((regra) => {
                ConstroiAutomato.interpretaRegra(regra, automato, estadosFinais, 1);
            });

            assert.deepEqual(automato, automatoEsperado);
            done();
        });
    });

    describe('#interpretaToken', function () {
        let automato;
        let estadosFinais;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = [];
        });

        it('cria estados normais e finais', function (done) {
            const automatoEsperado = {
                S: { l: ['Palavra0_Estado1'] },
                Palavra0_Estado1: { o: ['Palavra0_Estado2'] },
                Palavra0_Estado2: { b: ['Palavra0_Estado3'] },
                Palavra0_Estado3: { o: ['Palavra0_Estado4'] },
                Palavra0_Estado4: {}
            };
            const estadosFinaisEsperado = ['Palavra0_Estado4'];

            ConstroiAutomato.interpretaToken('lobo', automato, estadosFinais, 0);
            assert.deepEqual(automato, automatoEsperado);
            assert.deepEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('cria indeterminização para tokens com a mesma letra inicial', function (done) {
            const automatoEsperado = {
                S: { l: ['Palavra0_Estado1', 'Palavra1_Estado1'] },
                Palavra0_Estado1: { o: ['Palavra0_Estado2'] },
                Palavra0_Estado2: {},
                Palavra1_Estado1: { a: ['Palavra1_Estado2'] },
                Palavra1_Estado2: {}
            };
            const estadosFinaisEsperado = ['Palavra0_Estado2', 'Palavra1_Estado2'];

            ConstroiAutomato.interpretaToken('lo', automato, estadosFinais, 0);
            ConstroiAutomato.interpretaToken('la', automato, estadosFinais, 1);
            assert.deepEqual(automato, automatoEsperado);
            assert.deepEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });
    });

    describe('#interpretaArquivo', function() {
        let arquivo;
        let automato;
        let estadosFinais;

        beforeEach('Carrega arquivo', function() {
            try {
                arquivo = FileSystem.readFileSync("./test/test_arquivo_exemplo.in", 'utf8');
            } catch (erro) {
                console.error("Could not open file: %s", erro);
                process.exitCode = 1;
            }
        });

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = [];
        });

        it('cria autômato finito não-determinístico corretamente', function (done) {
            const automatoEsperado = {
              S: {
                s: ['Palavra0_Estado1', 'Palavra2_Estado1'],
                a: ['A1', 'A3'],
                e: ['A1', 'A3', 'Palavra4_Estado1'],
                i: ['A1', 'B3'],
                o: ['A1', 'A3'],
                u: ['A1', 'B3'],
                p: ['Palavra5_Estado1']
              },
              Palavra0_Estado1: { e: ['Palavra0_Estado2'] },
              Palavra0_Estado2: {},
              A1: {
                a: ['A1'],
                e: ['A1'],
                i: ['A1'],
                o: ['A1'],
                u: ['A1']
              },
              Palavra2_Estado1: { e: ['Palavra2_Estado2'] },
              Palavra2_Estado2: { n: ['Palavra2_Estado3'] },
              Palavra2_Estado3: { a: ['Palavra2_Estado4'] },
              Palavra2_Estado4: { o: ['Palavra2_Estado5'] },
              Palavra2_Estado5: {},
              A3: {
                a: ['A3'],
                e: ['B3'],
                i: ['A3'],
                o: ['A3'],
                u: ['S']
              },
              B3: {
                a: ['A3'],
                e: ['S'],
                i: ['A3'],
                o: ['A3'],
                u: ['A3']
              },
              Palavra4_Estado1: { n: ['Palavra4_Estado2'] },
              Palavra4_Estado2: { t: ['Palavra4_Estado3'] },
              Palavra4_Estado3: { a: ['Palavra4_Estado4'] },
              Palavra4_Estado4: { o: ['Palavra4_Estado5'] },
              Palavra4_Estado5: {},
              Palavra5_Estado1: { e: ['Palavra5_Estado2'] },
              Palavra5_Estado2: {}
            };

            ConstroiAutomato.interpretaArquivo(arquivo, automato, estadosFinais);
            assert.deepEqual(automato, automatoEsperado);
            done();
        });

        it('cria estados finais de autômato finito não determinístico', function (done) {
            const estadosFinaisEsperado = [
                'Palavra0_Estado2',
                'A1',
                'Palavra2_Estado5',
                'S',
                'B3', 'A3',
                'Palavra4_Estado5',
                'Palavra5_Estado2'
            ];

            ConstroiAutomato.interpretaArquivo(arquivo, automato, estadosFinais);
            assert.deepEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });
    });
});