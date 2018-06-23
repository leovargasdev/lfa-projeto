const assert = require('assert');
const ConstroiAutomato = require('../constroi_automato');
const FileSystem = require('fs');
const Constantes = require ('../constantes');
const GeralTest = require('./geral_test');

describe('ConstroiAutomato', function () {
    describe('#execute', function() {
        let arquivo;
        let automato;
        let estadosFinais;
        let alfabeto;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = new Set;
            alfabeto = new Set;
        });

        it('cria autômato finito não-determinístico corretamente e estados finais', function (done) {
            const automatoEsperado = {
              S: {
                s: new Set(['Palavra0_Estado1', 'Palavra2_Estado1']),
                a: new Set(['A1', 'A3']),
                e: new Set(['A1', 'A3', 'Palavra4_Estado1']),
                i: new Set(['A1', 'B3']),
                o: new Set(['A1', 'A3']),
                u: new Set(['A1', 'B3']),
                p: new Set(['Palavra5_Estado1'])
              },
              Palavra0_Estado1: { e: new Set(['Palavra0_Estado2']) },
              Palavra0_Estado2: {},
              A1: {
                a: new Set(['A1']),
                e: new Set(['A1']),
                i: new Set(['A1']),
                o: new Set(['A1']),
                u: new Set(['A1'])
              },
              Palavra2_Estado1: { e: new Set(['Palavra2_Estado2']) },
              Palavra2_Estado2: { n: new Set(['Palavra2_Estado3']) },
              Palavra2_Estado3: { a: new Set(['Palavra2_Estado4']) },
              Palavra2_Estado4: { o: new Set(['Palavra2_Estado5']) },
              Palavra2_Estado5: {},
              A3: {
                a: new Set(['A3']),
                e: new Set(['B3']),
                i: new Set(['A3']),
                o: new Set(['A3']),
                u: new Set(['S'])
              },
              B3: {
                a: new Set(['A3']),
                e: new Set(['S']),
                i: new Set(['A3']),
                o: new Set(['A3']),
                u: new Set(['A3'])
              },
              Palavra4_Estado1: { n: new Set(['Palavra4_Estado2']) },
              Palavra4_Estado2: { t: new Set(['Palavra4_Estado3']) },
              Palavra4_Estado3: { a: new Set(['Palavra4_Estado4']) },
              Palavra4_Estado4: { o: new Set(['Palavra4_Estado5']) },
              Palavra4_Estado5: {},
              Palavra5_Estado1: { e: new Set(['Palavra5_Estado2']) },
              Palavra5_Estado2: {}
            };

            ConstroiAutomato.execute(
                automato,
                estadosFinais,
                alfabeto,
                "./test/test_arquivo_exemplo.in"
            );
            assert.deepStrictEqual(automato, automatoEsperado);
            done();
        });

        it('cria estados finais de autômato finito não determinístico', function (done) {
            const estadosFinaisEsperado = new Set([
                'Palavra0_Estado2',
                'A1',
                'Palavra2_Estado5',
                'S',
                'B3', 'A3',
                'Palavra4_Estado5',
                'Palavra5_Estado2'
            ]);

            ConstroiAutomato.execute(
                automato,
                estadosFinais,
                alfabeto,
                "./test/test_arquivo_exemplo.in"
            );
            assert.deepStrictEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('cria alfabeto do autômato', function(done) {
            const alfabetoEsperado = new Set(['a', 'e', 'i', 'o', 'u', 's', 'n', 't', 'p']);
             ConstroiAutomato.execute(
                automato,
                estadosFinais,
                alfabeto,
                "./test/test_arquivo_exemplo.in"
            );
            assert.deepStrictEqual(alfabeto, alfabetoEsperado);
            done();
        });
    });

    describe('#interpretaRegra', function () {
        let automato;
        let estadosFinais;
        let alfabeto;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = new Set;
            alfabeto = new Set;
        });

        it('adiciona transição normal ao objeto de retorno', function (done) {
            const regra = '<A>::=a<A>';
            const automatoEsperado = { A0: { a: new Set(['A0']) } };
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);

            assert.deepStrictEqual(automato, automatoEsperado);
            assert.deepStrictEqual(new Set, estadosFinais);
            done();
        });

        it('lida corretamente com epsilon produção', function (done) {
            const regra = `<A>::=${Constantes.SIMBOLO_EPSILON}<S>|${Constantes.SIMBOLO_EPSILON}<A>`;
            const automatoEsperado = {
                A0: {
                    [Constantes.SIMBOLO_EPSILON]: new Set(['S', 'A0'])
                }
            };
            console.log(regra);
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);

            assert.deepStrictEqual(automatoEsperado, automato);
            assert.deepStrictEqual(new Set(), estadosFinais);
            done();
        });

        it('marca como estado final quando há epsilon transição', function (done) {
            const regra = `<A>::=${Constantes.SIMBOLO_EPSILON}`;
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);

            assert.deepStrictEqual({ A0: {} }, automato);
            assert.deepStrictEqual(new Set(['A0']), estadosFinais);
            done();
        });

        it('cria estado final quando é só símbolo terminal', function(done) {
            const regra = `<A>::=a`;
            const automatoEsperado = {
                A0: {
                    a: new Set(['TaA0'])
                },
                TaA0: {}
            };
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);

            assert.deepStrictEqual(automato, automatoEsperado);
            assert.deepStrictEqual(new Set(['TaA0']), estadosFinais);
            done();
        });

        it('trata transição normal, com epsilon e com símbolo terminal', function(done) {
            const regra = `<A>::=a<A>|b|${Constantes.SIMBOLO_EPSILON}`;
            const automatoEsperado = {
                A0: {
                    a: new Set(['A0']),
                    b: new Set(['TbA0'])
                },
                TbA0: {}
            };
            const estadosFinaisEsperado = new Set(['TbA0', 'A0']);
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);

            assert.deepStrictEqual(automato, automatoEsperado);
            assert.deepStrictEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('usa o mesmo estado inicial para diferentes gramáticas', function (done) {
            const automatoEsperado = {
                S: {
                    a: new Set(['A0', 'A1']),
                    b: new Set(['A0']),
                    c: new Set(['A1'])
                },
                A0: { a: new Set(['S']) },
                A1: { a: new Set(['S']) }
            };
            const regras0 = ['<S>::=a<A>|b<A>', '<A>::=a<S>'];
            const regras1 = ['<S>::=a<A>|c<A>', '<A>::=a<S>'];

            regras0.forEach((regra) => {
                ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);
            });
            regras1.forEach((regra) => {
                ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 1);
            });

            assert.deepStrictEqual(automato, automatoEsperado);
            done();
        });

        it('Cria epsilon transição para produções unitárias', function (done) {
            const automatoEsperado = {
                S: {
                    a: new Set(['A0']),
                    [Constantes.SIMBOLO_EPSILON]: new Set(['B0'])
                },
            };
            const regra = '<S>::=a<A>|<B>';

            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);
            assert.deepStrictEqual(automato, automatoEsperado);
            done();
        });

        it('adiciona símbolos terminais ao alfabeto', function(done) {
            const alfabetoEsperado = new Set(['a', 'b', 'e']);
            // const alfabetoEsperado = new Set(['a', 'bcd', 'e']);
            const regra = '<A>::=a<A>|b<A>|e';
            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);
            assert.deepStrictEqual(alfabeto, alfabetoEsperado);
            done();
        });

        it('alça erro se houver mais de um símbolo terminal na transição', function(done) {
            assert.throws(function () {
                ConstroiAutomato.interpretaRegra('<A>::=aa<A>', automato, alfabeto, estadosFinais, 0);
        }, /Produção com mais de um símbolo terminal na regra <A>::=aa<A>/);
            done();
        });

        it('reconhece normalmente estados com mais de um caracter no nome', function (done) {
            const automatoEsperado = {
                AA0: {
                    a: new Set(['BBB0']),
                    [Constantes.SIMBOLO_EPSILON]: new Set(['CCCC0']),
                },
            };
            const regra = '<AA>::=a<BBB>|<CCCC>';

            ConstroiAutomato.interpretaRegra(regra, automato, alfabeto, estadosFinais, 0);
            assert.deepStrictEqual(automato, automatoEsperado);
            done();
        });
    });

    describe('#interpretaToken', function () {
        let automato;
        let estadosFinais;
        let alfabeto;

        beforeEach('Cria variáveis', function () {
            automato = {};
            estadosFinais = new Set;
            alfabeto = new Set;
        });

        it('cria estados normais e finais', function (done) {
            const automatoEsperado = {
                S: { l: new Set(['Palavra0_Estado1']) },
                Palavra0_Estado1: { o: new Set(['Palavra0_Estado2']) },
                Palavra0_Estado2: { b: new Set(['Palavra0_Estado3']) },
                Palavra0_Estado3: { o: new Set(['Palavra0_Estado4']) },
                Palavra0_Estado4: {}
            };
            const estadosFinaisEsperado = new Set(['Palavra0_Estado4']);

            ConstroiAutomato.interpretaToken('lobo', automato, alfabeto, estadosFinais, 0);
            assert.deepStrictEqual(automato, automatoEsperado);
            assert.deepStrictEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('cria indeterminização para tokens com a mesma letra inicial', function (done) {
            const automatoEsperado = {
                S: { l: new Set(['Palavra0_Estado1', 'Palavra1_Estado1']) },
                Palavra0_Estado1: { o: new Set(['Palavra0_Estado2']) },
                Palavra0_Estado2: {},
                Palavra1_Estado1: { a: new Set(['Palavra1_Estado2']) },
                Palavra1_Estado2: {}
            };
            const estadosFinaisEsperado = new Set(['Palavra0_Estado2', 'Palavra1_Estado2']);

            ConstroiAutomato.interpretaToken('lo', automato, alfabeto, estadosFinais, 0);
            ConstroiAutomato.interpretaToken('la', automato, alfabeto, estadosFinais, 1);
            assert.deepStrictEqual(automato, automatoEsperado);
            assert.deepStrictEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });

        it('adiciona os caracteres de um token ao alfabeto', function () {
            const alfabetoEsperado = new Set(['b', 'a', 'n']);
            ConstroiAutomato.interpretaToken('banana', automato, alfabeto, estadosFinais, 0);
            assert.deepStrictEqual(alfabeto, alfabetoEsperado);
        });
    });

    describe('#interpretaArquivo', function() {
        let arquivo;
        let automato;
        let estadosFinais;
        let alfabeto;

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
            estadosFinais = new Set;
            alfabeto = new Set;
        });

        it('cria autômato finito não-determinístico corretamente', function (done) {
            const automatoEsperado = {
              S: {
                s: new Set(['Palavra0_Estado1', 'Palavra2_Estado1']),
                a: new Set(['A1', 'A3']),
                e: new Set(['A1', 'A3', 'Palavra4_Estado1']),
                i: new Set(['A1', 'B3']),
                o: new Set(['A1', 'A3']),
                u: new Set(['A1', 'B3']),
                p: new Set(['Palavra5_Estado1'])
              },
              Palavra0_Estado1: { e: new Set(['Palavra0_Estado2']) },
              Palavra0_Estado2: {},
              A1: {
                a: new Set(['A1']),
                e: new Set(['A1']),
                i: new Set(['A1']),
                o: new Set(['A1']),
                u: new Set(['A1'])
              },
              Palavra2_Estado1: { e: new Set(['Palavra2_Estado2']) },
              Palavra2_Estado2: { n: new Set(['Palavra2_Estado3']) },
              Palavra2_Estado3: { a: new Set(['Palavra2_Estado4']) },
              Palavra2_Estado4: { o: new Set(['Palavra2_Estado5']) },
              Palavra2_Estado5: {},
              A3: {
                a: new Set(['A3']),
                e: new Set(['B3']),
                i: new Set(['A3']),
                o: new Set(['A3']),
                u: new Set(['S'])
              },
              B3: {
                a: new Set(['A3']),
                e: new Set(['S']),
                i: new Set(['A3']),
                o: new Set(['A3']),
                u: new Set(['A3'])
              },
              Palavra4_Estado1: { n: new Set(['Palavra4_Estado2']) },
              Palavra4_Estado2: { t: new Set(['Palavra4_Estado3']) },
              Palavra4_Estado3: { a: new Set(['Palavra4_Estado4']) },
              Palavra4_Estado4: { o: new Set(['Palavra4_Estado5']) },
              Palavra4_Estado5: {},
              Palavra5_Estado1: { e: new Set(['Palavra5_Estado2']) },
              Palavra5_Estado2: {}
            };

            ConstroiAutomato.interpretaArquivo(arquivo, automato, alfabeto, estadosFinais);
            assert.deepStrictEqual(automato, automatoEsperado);
            done();
        });

        it('cria estados finais de autômato finito não determinístico', function (done) {
            const estadosFinaisEsperado = new Set([
                'Palavra0_Estado2',
                'A1',
                'Palavra2_Estado5',
                'S',
                'B3', 'A3',
                'Palavra4_Estado5',
                'Palavra5_Estado2'
            ]);

            ConstroiAutomato.interpretaArquivo(arquivo, automato, alfabeto, estadosFinais);
            assert.deepStrictEqual(estadosFinais, estadosFinaisEsperado);
            done();
        });
    });
});