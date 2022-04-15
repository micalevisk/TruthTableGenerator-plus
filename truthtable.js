// Copyright (c) 2016 Micael Levi L. C.
/*
Copyright (c) 2015 Michael Rieppel
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/*************************************************************************************/
"use strict"
const CHARS_SYMBOLS = {"charFalse":'F', "charTrue": 'V'};
const IDENTIFICADOR = "&#9668;"; // Para indicar as linhas críticas.
var validadeArgumento = '';      // string gerada ao habilitar checkbox de verificar validade do argumento.

var linhaResultante = new Array(); // Caracteres de cada linha por premissa.
var quantidadeLinhasCriticas = 0;

/*************************************************************************************/
function checkEnterKey(e){ if(e.keyCode == 13) construct(); }

// (String, Bool) -> void
// mostra(true) ou oculta(hide) objetos com a id passada.
function changeVisibility(idName, visible){
	const STATE = (visible) ? "visible" : "hidden";
	document.getElementById(idName).style.visibility = STATE;
}

// (String, Bool) -> void
// mostra(true) ou oculta(false) objetos de uma classe passada.
function changeVisibility_class(className, visible){
	var elements = document.getElementsByClassName(className);
	const N = elements.length;
	const STATE = (visible) ? "visible" : "hidden";

	for (var i = 0; i < N; i++)
		elements[i].style.visibility = STATE;
}


function htmlchar(c) {
	switch(c) {
		case true: return CHARS_SYMBOLS.charTrue;
		case false: return CHARS_SYMBOLS.charFalse;
		case '~' : return '&not;';
		case '&' : return '&and;';
		case 'v' : return '&or;';
		case '>' : return '&rarr;';
		case '<>' : return '&harr;';
		case '#' : return 'F';
		default : return c;
	}
}

function txtchar(c) {
	switch(c) {
		case true: return CHARS_SYMBOLS.charTrue;
		case false: return CHARS_SYMBOLS.charFalse;
		case '' : return ' ';
		default : return c;
	}
}

function latexchar(c) {
	switch(c) {
		case true : return '$\\top$';
		case false : return '$\\perp$';
		case '~' : return '$\\sim$';
		case '&' : return '$\\&$';
		case 'v' : return '$\\lor$';
		case '>' : return '$\\rightarrow$';
		case '<>' : return '$\\leftrightarrow$';
		case '|' : return '$|$';
		case '#' : return '$\\perp$';
		default : return c;
	}
}

/*************************************************************************************/

// main construction function
function construct() {
	/* var time = new Date().getTime(); */
	var formulas = document.getElementById('in').value.replace(/ /g,''); // remove whitespace
	if(formulas=='') return alert("Você precisa digitar alguma fórmula bem formada.");

	var r = badchar(formulas);
	if(r>=0) return alert("Você digitou um símbolo não identificado ("+formulas[r]+')');

	quantidadeLinhasCriticas = 0;
	const ehArgumento = (formulas.indexOf(':') != -1);

	var full = document.getElementById('full').checked;
	var main = document.getElementById('main').checked;
	var text = document.getElementById('text').checked;
	var latex = document.getElementById('latex').checked;
	var mostrarLinhasCriticas = (document.getElementById('linhas_criticas').checked = ehArgumento);
	const mostrarNumeroLinhas = document.getElementById('exibir_numero_linhas').checked;

	document.getElementById('argumento').checked = ehArgumento;

	changeVisibility('validade_argumento', ehArgumento);
	changeVisibility('funcoes_argumento', ehArgumento);

	formulas = formulas.split(/[,:]+/);

	var trees = formulas.map(parse); // create an array of parse trees
	const nVariaveis = trees.length;

	if(nVariaveis > 12) return alert("Você ultrapassou o limite de quantidade de variáveis (12).");

	for(var i=0; i < nVariaveis; i++) { // adds outermost parentheses if needed
		if(trees[i].length==0) {
			formulas[i] = '('+formulas[i]+')';
			trees[i] = parse(formulas[i]);
		}
	}

	if(trees.filter(function(a) {return a.length==0;}).length>0) // checks if any formulas are still malformed
		return alert("Sintaxe Inválida!"); //return alert("One of the formulas you entered is not well formed");

	var table = mkTable(formulas,trees);

	if(full || main) {
		var textoResultado = document.getElementById("validade_argumento");

		validadeArgumento = "Válido";
		textoResultado.className = "argumentoValido";

		var htmltable = htmlTable(table,trees,main);
		document.getElementById('tt').innerHTML = htmltable;

		if(quantidadeLinhasCriticas == 0) textoResultado.innerHTML = "É consequência lógica!";

		if (validadeArgumento == "Válido") textoResultado.innerHTML = "É consequência lógica!"; 
		else textoResultado.innerHTML = "Não é consequência lógica!";

		changeVisibility_class('linhaCriticaIdentificador', mostrarLinhasCriticas);
		changeVisibility_class('numeroLinha', mostrarNumeroLinhas);
	}
	else if(text) {
		var texttable = textTable(table);
		document.getElementById('tt').innerHTML = '<div class="center"><pre>'+texttable+'</pre></div>';
	}
	else if(latex) {
		var latextable = latexTable(table,trees);
		var win = window.open();
		win.document.open();
		win.document.write('<pre>'+latextable+'</pre>');
		win.document.close();
		document.getElementById('tt').innerHTML = '<div class="center" style="text-align:center;color:red;">LaTex tables open in a new window.<br/>If no window opened, make sure your your browser<br/>isn\'t blocking popups.</div>';
	}

	/* var duration = (new Date().getTime() - time) / 1000; // Duração (em segundos) da geração da tabela. */
}

