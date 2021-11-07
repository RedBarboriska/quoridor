/*import {

    getNewWall,
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
    getIsTwoRealPlayers,
    resetCounterModel, changePlayerPos
} from './model.js';
import express from 'express';*/
const prompt = require('prompt-sync')();
const model = require('./model');

//const playerColor = prompt('Chose your color: black|white  ');
//console.log(`Hey there ${playerColor}`);
let cellColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
let wallColumns = ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function cellGraphInit(graph) {
  let first = 1;
  let last = 9;
  for (let i = first; i <= last; i++) {
    for (let j = 0; j <= 8; j++) {
      graph[cellColumns[j] + i] = {pos: {row: i, column: j}, name: cellColumns[j] + i}
    }
  }
  for (let i = first; i <= last; i++) {
    for (let j = 0; j <= 8; j++) {
      graph[cellColumns[j] + i].leftN = j - 1 < 0 ? null : graph[cellColumns[j - 1] + i];
      graph[cellColumns[j] + i].rightN = j + 1 > 8 ? null : graph[cellColumns[j + 1] + i];
      graph[cellColumns[j] + i].bottomN = i + 1 > last ? null : graph[cellColumns[j] + (i + 1)];
      graph[cellColumns[j] + i].topN = i - 1 < first ? null : graph[cellColumns[j] + (i - 1)];
    }
  }
}

function wallGraphInit(graph) {
  let first = 1;
  let last = 8;
  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {
      graph[wallColumns[j - 1] + i] = {
        pos: {row: i, column: j},
        name: wallColumns[j - 1] + i,
        hborder: (i + 1) + '-' + j,
        vboarder: i + "-" + j
      }
    }
  }
  /*for (let i = first; i <= last; i++) {
      for (let j = 0; j <= 7; j++) {
          graph[wallColumns[j]+i].leftN = j - 1 < 0 ? null : graph[wallColumns[j-1]+i];
          graph[wallColumns[j]+i].rightN = j + 1 > 7 ? null : graph[wallColumns[j+1]+i];
          graph[wallColumns[j]+i].bottomN = i + 1 > last ? null : graph[wallColumns[j]+(i+1)];
          graph[wallColumns[j]+i].topN = i - 1 < first ? null : graph[wallColumns[j]+(i-1)];
      }
  }*/
}

let wallGraph = {}
wallGraphInit(wallGraph)
program()
function program(){
  let playerColor
  while (true) {
    playerColor = prompt('Chose bot color: black|white: '); //колір бота
    console.log(`Bot color ${playerColor}`);
    if(playerColor === 'black' || playerColor === 'white'){
      break
    }
  }
  while (!model.isFinish()) {
    hod()
  }
}

function hod() {
  let currentColor
  currentColor = model.getCurrentPlayer() === 0 ? 'white' : 'black';
  const userInput = prompt(`${currentColor} turn  `);
  const chars = userInput.split(' ');
  console.log(chars)
  switch (chars[0].toLowerCase()) {
    case 'move':
      move(chars[1])
      console.log("move")
      break;
    case 'wall':
      wall(chars[1])
      console.log("wall")
      break;
    case 'jump':
      console.log("jump")
      jump()
      break;
    default:
      console.log("try again")
      break;
  }
  console.log("white cell: ", cellColumns[parseInt(model.getPlayer(0).column)-1],model.getPlayer(0).row)
  console.log("white walls left: ", model.getPlayer(0).wallsAmount)
  console.log("black cell: ", cellColumns[parseInt(model.getPlayer(1).column)-1],model.getPlayer(1).row)
  console.log("white walls left: ", model.getPlayer(1).wallsAmount)
  if(model.isFinish()){
    console.log(`${currentColor} won`)
    console.log("white wins: ", model.getPlayer(0).points)
    console.log("black wins: ", model.getPlayer(1).points)
    let isRestart
    while(true){
      isRestart = prompt('Restart?: yes|no: '); //колір бота
      if(isRestart.toLowerCase() === 'yes' ){
        model.restart_model()
        break
      }else if (isRestart.toLowerCase() === 'no'){break}
    }
  }
}

