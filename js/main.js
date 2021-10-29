import {
  isPlayerNeighbor,
  changePlayerPos,
  getPlayerRow,
  getPlayerColumn,
  getPlayerPrevRow,
  getPlayerPrevColumn,
  getNewWall,
  getFirstPlayerNeighbors,
  canAddWall,
  addWallToGraph,
  getPlayer,
  restart_model,
  playFriend,
  playII,

  getCurrentPlayer,
  getCurrentPlayerRow,
  getCurrentPlayerColumn,
  changeCurrentPlayerPos,
  isCurrentPlayerNeighbor,
  getCurrentPlayerNeighbors,
  isFinish,

  getFirstPlayerWalls,
  getSecondPlayerWalls,
  getIsTwoRealPlayers
} from './model'


//import  {sum} from './model'
let playerSRC = "https://cdn130.picsart.com/343302759059211.png?type=webp&to=min&r=640"
let compSRC = "https://www.pngkit.com/png/full/184-1848773_danganronpa-v3-monokuma-sprite-1-danganronpa-monokuma.png"
document.getElementById("playII_btn").style.backgroundColor = "#d137d5"
//let playerRow = 17;
//let playerColumn = 9;
let playerCellTouched = 0;
let lightCells = []
//let graph = {}
//graphInit(graph);
//console.log(graph)

let firstPlayer = {
  prevPos: {
    row: MtoVCellConverter(getPlayer(0).prevPos.row),
    column: MtoVCellConverter(getPlayer(0).prevPos.column),
  },
  row: MtoVCellConverter(getPlayer(0).row),
  column: MtoVCellConverter(getPlayer(0).column),
  wallsAmount: getPlayer(0).wallsAmount,
  finishCellRow: getPlayer(0).finishCellRow,
  changePos: getPlayer(0).changePos
}
let secondPlayer = {
  prevPos: {
    row: MtoVCellConverter(getPlayer(1).prevPos.row),
    column: MtoVCellConverter(getPlayer(1).prevPos.column),
  },
  row: MtoVCellConverter(getPlayer(1).row),
  column: MtoVCellConverter(getPlayer(1).column),
  wallsAmount: getPlayer(1).wallsAmount,
  finishCellRow: getPlayer(1).finishCellRow,
  changePos: getPlayer(1).changePos
}
let playersV = [firstPlayer, secondPlayer]
let currentPlayer = playersV[0]

function updatePlayer(num) {
  playersV[num].prevPos.row = MtoVCellConverter(getPlayer(num).prevPos.row)
  playersV[num].prevPos.column = MtoVCellConverter(getPlayer(num).prevPos.column)
  playersV[num].row = MtoVCellConverter(getPlayer(num).row)
  playersV[num].column = MtoVCellConverter(getPlayer(num).column)
  playersV[num].wallsAmount = getPlayer(num).wallsAmount
  playersV[num].changePos = getPlayer(num).changePos
}

function updateCurrentPlayer() {
  if (currentPlayer === playersV[0]) {
    updatePlayer(0)
  } else {
    updatePlayer(1)
  }
}

function getCurrentPlayerIMGURL(currentPlayer) {
  if (!currentPlayer) {
    return "https://cdn130.picsart.com/343302759059211.png"
  } else {
    return "https://www.pngkit.com/png/full/184-1848773_danganronpa-v3-monokuma-sprite-1-danganronpa-monokuma.png"
  }
}

function getCurrentPlayerRowConverted() {
  return MtoVCellConverter(getCurrentPlayerRow())

}

function getCurrentPlayerColumnConverted() {
  return MtoVCellConverter(getCurrentPlayerColumn())
}

function getPlayerRowConverted(num) {
  return MtoVCellConverter(getPlayerRow(num))

}

function getPlayerColumnConverted(num) {
  return MtoVCellConverter(getPlayerColumn(num))
}

function getPlayerPrevRowConverted(num) {
  return MtoVCellConverter(getPlayerPrevRow(num))

}

function getPlayerPrevColumnConverted(num) {
  return MtoVCellConverter(getPlayerPrevColumn(num))
}

function VtoMCellConverter(rowOrColumn) {
  return (parseInt(rowOrColumn) + 1) / 2
}

function MtoVCellConverter(rowOrColumn) {
  return parseInt(rowOrColumn) * 2 - 1
}

window.onload = function () {
  generatePlayer(17, 9, 0)
  generatePlayer(1, 9, 1)

  let gameOver = document.getElementById("gameOver");
  gameOver.width = 500;
  gameOver.height = 300;
  gameOver.style.position = "absolute";
  gameOver.style.left = "-500px";
  gameOver.style.top = "-300px";
  gameOver.style.backgroundColor = "blue";

  document.getElementById("firstPlayerWalls").innerText = getFirstPlayerWalls()
  document.getElementById("secondPlayerWalls").innerText = getSecondPlayerWalls()

}