// (Table,[Tree],Boolean) -> String
// Takes a table (as output by mkTable), the trees it's a table of, and a boolean and
// returns an HTML table. If the boolean is set to true, it only prints the column
// under the main connective.
function htmlTable(table,trees,flag) {
	var rownum = table[0].length; // número de linhas da (primeira coluna) tabela geral.
	var mcs = []; // indices of the main connectives

	for(var i=0;i<trees.length;i++)	mcs.push(mcindex(trees[i]));

	var out = '<table id="tabela_verdade" class="truth">'; // start the html table
	out += mkTHrow(table); // make the top th row

	for(var i=1;i<table[0].length;i++) // make the td rows below
		out += mkTDrow(table,i);

	return out+'</table>'; // return the html table

	function mkTHrow(tbl) {
		var rw = '<tr>';
		rw += '<td></td>'; // [tsk04]

		for(var i=0;i<tbl.length;i++) { // i = table segment
			for(var j=0;j<tbl[i][0].length;j++) { // row = 0, j = cell
				if(j==tbl[i][0].length-1 && i!=tbl.length-1) {
					rw += '<th>'+htmlchar(tbl[i][0][j])+'</th>'+'<th class="dv"></th><th></th>';
				} else {
					rw += '<th>'+htmlchar(tbl[i][0][j])+'</th>';
				}
			}
		}
		return rw+'</tr>';
	}

	function mkTDrow(tbl,r) {
		const TABLE_LENGTH = tbl.length;
		var rw = '<tr>';

		const NUMEROLINHA = '<td class="numeroLinha">' + r + '</td>';
		rw += NUMEROLINHA;

		var currColor = '';
		var resp = ''; // 'V' ou 'F'.
		const MARCACAO = '<td class="linhaCriticaIdentificador">' + IDENTIFICADOR + '</td>';
		var ehLinhaCritica = false;
		linhaResultante = [];// "zerando" vetor, para a linha corrente ser verificada.

		for(var i=0;i < TABLE_LENGTH;i++) { // i = table segment
			for(var j=0;j < tbl[i][r].length;j++) { // r = row, j = cell
				resp = htmlchar(tbl[i][r][j]);

				if(mcs[i-1]==j) {
					if(TABLE_LENGTH > 2){
						linhaResultante.push(resp);
						if(i == TABLE_LENGTH-1)
							if((ehLinhaCritica = verificarLinha(linhaResultante, r))) quantidadeLinhasCriticas++;
					}
					if(resp == CHARS_SYMBOLS.charTrue) currColor = 'style="color:green"';
					else currColor = 'style="color:red"';

					rw += '<td '+currColor+'>'+ resp +'</td>';
				}
				else if(flag && i>0) rw += '<td></td>'
				else rw += '<td>'+htmlchar(tbl[i][r][j])+'</td>';

				if((j==tbl[i][r].length-1) && (i!=TABLE_LENGTH-1))rw += '<td class="dv"></td><td></td>'
			}
		}
		if(ehLinhaCritica) rw += MARCACAO;
		return rw+'</tr>';
	}

	function verificarLinha(linha, currLine){ // linha = array FIFO; verifica se é linha crítica e a validade do argumento.
		while(linha.length > 1)	if(linha.shift() == CHARS_SYMBOLS.charFalse) return false;
		if(linha.shift() == CHARS_SYMBOLS.charFalse){
			validadeArgumento = "Inválido"; // Encontrou uma conclusão 'F' na linha crítica.
			document.getElementById("validade_argumento").className = "argumentoInvalido";
			//console.error("Falha na linha: "+currLine);
		}
		return true;
	}

} /* END OF htmlTable */


