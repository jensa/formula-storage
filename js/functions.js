
var scalarList, equationList, databaseList, scalarIdInput, scalarValueInput, equationIdInput, equationValueInput;

var scalars = {};
var equations = {};

window.onload = function(){

  scalarList = document.getElementById("scalarvariableList");
  equationList = document.getElementById("equationList");
  databaseList = document.getElementById("databaseList");
  scalarIdInput = document.getElementById("scalarInputId");
  scalarValueInput = document.getElementById("scalarInputValue");
  equationValueInput = document.getElementById("equationInputValue");
  var addScalarButton = document.getElementById("addScalarButton");
  var addEquationButton = document.getElementById("addEquationButton");

  addScalarButton.onclick = function(){
    updateScalar(scalarIdInput.value);
    scalarIdInput.focus()
  }

  addEquationButton.onclick = function(){
    updateEquation(equationValueInput.value);
    equationValueInput.focus()
  }
}

function updateScalar(id){
  addListObject(id, scalarValueInput.value, scalars, 'scalar', scalarList)
  for (var parentId in scalars[id].parents) {
      updateEquation(parentId);
    }
}

function updateEquation(equationText){
  var expr = Parser.parse(equationText);
  var variables = expr.variables();
  var values = {};
  for (var i = 0; i < variables.length; i++) {
    var scalar = scalars[variables[i]];
    if(scalar !== undefined){
      values[variables[i]] = scalars[variables[i]].value;
      //update the scalar's reference list
      // (insert entry into mapping table scalar -> equation)
      scalar.parents[equationText] = equationText;
    }
  }

  addListObject(equationText, expr.evaluate(values), equations, 'equation', equationList)

}

function evaluateSymbols(variables){
  var evaluatedSymbols = {};
  for (var i = 0; i < variables.length; i++) {
    if(scalars[variables[i]] !== undefined){
      evaluatedSymbols[variables[i]] = scalars[variables[i]].value;
    }
  }
  return evaluatedSymbols;
}

function addListObject(id, value, map, objectType, elementList)
{
  var listElement = document.createElement("li")
  listElement.appendChild(document.createTextNode(id + " = " + value));
  if(map[id] !== undefined){
    map[id].value = value;
    map[id].listElement = listElement;
  }
  else{
    map[id] = {id:id, value:value, listElement:listElement, objectType:objectType, parents:[]}
  }
  while (elementList.firstChild) {
    elementList.removeChild(elementList.firstChild);
  }
  for (var objectId in map) {
    elementList.appendChild(map[objectId].listElement);
  }
}

function parseEquation(equation){
  var symbols = [];
  var parsingSymbol = false;
  var currentSymbol = [];
  var symbolIndex = 0;
  for (var i = 0, len = equation.length; i < len; i++) {
    var c = equation[i];
    if(parsingSymbol){
      parsingSymbol = c !== '}'
      if(parsingSymbol){
        currentSymbol[symbolIndex++] = c;
      }
      else{
        //finished parsing symbol
        symbolIndex = 0;
        symbols.push(currentSymbol.join(""))
        currentSymbol = [];
      }
    }
    else{
      parsingSymbol = c === '{'
    }
  }
  //only keep actual symbols
  for (var i = 0; i < symbols.length; i++) {
    if(scalars[symbols[i]] === undefined && equations[symbols[i]] === undefined){
      symbols.splice(i,1);
    }
    else{
      symbols[i] = "{" + symbols[i] + "}";
    }
  }
  return symbols;
}
