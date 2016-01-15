<!-- Copyright (c) 2016 Micael Levi L. Cavalcante. All rights reserved. -->

## TASKs [tskX]

1. **Verficar se é argumento** <br>
Identificar na textfield novo símbolo.Premissas separadas por vírgula e conclusão após ***:*** (&#8866;) <br>
Auto habilitar _Linhas Críticas_ e _Validade do Argumento_. E adicionar novo exemplo. **e.g.:** <br>
<img src="http://i.imgur.com/Hnl833H.png">

2. **Nova linha** <br>
Duas novas colunas são adicionas ao final ao identificar que é um argumento (pelo operado na fbf digita), colunas
<span style="color:rgb(72, 114,208)">**Premissa(s)**</span> e
<span style="color:rgb(9, 173, 131)">**Conclusão**</span>, **e.g.:** <br>
<img src="http://i.imgur.com/U9KIptj.png">

3. **Redefinir escala da tabela** ( _tbody_ ) <br>
Aumentar fonte dos caracteres da tabela gerada;<br>
Reposicionar a tabela gerada.

4. **Adicionar coluna** ( _depois do [tes5]_ ) <br>
Uma conluna que indica o número da linha de resultados. Começando em 1 e indo até _2^(nVariáveis)_.


---
## ISSUEs / feature [issX]

1. **Nova função - Tabela Texto** <br>
Adicionar botão ***copiar texto*** ao gerar a _Tabela Texto_ abaixo da tabela gerada.
<a href="https://zenorocha.github.io/clipboard.js/">(tutorial legal)</a>

2. **Reparar fontes da página** <br>
Redefinir pastas _fonts_ aplicando seu verdadeiro objetivo que é incluir fontes em página web.


---
## TESTs [tesX]

1. **Nova função - Tabela para argumento** <br>
A cada falsidade na conclusão, reportar _(console)_ linha em que o argumento falha.

2. **Definir 'id' para a última coluna** <br>
Em qualquer situação, todas os valores lógicos da última coluna recebem um id. i.e.,
a última **td** de cada **tr** recebe o id _conc_.

3. **Definir 'id' para cada nova td de linha crítica** <br>
A cada criação de uma **td** da classe _linhaCriticaIdentificador_ é atribuido à esse objeto um id que corresponde a linha em que ele está. Ou seja, é necessário variável local que guarde o número linha que está sendo criada. <br>
_Verificar funcionalidade da variável global "quantidadesDeLinhasCriticas"._

4. **Alternância na cor do identificador de linha crítica** <br>
Se a função de exibir linhas críticas estiver ativada:<br>
A cor do identificador é igual a cor do valor lógico na respectiva linha. i.e., onde _x_ é o número da linha corrente,
```javascript
document.getElementById("lx").style.color = document.getElementById("conc").style.color;
```


---
## FINALLY [finX]

1. **'Globalizar' página do site** <br>
"Traduzir" para inglês todo o escopo do site;
apagar informações desnecessárias.

2. **'Globalizar' página no GitHub** <br>
Inserir versão EN do README e defini-lá como principal;
criar arquivo PT-BR do README.
