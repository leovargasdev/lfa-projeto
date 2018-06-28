# lfa-projeto
Construção de aplicação criar autômatos finitos determinísticos para gramáticas e tokens com:
- Leitura do arquivo
- Eliminação de épsilon transições
- Eliminação de produções unitárias
- Determinização
- Minimização
- Criação de estado e transições de erros

Para rodar, é só inserir uma gramática em `arquivo.in` e executar o comando `node main.js`.

##### Detalhe:
As gramáticas devem estar separadas por uma linha em branco de todas as outras gramáticas ou tokens. Não precisa separar os tokens entre si.  
**Exemplo:**  
```
<S> ::= a<A>
<A> ::= a

token_um
token_dois
token_tres

<S> ::= b<B>
<B> ::= b

token_quatro

<S> ::= c<B>
<C> ::= c
```