// Table -> String
// Takes a table (as output by mkTable) and returns a text version of the table.
function textTable(table) {
	var rownum = table[0].length;
	var bcind =  []; // an array of arrays of ints, locations of biconditionals
	for(var i=0;i<table.length;i++) {
		bcind.push(bcInd(table[i][0]));
	}
	var out = '';
	out += mkrow(table,0); // make top row
	out += '\r\n'+out.replace(/./g,'-')+'\r\n'; // put a string of '-' beneath the top row
	for(var i=1;i<table[0].length;i++) { // make remaining rows
		out += mkrow(table,i)+'\r\n';
	}
	return out;

	function mkrow(tbl,r) { // makes a table row
		var rw = '';
		for(var i=0;i<tbl.length;i++) { // i = table segment
			for(var j=0;j<tbl[i][r].length;j++) { // r = row, j = cell
				rw += txtchar(tbl[i][r][j])+' '; // add cell char
				if(bcind[i].indexOf(j)>=0 && r!=0) {rw += ' ';} // add space for biconditional
				if(j==tbl[i][r].length-1 && i!=tbl.length-1) {rw += '| ';} // add segment separator
			}
		}
		return rw;
	}
	function bcInd(a) {
		var bc = [];
		a.map(
			function(e,i){
				if(e=='<>') bc.push(i);
			}
		);
		return bc;
	}
}


// Table -> String
// Takes a table (as output by mkTable) and the trees its a table of and returns a LaTex version of the table.
function latexTable(table,trees) {
	var rownum = table[0].length;
	var mcs = []; // indices of the main connectives
	for(var i=0;i<trees.length;i++) {
		mcs.push(mcindex(trees[i]))
	}
	var out = '';
	var dividers = [];// this variable gets updated by the mkrow function; sorry for the non-transparent code
	var colnum = 0;// this variable gets updated by the mkrow function; sorry for the non-transparent code
	var parloc = [];// this variable gets updated by the mkrow function; sorry for the non-transparent code

	out += mkrow(table,0); // make top row
	out += '\\\\\r\n\\hline \r\n'; //
	for(var i=1;i<table[0].length;i++) { // make remaining rows
		out += mkrow(table,i)+'\\\\\r\n';
	}
	var begintable = '\%NOTE: requires \\usepackage{color}\r\n\\begin{tabular}{';
	for(var i=0;i<colnum;i++) {
		if(dividers.indexOf(i)>=0 && dividers.indexOf(i+1)>=0) {
			begintable += ' | c'
		} else if(dividers.indexOf(i)>=0) {
			begintable += parloc.indexOf(i)>=0 ? ' | c@{}' : ' | c@{ }';
		} else if(dividers.indexOf(i+1)>=0) {
			begintable += parloc.indexOf(i)>=0 ? '@{}c@{ }' : '@{ }c';
		} else {
			begintable += parloc.indexOf(i)>=0 ? '@{}c@{}' : '@{ }c@{ }';
		}
	}

	return begintable+'}\r\n'+out+'\\end{tabular}';

	function mkrow(tbl,r) { // makes a table row
		dividers = [];
		colnum = 0;

		var rw = '';
		for(var i=0;i<tbl.length;i++) { // i = table segment
			for(var j=0;j<tbl[i][r].length;j++) { // r = row, j = cell
				if(mcs[i-1]==j && r!=0) {
					rw += '\\textcolor{red}{'+latexchar(tbl[i][r][j])+'} & '; // add main connective cell char
				} else {
					rw += latexchar(tbl[i][r][j])+' & '; // add cell char
				}
				if(r==0) {console.log(tbl[i][r][j]);}
				if(r==0 && (tbl[i][r][j]=='(' || tbl[i][r][j]==')')) {
					parloc.push(colnum+j);
				}
			}
			colnum +=j;
			dividers.push(colnum)
		}
		return rw.substring(0,rw.length-3);
	}
}

