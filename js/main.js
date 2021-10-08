
import {
  isPlayerNeighbor,
  changePlayerPos,
  getFirstPlayerRow,
  getFirstPlayerColumn,
  getFirstPlayerNeighbors
} from './model'


//import  {sum} from './model'
let playerSRC = "https://cdn130.picsart.com/343302759059211.png?type=webp&to=min&r=640"
let compSRC = "https://www.pngkit.com/png/full/184-1848773_danganronpa-v3-monokuma-sprite-1-danganronpa-monokuma.png"

//let playerRow = 17;
//let playerColumn = 9;
let playerCellTouched = 0;
let lightCells = []
//let graph = {}
//graphInit(graph);
//console.log(graph)

function getFirstPlayerRowConverted() {
  return MtoVCellConverter(getFirstPlayerRow())

}

function getFirstPlayerColumnConverted() {
  return MtoVCellConverter(getFirstPlayerColumn())
}

function VtoMCellConverter(rowOrColumn) {
  return (parseInt(rowOrColumn) + 1) / 2
}

function MtoVCellConverter(rowOrColumn) {
  return parseInt(rowOrColumn) * 2 - 1
}

window.onload = function () {
  generatePlayer(getFirstPlayerRowConverted(), getFirstPlayerColumnConverted(), 1)
  generatePlayer(1, 9, 0)
}

function generate_table() {
  // get the reference for the body
  //console.log(sum(1,2));
  let body = document.getElementById("game-board");
  let tbl = document.createElement("div");
  tbl.className = "div-table";

  // creating all cells
  for (let i = 1; i <= 17; i++) {
    // creates a table row
    let row = document.createElement("div");
    row.className = "div-table-row";

    const isBorderRow = i % 2 === 0
    if (isBorderRow) {
      row.style.height = "3%";
    } else {
      row.style.height = "9%";
    }

    for (let j = 1; j <= 17; j++) {
      let cell = document.createElement("div");
      cell.className = "div-table-cell";
      cell.dataset.row = i.toString();
      cell.dataset.column = j.toString();
      cell.id = i + "-" + j
      const isBorderCell = j % 2 === 0

      if (isBorderCell) {
        cell.style.width = "3%";
        cell.dataset.type = isBorderRow ? 'none' : 'vborder'
      } else {
        cell.style.width = "9%";
        cell.dataset.type = isBorderRow ? 'hborder' : 'cell'
      }

      //let cellText = document.createTextNode("cell in row "+i+", column "+j);
      //let cellText = document.createTextNode(i+"-"+j);

      //cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tbl.appendChild(row);
  }
  body.appendChild(tbl);
  body.addEventListener('click', event => {
      if (event.target.id) {
        console.log(event.target.dataset.type, event.target.id, event.target.dataset.row, event.target.dataset.column)
        if (event.target.dataset.type === 'cell' && event.target.dataset.row === getFirstPlayerRowConverted().toString() && event.target.dataset.column === getFirstPlayerColumnConverted().toString()) {
          console.log("тикнули гравця")
          playerCellTouched = 1; //вибираємо куди піти
          for (let neighborCell of getFirstPlayerNeighbors()) {
            console.log(neighborCell)
            if (neighborCell != null) {
              let cell = document.getElementById(MtoVCellConverter(neighborCell.pos.row) + "-" + MtoVCellConverter(neighborCell.pos.column))
              console.log(MtoVCellConverter(neighborCell.pos.row) + "-" + MtoVCellConverter(neighborCell.pos.column))
              console.log(cell)
              lightCells.push(cell)
              cell.style.backgroundColor = "#d137d5"
            }
          }
          /*підсвітити cell поруч в які можна піти! (в яких сусіди не нал)*/
        } else {
          if (playerCellTouched && isPlayerNeighbor(VtoMCellConverter(event.target.dataset.row) + "-" + VtoMCellConverter(event.target.dataset.column), 1)) {
            removePlayer(getFirstPlayerRowConverted(), getFirstPlayerColumnConverted())
            changePlayerPos(VtoMCellConverter(event.target.dataset.row), VtoMCellConverter(event.target.dataset.column))
            //playerRow = event.target.dataset.row
            //playerColumn = event.target.dataset.column
            generatePlayer(getFirstPlayerRowConverted(), getFirstPlayerColumnConverted(), 1)
          }
          playerCellTouched = 0
          if (lightCells.length != 0) {
            for (let lightCell of lightCells) {
              lightCell.style.backgroundColor = "#ccc"

            }
          }
        }

        if (event.target.dataset.type === 'vborder') {
          modifyVerticalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)

        } else if (event.target.dataset.type === 'hborder') {
          modifyHorizontalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)

        }
        /*cellEvent(event.target.dataset.row, event.target.dataset.column)*/
        else {

        }

      }
    }
  )

  /* body.addEventListener('mouseover', event => {
     if (event.target.id ) {
       console.log(event.target.dataset.type, event.target.id, event.target.dataset.row, event.target.dataset.column)

       if(event.target.dataset.type === 'vborder') {
         modifyVerticalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)
       }else if (event.target.dataset.type === 'hborder'){
         modifyHorizontalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)
       }
     }
   })

   body.addEventListener('mouseout', event => {
     if (event.target.id ) {
       console.log(event.target.dataset.type, event.target.id, event.target.dataset.row, event.target.dataset.column)

       if(event.target.dataset.type === 'vborder') {
         modifyVerticalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column, "#ccc")
       }else if (event.target.dataset.type === 'hborder'){
         modifyHorizontalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column,"#ccc")
       }
     }
   })*/
}


