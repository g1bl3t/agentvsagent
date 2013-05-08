Seat = require './seat'
Suit = require './suit'
Rank = require './rank'
Trick = require './trick'

module.exports = class Round
  constructor: ->
    @north = new Seat()
    @east = new Seat()
    @south = new Seat()
    @west = new Seat()

    @tricks = []

  currentTrick: ->
    @tricks[@tricks.length - 1]

  newTrick: ->
    if @tricks.length == 0
      # TODO: refactor out positions array
      positions = ["north", "east", "south", "west"]

      startingPosition = do (positions) =>
        for position in positions
          return position if @[position].held.findCard(Suit.CLUBS, Rank.TWO)

      @tricks.push(new Trick(startingPosition))
    else
      winner = @currentTrick().winner()
      @tricks.push(new Trick(winner))

  allHavePassed: ->
    @north.hasPassed() && @east.hasPassed() && @south.hasPassed() && @west.hasPassed()

  scores: ->
    zeroscores =
      north: 0
      east: 0
      south: 0
      west: 0

    scores = @tricks.reduce (memo, trick) ->
      memo[trick.winner()] += trick.score()
      memo
    , zeroscores

    for position in ['north', 'east', 'south', 'west']
      if scores[position] == 26
        scores.north = 26
        scores.east = 26
        scores.south = 26
        scores.west = 26
        scores[position] = 0
        break
    scores

  isHeartsBroken: ->
    @tricks.some (trick) ->
      trick.played.allOfSuit(Suit.HEARTS).cards.length > 0
