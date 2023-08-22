///////////REGEX/////////

// const question = /([0-9]+)\ ([^\n]+)\n((?:([1-9]+)\.\ ([^\n]+))\n)+([^\n\0])+/u;
const just_question = /([0-9]+) ([^\n]+)\n/u;
const single_answer = /(?:([1-9]+)\. ([^\n]+))\n/u;
const correct_answer = /([^\n\0])+/u;

const roger_request = /([0-9]+) /u
// hasta que se acabe el fichero
// casa con just_question
// si casa, guarda la pregunta y el numero
// hasta que single_answer no case, casa single answer y guarda en un array
// cuando single_answer no case, casa correct_answer
// si casa, guardalo aunque no nos hace falta
// procesa toda la informacion

// let fs = require('fs');
// if (process.argv.length < 3) {
//   console.log('Usage: node ' + process.argv[1] + ' FILENAME');
//   process.exit(1);
// }
// filename = process.argv[2];


function main(fileName) {
  if (typeof fileName == "string") {
    let text = fs.readFileSync(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      console.log("ERROR ERROR " + data);
      return data;
    });
    format(text);
  } else {
    throw Error("A la aplicación no se le ha pasado una dirección a un fichero.");
  }
}
let first_time = true;
function questionProcessor(number, number2, question) {
  /*MI solución medio funciona lol
  Pero hay strings vacíos en preguntas de un dígito y 
  casos raros ¿¿como el 15 en sin_procesar_completo.txt??. */
  // console.log("Number: |" + number + number2 + "|");
  if(number2) {
    return `::Pregunta ${number}${number2}:: ${question.slice(1, -1)} {\n`;
  }else return `::Pregunta ${number}:: ${question.slice(0, -1)} {\n`;
  /*!!Preguntas de dos dígitos(p. ej 15, 28, 34...) solo capta el primero.
  Así que una hilera 10-19 aparecen todas como "Pregunta 1"*/
}

function answerProcessor(answer) {
  return `~${answer}\n`; //Para que funcione bien el el navegador curiosamente hay que añadir un \n...
}

function generalTextProcessor(text){
    //
}

function questionNumberProcessor(text) {
  text_copy = text;
  // Recibe "1 " y debe devolver "::Pregunta 1::"
  num_question = text_copy.slice(0, -1);
  text = "::Pregunta " + num_question + "::";
}

function finalLineProcessor(text){
  text = "}\n"; 
  return text;
}

function addLlave(text) {
  return text + " {";
}

//---------------------------------------------

function format(text) {
    let lines = text.split('\n');
    // console.log("\tDEBUG: LINE TEX:|" + lines[2] + "|");
    // console.log("\tDEBUG: lines size: |" + lines.length + "|")
    let catch_next_question = true;
    let question;
    let answers = [];
    let final_output = "";
    let number, number2;
    for (let line of lines) {
      if (catch_next_question) {
        question = line;
        number = question[0];
        //Roger prueba para captar el segundo dígito
        number2;
        if(question[1] != " ") {number2 = question[1];}
        //Funciona pero también capta espacios en blanco.
        let question_itself = line.substring(2);
        final_output += questionProcessor(number, number2, question_itself);
        catch_next_question = false;
        continue;
      }
      if (/[1-9]\./u.exec(line)) {
        // console.log("Match: |" + /[1-9]\./u.exec(line)[0][0] + "|");
        // console.log("Line[0]: |" + line[0] + "|");
        let matched_digit = /[1-9]\./u.exec(line)[0][0];
        if (matched_digit === line[0]) {
          let answer = line.substring(3);
          final_output += answerProcessor(answer);
          continue;
        }
      }
      final_output += "}\n\n";
      catch_next_question = true;
    }
    final_output = final_output.slice(0, -27); // full cochinada , it do be true
    return final_output;
    // const fs = require('fs');
    // fs.writeFile('procesado.txt', final_output, () => {}); Ya no hace falta ya que usamos una web
}

function manager() {
    let text = document.getElementById("recipient").value;
    // console.log(format(text));
    document.getElementById("target").value = format(text);
}
//En esencia en la web solo hay que coger el texto y pasarlo como argumento a function format
//Despues introducir en el segundo textarea el resultado.
// main(filename);