// Функция, изменяющая цвет
function modifyVerticalWallColor(elemId, elemDataRow, elemDataColumn, color = "#22cad2") {
  if (elemDataRow === '17') return
  console.log(elemId);
  console.log(elemDataRow);
  console.log(elemDataColumn);
  console.log((parseInt(elemDataRow) + 1) + "-" + elemDataColumn);
  let element = document.getElementById(elemId);
  let elementDot = document.getElementById((parseInt(elemDataRow) + 1) + "-" + elemDataColumn);
  let elementUnderDot = document.getElementById((parseInt(elemDataRow) + 2) + "-" + elemDataColumn);
  element.style.backgroundColor = color;
  elementDot.style.backgroundColor = color;
  elementUnderDot.style.backgroundColor = color;
}

function modifyHorizontalWallColor(elemId, elemDataRow, elemDataColumn, color = "#22cad2") {
  console.log(elemId);
  console.log(elemDataRow);
  console.log(elemDataColumn);
  console.log((parseInt(elemDataRow) + 1) + "-" + elemDataColumn);
  let element = document.getElementById(elemId);
  let elementDot = document.getElementById(elemDataRow + "-" + (parseInt(elemDataColumn) + 1));
  let elementUnderDot = document.getElementById(elemDataRow + "-" + (parseInt(elemDataColumn) + 2));
  element.style.backgroundColor = color;
  elementDot.style.backgroundColor = color;
  elementUnderDot.style.backgroundColor = color;
}

function generatePlayer(row, column, isMainPlayer) {
  /*row=(row+1)/2
  column=(column+1)/2*/
  let playerCell = document.getElementById(row + "-" + column)
  console.log(playerCell);
  /*
    let playerImg = document.createElement("img");
    playerImg.dataset.row=row;
    playerImg.dataset.column=column;                      просто міняємо фон ячейки
    playerImg.style.width = "40px";
    playerImg.style.height = "40px";*/
  if (isMainPlayer) {

    /*playerImg.id = "playerImg"
    playerImg.src = playerSRC;*/
    playerCell.style.backgroundImage = "url('https://cdn130.picsart.com/343302759059211.png?type=webp&to=min&r=640')";
    playerCell.style.backgroundSize = "cover"
  } else {
    /* playerImg.id = "compImg"
     playerImg.src = compSRC;*/
    playerCell.style.backgroundImage = "url('https://www.pngkit.com/png/full/184-1848773_danganronpa-v3-monokuma-sprite-1-danganronpa-monokuma.png')";
    playerCell.style.backgroundSize = "cover"
  }
  //playerCell.appendChild(playerImg);
}

function removePlayer(row, column)/*пишемо щоб і на другого гравця теж діяло, хоча картинку треба буде поміняти*/ {
  /*let playerImg = document.getElementById("playerImg");
  playerImg.parentNode.removeChild(playerImg);*/
  document.getElementById(row + "-" + column).style.backgroundImage = '';
}

generate_table()

// Функция, добавляющая обработчик к таблице
//el = document.getElementById("outside");
//el.addEventListener("click", function(){modifyText("четыре")}, false);