// Tree -> Int
// Finds the index of the main connective in the tree
function mcindex(t) {
	if(t.length == 2 || t.length==1) {
		return 0;
	} else {
		return countleaves(t[1])+1;
	}
}

// Tree -> Int
// Takes a tree and returns the number of leaves (terminal nodes) in the tree
function countleaves(t) {
	var out = 0;
	for(var i=0;i<t.length;i++) {
		if(t[i] instanceof Array) {
			out += countleaves(t[i]);
		} else {out += 1;}
	}
	return out;
}

// ([String],[Tree]) -> Table
// Takes an array of formulas and their parse trees and returns a truth table as a
// multidimensional array.  For n formulas, the array contains n+1 elements.  The first
// element is the lhs of the table, and the succeeding elements are the table segments
// for each passed formula.
function mkTable(fs,ts) {
	var lhs = mklhs(fs);
	var rhs = [];
	for(var i=0;i<fs.length;i++) {
		rhs.push(mktseg(fs[i],ts[i],lhs));
	}
	return [lhs].concat(rhs);
}

// [String] -> LHSTable
// Takes an array of strings and makes the left hand side of a table (i.e. the rows
// with all the tv assignments)
function mklhs(fs) {
	var atomic = [];
	var tvrows = [];
	for(var i=0;i<fs.length;i++) {
		atomic = atomic.concat(getatomic(fs[i]))
	}
	atomic = sorted(rmDup(atomic));
	if(atomic.indexOf('#')>=0) {
		tvrows = tvcomb(atomic.length-1);
		tvrows = tvrows.map(function(x) {return [false].concat(x);});
	} else {tvrows = tvcomb(atomic.length);}
	return [atomic].concat(tvrows);
}

// (String, Tree, LHSTable) -> TableSegment
// Takes a tree, the formula it's a tree of, and a LHSTable, and returns a TableSegment
// for the formula
function mktseg(f,t,lhs) {
	var tbrows=[];
	for(var i=1;i<lhs.length;i++) {
		var a = mkAss(lhs[0],lhs[i]);
		var row = evlTree(t,a);
		row = flatten(row);
		tbrows.push(row);
	}
	tbrows = [flatten(t)].concat(tbrows);
	return tbrows;
}

// String -> [Char]
// Takes a wff and returns an array with all the atomic sentences in the wff.  The
// array has duplicates removed and is sorted in alphabetical order.
function getatomic(s) {
	var out = [];
	for(var i=0;i<s.length;i++) {
		if(isA(s[i])) {out.push(s[i]);}
	}
	return out;
}

// Int -> [[Bool]]
// Takes an int n and returns 2^n truth value assignments (each an array)
function tvcomb(n) {
	if(n==0) {return [[]];}
	var prev = tvcomb(n-1);
	var mt = function(x) {return [true].concat(x);};
	var mf = function(x) {return [false].concat(x);};
	return prev.map(mt).concat(prev.map(mf));
}

// ([Char], [Bool]) -> Assignment
// Takes an array of n Chars and an array of n Bools and returns a assignment that
// assigns the nth Bool to the nth Char.
function mkAss(s,b) {
	var a = new Object();
	for(var i=0;i<s.length;i++) {
		a[s[i]] = b[i];
	}
	return a;
}

// Tree -> Array
// Takes an evaluated tree and turns it into a one dimensional array
function flatten(t) {
	if(t.length==5) {
		return [].concat(t[0]).concat(flatten(t[1])).concat(t[2]).concat(flatten(t[3])).concat(t[4]);
	} else if(t.length==2) {
		return [].concat(t[0]).concat(flatten(t[1]));
	} else if(t.length==1) {
		return [].concat(t[0]);
	}
}

// (Tree,Assignment) -> Tree
// Takes a tree and an assignment of booleans to atomic sentences and returns an
// evaluated tree (i.e. with all atomic sentences and connectives replaced by booleans).
function evlTree(t,a) {
	if(t.length==5) {
		var t1 = evlTree(t[1],a);
		var t3 = evlTree(t[3],a);
		return ['',t1,gtTv([t[2],t1,t3]),t3,'']
	} else if(t.length==2) {
		var t1 = evlTree(t[1],a);
		return [gtTv([t[0],t1]),t1];
	} else if(t.length==1) {
		return [a[t[0]]];
	}
}

