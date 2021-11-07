import IAI from './Interfaces/IAI'
import { IField, Move } from './Interfaces/IField'
import { astar } from '../astar'
import * as v8 from 'v8'

import { player1WinRow, player2WinRow } from "./Constants/GameConstants";

class AI implements  IAI{
  private readonly startDepth: number
  private readonly startAlpha: number = -999
  private readonly startBeta: number = 999

  constructor(depth) {
    this.startDepth = depth
  }

  public getBestMove(field: IField, playerNumber: number): Object {
    const color: number = this.playerToColor(playerNumber)
    return this.negascout(field, this.startDepth, this.startAlpha, this.startBeta, color)
  }

  private playerToColor(playerNumber: number): number {
    return playerNumber === 1 ? 1 : -1
  }

  private negascout(field: IField, depth: number, alpha: number, beta: number, color: number): Move {
    if (depth === 0  || this.checkWin(field, color)) {
      field.bestPossibleMove.value = this.sev(field, color)
      return field.bestPossibleMove;
    }
    const childPositions = this.generatePositions(field, color, depth)
    let counter = 0

    for (const childPosition of childPositions) {
      let negascoutRes

      if (counter === 0) {
        negascoutRes = -((this.negascout(childPosition, depth - 1, -beta, -alpha, -color)).moveValue)
      }
      else {
        negascoutRes = -(this.negascout(childPosition, depth - 1, -alpha - 1, -alpha, -color).moveValue)
        if (negascoutRes > alpha && negascoutRes < beta) {
          negascoutRes = -(this.negascout(childPosition, depth - 1, -beta, -alpha, -color).moveValue)
        }
      }

      if (negascoutRes > alpha && depth === this.startDepth) {
        field.bestPossibleMove = childPosition.bestPossibleMove
      }
      alpha = Math.max(alpha, negascoutRes)
      childPosition.bestPossibleMove.moveValue = alpha

      counter++

      if(alpha >= beta) break
    }

    return field.bestPossibleMove
  }

  /**
  * generate all possible positions
  * */
  private generatePositions(field: IField, color: number, depth: number): Array<IField> {
    const playerNumber = this.playerToColor(color)
    const possiblePositions: Array<IField> = []

    for (const availablePositionToMove of field.getCellsForMove(playerNumber)) {
      const newField: IField = v8.deserialize(v8.serialize(field))
      newField.makeMove(playerNumber, availablePositionToMove)
      newField.bestPossibleMove = availablePositionToMove
      possiblePositions.push(newField)
    }

    if (depth !== this.startDepth) return possiblePositions

    for (let x = 1; x < 9; x++) {
      for (let y = 1; y < 9; y++) {
        const newWallV: Move = { x, y, type: 'wall', wallOrientation: 'vborder'}
        const newWallH: Move = { x, y, type: 'wall', wallOrientation: 'hborder'}

        if(field.canAddWall(newWallV.x, newWallV.y, newWallV.wallOrientation)){
          const newField: IField = v8.deserialize(v8.serialize(field))
          newField.makeMove(playerNumber, newWallV)
          newField.bestPossibleMove = newWallV
          possiblePositions.push(newField)
        }
        if(field.canAddWall(newWallH.x, newWallH.y, newWallH.wallOrientation)){
          const newField: IField = v8.deserialize(v8.serialize(field))
          newField.makeMove(playerNumber, newWallH)
          newField.bestPossibleMove = newWallH
          possiblePositions.push(newField)
        }
      }
    }

    return possiblePositions
  }

  /** Check if one of players is on win row.
   * First player starts from bottom, second from top.
   * top-left cell in field with cord: [0; 0]
   * bottom-right cell in field with cords: [8; 8]
  */
  private checkWin(field: IField, color: number): boolean {
    return  color === 1 ? field.player1Position.y === 0 : field.player2Position.y === 8
  }

  /**
  * Obviously player1MinLength and player2MinLength will be much less
  * than 99, so this optimization return a value to the best possible
  * for current turn
  * */
  // НУЖНО ИЗМЕНИТЬ АСТАР ЧТОБЫ ОН РАБОТАЛ С ТЕКУЩИМ ПРЕОБРАЗОВАННЫМ ДВУМЕРНЫМ МАССИВОМ ИЗ ОБЪЕКТА ПОЛЯ
  private sev(field: IField, color: number): number {
    let player1MinLength: number = 99
    let player2MinLength: number = 99
    for (const winLinePosition of player1WinRow) {
      const length = astar.search(
        // @ts-ignore
        field.convertGraphToDoubleArray(),
        field.player1Position,
        winLinePosition,
        {closest: true, diagonals: false}
      ).length
      if (length < player1MinLength){
        player1MinLength = length;
      }
    }
    for (const winLinePosition of player2WinRow) {
      const length = astar.search(
        // @ts-ignore
        field.convertGraphToDoubleArray(),
        field.player1Position,
        winLinePosition,
        {closest: true, diagonals: false}
      ).length
      if (length < player2MinLength){
        player2MinLength = length;
      }
    }
    if (color === 1) {
      return (field.player1WallAmount + (8 - player1MinLength)) - (field.player2WallAmount + (8 - player2MinLength))
    }
    return (field.player2WallAmount + (8 - player2MinLength)) - (field.player1WallAmount) + (8 - player1MinLength)
  }
}