/*
restart_btn.onclick = function() {
  alert('Клик!');
};*/
let body = document.getElementById("game-board");
function generate_table() {


  // get the reference for the body
  //console.log(sum(1,2));
  body = document.getElementById("game-board");
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
        /*if (event.target.id === 'playII') {
          restart_model()
          playII()
          generatePlayer(17, 9, 0)
          generatePlayer(1, 9, 1)
        } else if (event.target.id === 'playFriend') {
          restart_model()
          playFriend()
          generatePlayer(17, 9, 0)
          generatePlayer(1, 9, 1)
        }*/

        if (isFinish()) {
          return
        }
        let currentPlayerNum = JSON.parse(JSON.stringify(getCurrentPlayer()))
        //console.log("currentPlayer" + currentPlayerNum)
        //console.log(event.target.dataset.type, event.target.id, event.target.dataset.row, event.target.dataset.column)
        if (event.target.dataset.type === 'cell' && event.target.dataset.row === currentPlayer.row.toString() && event.target.dataset.column === currentPlayer.column.toString()) {
          console.log("тикнули гравця")
          playerCellTouched = 1; //вибираємо куди піти
          console.log("тикнули гравця реально")

          for (let neighborCell of getCurrentPlayerNeighbors()) {
            // console.log(neighborCell)
            if (neighborCell != null) {
              let cell = document.getElementById(MtoVCellConverter(neighborCell.pos.row) + "-" + MtoVCellConverter(neighborCell.pos.column))
              //console.log(MtoVCellConverter(neighborCell.pos.row) + "-" + MtoVCellConverter(neighborCell.pos.column))
              //console.log(cell)
              lightCells.push(cell)
              cell.style.backgroundColor = "#d137d5"
            }
          }
          /*підсвітити cell поруч в які можна піти! (в яких сусіди не нал)*/
        } else {
          if (playerCellTouched && isCurrentPlayerNeighbor(VtoMCellConverter(event.target.dataset.row) + "-" + VtoMCellConverter(event.target.dataset.column))) {
            removePlayer(currentPlayer.row, currentPlayer.column)


            changeCurrentPlayerPos(VtoMCellConverter(event.target.dataset.row), VtoMCellConverter(event.target.dataset.column), currentPlayerNum)
            chCPhtml()
            updateCurrentPlayer()
            //let playerRow = event.target.dataset.row
            //let playerColumn = event.target.dataset.column
            //console.log("генерили тут", playerRow + "-" + playerColumn)
            //playerRow = event.target.dataset.row
            //playerColumn = event.target.dataset.column
            //console.log("генеримо тут", playerRow + "-" + playerColumn)
            if (isFinish() === 1) {
              alert("Game over! Виграв гравець")
            }
            generatePlayer(currentPlayer.row, currentPlayer.column, currentPlayerNum)
            if (!getIsTwoRealPlayers()/*&&getCurrentPlayer()===1*/) {
              console.log("II запускається")
              goII()

            } else {
              chCP()
            }
            //console.log("гравці",playersV)
            //if(isFinish){alert("Game over! Виграв гравець")
            //if

          }
          playerCellTouched = 0
          if (lightCells.length !== 0) {
            for (let lightCell of lightCells) {
              lightCell.style.backgroundColor = "#ccc"

            }
          }
        }

        if (event.target.dataset.type === 'vborder') {
          //console.log(event.target)
          //console.log(event.target.dataset.row)

          //console.log(parseInt(event.target.dataset.row), VtoMCellConverter(event.target.dataset.row))
          //console.log(parseInt(event.target.dataset.column) - 1, VtoMCellConverter(parseInt(event.target.dataset.column) - 1))

          if (canAddWall(VtoMCellConverter(parseInt(event.target.dataset.row)), VtoMCellConverter(parseInt(event.target.dataset.column) - 1), event.target.dataset.type)) {
            addWallToGraph(VtoMCellConverter(parseInt(event.target.dataset.row)), VtoMCellConverter(parseInt(event.target.dataset.column) - 1), event.target.dataset.type)
            chCPhtml()
            updatePWallsCounter()
            console.log("я тут")

            modifyVerticalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)
            if (!getIsTwoRealPlayers()/*&&getCurrentPlayer()===1*/) {
              console.log("II запускається")
              goII()
            } else {
              chCP()
            }
            //console.log("гравці",playersV)
          }
        } else if (event.target.dataset.type === 'hborder') {

          //console.log(parseInt(event.target.dataset.row) + 1, VtoMCellConverter(parseInt(event.target.dataset.row) + 1))
          //console.log(parseInt(event.target.dataset.column), VtoMCellConverter(parseInt(event.target.dataset.column)))

          if (canAddWall(VtoMCellConverter(parseInt(event.target.dataset.row) + 1), VtoMCellConverter(parseInt(event.target.dataset.column)), event.target.dataset.type)) {
            addWallToGraph(VtoMCellConverter(parseInt(event.target.dataset.row) + 1), VtoMCellConverter(parseInt(event.target.dataset.column)), event.target.dataset.type)
            chCPhtml()
            updatePWallsCounter()
            console.log("я тут")
            modifyHorizontalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)
            if (!getIsTwoRealPlayers()/*&&getCurrentPlayer()===1*/) {
              console.log("II запускається")
              goII()

            } else {
              chCP()
            }
          }

          //modifyHorizontalWallColor(event.target.id, event.target.dataset.row, event.target.dataset.column)
          chCP()
          console.log("гравці", playersV)
        }
        /*cellEvent(event.target.dataset.row, event.target.dataset.column)*/
        else {
          console.log("фігня")
          console.log(getCurrentPlayerRow() + "" + getCurrentPlayerColumn())
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
function goII() {
  updatePlayer(1)
  if (playersV[1].changePos) {
    removePlayer(playersV[1].prevPos.row, playersV[1].prevPos.column)
    generatePlayer(playersV[1].row, playersV[1].column, 1)
  }else {
  console.log("wallType", getNewWall().wallType)
  if (getNewWall().wallType === "vborder" && getNewWall().player === 1) {

    modifyVerticalWallColor(MtoVCellConverter(getNewWall().rowN) + "-" + (parseInt(MtoVCellConverter(getNewWall().columnN)) + 1), MtoVCellConverter(getNewWall().rowN), (parseInt(MtoVCellConverter(getNewWall().columnN)) + 1))
    document.getElementById("secondPlayerWalls").innerText = getSecondPlayerWalls()
  } else if (getNewWall().wallType === "hborder" && getNewWall().player === 1) {
    console.log("hborder")
    modifyHorizontalWallColor(parseInt(MtoVCellConverter(getNewWall().rowN)) - 1 + "-" + MtoVCellConverter(getNewWall().columnN), parseInt(MtoVCellConverter(getNewWall().rowN)) - 1, MtoVCellConverter(getNewWall().columnN))
    document.getElementById("secondPlayerWalls").innerText = getSecondPlayerWalls()
  }}

}

function updatePWallsCounter() {
  document.getElementById("firstPlayerWalls").innerText = getFirstPlayerWalls()
  document.getElementById("secondPlayerWalls").innerText = getSecondPlayerWalls()
}

document.getElementById("restart_btn").addEventListener("click", () => restart());
document.getElementById("playII_btn").addEventListener("click", () => playII_btn());
document.getElementById("playFriend_btn").addEventListener("click", () => playFriend_btn());

function playII_btn() {
  document.getElementById("playFriend_btn").style.backgroundColor = ""
  document.getElementById("playII_btn").style.backgroundColor = "#d137d5"
  playII()
  restart()
}

function playFriend_btn() {
  document.getElementById("playII_btn").style.backgroundColor = ""
  document.getElementById("playFriend_btn").style.backgroundColor = "#d137d5"
  playFriend()
  restart()
}

function restart() {
  //body.removeEventListener('click', gameBoard);
  document.getElementById("game-board").innerHTML = "";
  restart_model()
  updatePlayer(0)
  updatePlayer(1)
  currentPlayer = playersV[0]
  playerCellTouched = 0;
  lightCells = []
  generate_table()
  generatePlayer(playersV[0].row, playersV[0].column, 0)
  generatePlayer(playersV[1].row, playersV[1].column, 1)
  updatePWallsCounter()
  chCPhtml()


}

function chCPhtml() {
  //getCurrentPlayerIMGURL(getCurrentPlayer())
  if (document.getElementById('currentPlayer').src !== getCurrentPlayerIMGURL(getCurrentPlayer())) {
    //console.log(getCurrentPlayerIMGURL(getCurrentPlayer()))
    document.getElementById('currentPlayer').src = getCurrentPlayerIMGURL(getCurrentPlayer())
  }
}

function chCP() {

  if (currentPlayer === playersV[0]) {
    currentPlayer = playersV[1]
  } else {
    currentPlayer = playersV[0]
  }
}


// Функция, изменяющая цвет
function modifyVerticalWallColor(elemId, elemDataRow, elemDataColumn, color = "#22cad2") {
  if (elemDataRow === '17') return
  //console.log(elemId);
  //console.log(elemDataRow);
  //console.log(elemDataColumn);
  //console.log((parseInt(elemDataRow) + 1) + "-" + elemDataColumn);
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

function invCurrentPlayer() {

}

function generatePlayer(row, column, currentPlayer) {
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
  if (!currentPlayer) {

    /*playerImg.id = "playerImg"
    playerImg.src = playerSRC;*/
    //playerCell.style.backgroundImage = "url('https://cdn130.picsart.com/343302759059211.png')";
    playerCell.style.backgroundImage = "url('https://cdn130.picsart.com/343302759059211.png')";
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