// Array -> Boolean
// Takes an array, the first element of which is a connective, and the rest of which
// are evaluated trees of the formulas it connects, and returns the truth value
// associated with the connective
function gtTv(arr) {
	switch(arr[0]) {
		case '~' : return !tv(arr[1]);
		case '&' : return tv(arr[1])&&tv(arr[2]);
		case 'v' : return tv(arr[1])||tv(arr[2]);
		case '>' : return (!tv(arr[1])||tv(arr[2]));
		case '<>' : return (tv(arr[1])==tv(arr[2]));
		case '|' : return (!(tv(arr[1])&&tv(arr[2])));
	}
	function tv(x) {
		switch(x.length) {
			case 5 : return x[2];
			case 2 : return x[0];
			case 1 : return x[0];
		}
	}
}

// Remove duplicates from an array
function rmDup(a) {
	return a.filter(function(el,pos) {return a.indexOf(el)==pos;});
}

// [Char] -> [Char]
// Takes an array of chars and returns the array sorted from smallest to largest
function sorted(a) {
	var b = a.map(function(x) {return x.charCodeAt(0);});
	b = b.sort(function(b,c) {return b-c;});
	return b.map(function(x) {return String.fromCharCode(x);});
}


// FORMULA PARSING CODE
//====================

/* THE GRAMMAR
S ::= U S | '(' S B S ')' | A
U ::= '~'
B ::= '&' | 'v' | '>' | '<>' | '|'
A ::= '#' | 'A' | 'B' | 'C' | 'D' | ...
*/

// String -> Tree
// Takes a string and if it's a wff, returns a parse tree of the string, otherwise
// returns an empty array.
function parse(s) {
	if(s.length==0) {return [];}
	var s1 = [];
	var s2 = [];
	if(isU(s[0])) {
		s1 = parse(s.substring(1));
		return s1.length ? [s[0],s1] : [];
	}
	if(s[0] =='(' && s[s.length-1]==')') {
		var a = gSub(s);
		if(a.indexOf(undefined)>=0 || a.indexOf('')>=0) {
			return [];
		} else {
			s1 = parse(a[0]);
			s2 = parse(a[2]);
			if(s1.length && s2.length) {
				return ['(',s1,a[1],s2,')'];
			} else {return [];}
		}
	}
	else {return isA(s) ? [s] : []}
}

// String -> Bool
// Determines if s is an atomic wff
function isA(s) {
	if(s.length!=1) {return false;}
	var pr = '#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz';
	return pr.indexOf(s)>=0;
}


// String -> Bool
// Determines if s begins with a unary connective
function isU(s) {
	return s.indexOf('~')==0;
}

// String -> [String]
// takes a string beginning with '(' and ending with ')', and determines if there is a
// binary connective enclosed only by the outermost parentheses.  If so, returns an array
// with the string to the left and the string to the right of the binary connective;
// otherwise returns an array of three undefined's.
function gSub(s) {
	var stk = [];
	var l = 0;
	for(var i=0;i<s.length;i++) {
		if(s[i]=='(') {
			stk.push('(');
		} else if(s[i]==')' && stk.length>0) {
			stk.pop();
		} else if(stk.length==1 && (l = isB(s.substring(i)))>0) {
			return [s.substring(1,i),s.substring(i,i+l),s.substring(i+l,s.length-1)];
		}
	}
	return [undefined,undefined,undefined];
}

// String -> Int
// takes a string and determines if it begins with a binary connective.  If so, returns
// the length of the connective, otherwise returns 0.
function isB(s) {
	var bc = ['&','v','>','<>','|'];
	for(var i=0;i<bc.length;i++) {
		if(s.indexOf(bc[i]) == 0) {
			return bc[i].length;
		}
	}
	return 0;
}

// String -> Int
// Checks if the string contains any inadmissible characters
function badchar(s) {
	var x = ':,()~v&<>|#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz'; /* [v2.0]7 */
	for(var i=0;i<s.length;i++) {
		if(x.indexOf(s[i])<0) {
			return i;
		}
	}
	return -1;
}
