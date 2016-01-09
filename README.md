# Gerador de Tabela Verdade +

**Autor do código html e javascript: formatação da página e programa que gera a tabela verdade:**

Copyright (c) 2015 [Michael Rieppel](https://github.com/mrieppel/TruthTableGenerator "Github page")

----

OBS: Projeto adotado por questões didáticas.

## Funções / Especificações
- Gerar a tabela verdade de qualquer fórmula bem formada da lógica proposicional.
- Identificar linhas críticas de um argumento.
- Verificar validade de um argumento.
- Página totalmente traduzida para o Português (Brasil).
- Tabela verdade "traduzida" e valores lógicos identificados de forma didática.

Insira várias fórmulas separando-as por vírgulas.
Selecione "Tabela Principal" para mostrar apenas a coluna do conectivo principal e "Tabela Completa" para mostrar todas as colunas.
Selecione "Tabela Texto" para produzir uma tabela de texto simples,
e "Tabela LaTeX" para gerar um código da tabela formatada para LaTeX.

Para fórmulas que formam um argumento, i.e., premissas separadas por vírgulas e a conclusão no final, marque a opção *Linhas Críticas* para gerar a tabela com a sinalização das linhas críticas. Caso queira verificar a verdade lógica do argumento, marque a opção *Validade do Argumento*.

>The output characters used for the various connectives can be easily changed by modifying the `htmlchar()`, `txtchar()`, and `latexchar()`
functions at the beginning of `truthtable.js`.



**Versão ao vivo desse programa: http://micalevisk.github.io/TruthTableGenerator-plus**