function move(cell) {
  let chars = cell.toUpperCase().split('')
  if (!cellColumns.includes(chars[0]) || !(chars[1] >= '1' && chars[1] <= '9')) {
    console.log('return')
    return;
  }

  let letter = chars[0]
  let row = chars[1]
  //console.log(model.getCurrentPlayer())
  //console.log(model.getCurrentPlayerNeighbors())
  let column = (cellColumns.indexOf(letter) + 1)
  let modelCell = row + '-' + column
  console.log(modelCell)
  if (model.isCurrentPlayerNeighbor(modelCell)) {
    model.changeCurrentPlayerPos(row, column)
    console.log('changed')
  }
  //console.log(model.isCurrentPlayerNeighbor('1-1'))
  //console.log(model.isCurrentPlayerNeighbor('9-4'))
  //console.log(model.isCurrentPlayerNeighbor('2-5'))
  //model.changeCurrentPlayerPos(1,1)
  //changePlayerPos()
}

function jump() {
  /*let opponentNum
  let currentNum = model.getCurrentPlayer()
  if (currentNum===0){opponentNum=1}else {opponentNum=0}
  let currentPlayer = model.getPlayer(currentNum)
  let opponentPlayer = model.getPlayer(opponentNum)
  let neighbords*/
  model.jumpOver()
}

function wall(wall) {
  let chars = wall.split('')
  if (!wallColumns.includes(chars[0].toUpperCase())) {
    return;
  }
  let column = (wallColumns.indexOf(chars[0].toUpperCase()) + 1)
  let row = chars[1]
  let type
  if (chars[2] === 'v') {
    type = 'vborder'
    if (model.canAddWall(row, column, type)) {
      model.addWallToGraph(row, column, type)
    } else {
      return;
    }
  } else if (chars[2] === 'h') {
    type = 'hborder'
    if (model.canAddWall((parseInt(row) + 1), column, type)) {
      model.addWallToGraph((parseInt(row) + 1), column, type)
    } else {
      return;
    }
  } else {
    return
  }

  // wallGraph[cell]
  //changePlayerPos()
}


function gameBoard(event) {
  if (event.target.id) {


    if (isFinish()) {
      return
    }
    let currentPlayerNum = JSON.parse(JSON.stringify(getCurrentPlayer()))
    if (event.target.dataset.type === 'cell' && event.target.dataset.row === currentPlayer.row.toString() && event.target.dataset.column === currentPlayer.column.toString()) {
      console.log("тикнули гравця")
      playerCellTouched = 1; //вибираємо куди піти
      console.log("тикнули гравця реально")

      for (let neighborCell of getCurrentPlayerNeighbors()) {
        if (neighborCell != null) {
          let cell = document.getElementById(MtoVCellConverter(neighborCell.pos.row) + "-" + MtoVCellConverter(neighborCell.pos.column))
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
        let finish = isFinish()
        if (isFinish() === 1) {
          if (currentPlayerNum) {
            alert("Game over! Виграв другий гравець")
            document.getElementById("spPoints").textContent = playersV[1].points

          } else {
            alert("Game over! Виграв перший гравець")
            document.getElementById("fpPoints").textContent = playersV[0].points
          }
        }
        generatePlayer(currentPlayer.row, currentPlayer.column, currentPlayerNum)
        if (!getIsTwoRealPlayers()/*&&getCurrentPlayer()===1*/) {
          console.log("II запускається")
          goII()
          if (isFinish() !== finish) {
            alert("Game over! Виграв другий гравець")
            document.getElementById("spPoints").textContent = playersV[1].points
          }

        } else {
          chCP()
        }

      }
      playerCellTouched = 0
      if (lightCells.length !== 0) {
        for (let lightCell of lightCells) {
          lightCell.style.backgroundColor = "#ccc"

        }
      }
    }

    if (event.target.dataset.type === 'vborder') {


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

      }
    } else if (event.target.dataset.type === 'hborder') {


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


      console.log("гравці", playersV)
    } else {
      console.log("фігня")
      console.log(getCurrentPlayerRow() + "" + getCurrentPlayerColumn())
    }

  }
}
