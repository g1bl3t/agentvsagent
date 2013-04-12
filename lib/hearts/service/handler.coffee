Suit = require '../engine/suit'
Rank = require '../engine/rank'
Card = require '../engine/card'
actions = require '../engine/actions'
logger = require '../../logger'
types = require './types/hearts_types'

suitMapping = [
  [Suit.CLUBS, types.Suit.CLUBS]
  [Suit.DIAMONDS, types.Suit.DIAMONDS]
  [Suit.SPADES, types.Suit.SPADES]
  [Suit.HEARTS, types.Suit.HEARTS]
]

rankMapping = [
  [Rank.TWO, types.Rank.TWO]
  [Rank.THREE, types.Rank.THREE]
  [Rank.FOUR, types.Rank.FOUR]
  [Rank.FIVE, types.Rank.FIVE]
  [Rank.SIX, types.Rank.SIX]
  [Rank.SEVEN, types.Rank.SEVEN]
  [Rank.EIGHT, types.Rank.EIGHT]
  [Rank.NINE, types.Rank.NINE]
  [Rank.TEN, types.Rank.TEN]
  [Rank.JACK, types.Rank.JACK]
  [Rank.QUEEN, types.Rank.QUEEN]
  [Rank.KING, types.Rank.KING]
  [Rank.ACE, types.Rank.ACE]
]

mapSuitToThrift = (suit) ->
  for mapping in suitMapping
    return mapping[1] if suit == mapping[0]

mapThriftToSuit = (thriftSuit) ->
  for mapping in suitMapping
    return mapping[0] if thriftSuit == mapping[1]

mapRankToThrift = (rank) ->
  for mapping in rankMapping
    return mapping[1] if rank == mapping[0]

mapThriftToRank = (thriftRank) ->
  for mapping in rankMapping
    return mapping[0] if thriftRank == mapping[1]

mapCardToThrift = (card) ->
  new types.Card(suit: mapSuitToThrift(card.suit), rank: mapRankToThrift(card.rank))

mapThriftToCard = (thriftCard) ->
  new Card(mapThriftToSuit(thriftCard.suit), mapThriftToRank(thriftCard.rank))

mapPositionToThrift = (position) ->
  switch position
    when "north" then types.Position.NORTH
    when "east" then types.Position.EAST
    when "south" then types.Position.SOUTH
    when "west" then types.Position.WEST

mapTrickToThrift = (trick) ->
  cards = trick.played.cards.map mapCardToThrift
  new types.Trick leader: mapPositionToThrift(trick.leader), played: cards

mapErrorToThrift = (err) ->
  switch err[0]
    when "outOfSequence" then new types.OutOfSequenceException(message: err[1])
    when "invalidMove" then new types.InvalidMoveException(message: err[1])

module.exports = class Handler
  constructor: (@arena) ->

  _game: (ticket) ->
    @arena.getGame(ticket.gameId)

  _player: (ticket) ->
    game = @_game(ticket)
    game.getPlayer(ticket.agentId)

  enter_arena: (request, result) ->
    player = @arena.createPlayer()
    player.recvStartedGame (err, gameId) ->
      ticket = new types.Ticket(agentId: player.id, gameId: gameId)
      response = new types.EntryResponse(ticket: ticket)

      #player disconnected before response returned
      #if this were updated in npm, would be fine
      # so either need to wrap in a try, or somehow get that newest version
      result null, response

  get_game_info: (ticket, result) ->
    logger.info "Get game info", ticket
    game = @arena.getGame(ticket.gameId)
    player = game.getPlayer(ticket.agentId)

    thriftPosition = mapPositionToThrift(game.positionOf(player))
    gameInfo = new types.GameInfo(position: thriftPosition)
    logger.info "Returning game info", ticket

    result null, gameInfo

  get_hand: (ticket, result) ->
    logger.info "Get hand", ticket

    @_player(ticket).recvDealt (err, cards) ->
      return result mapErrorToThrift(err), null if err
      thriftCards = cards.map mapCardToThrift
      result null, thriftCards

  pass_cards: (ticket, cards, result) ->
    logger.info "Pass cards", ticket, cards
    player = @_player(ticket)
    mappedCards = cards.map mapThriftToCard
    action = new actions.PassCards(player, mappedCards)
    @_game(ticket).handleAction action, (err) ->
      player.recvPassed (err, cards) ->
        return result mapErrorToThrift(err), null if err
        thriftCards = cards.map mapCardToThrift
        result null, thriftCards

  get_trick: (ticket, result) ->
    logger.info "Get trick", ticket

    @_player(ticket).recvTurn (err, trick) ->
      return result mapErrorToThrift(err), null if err
      logger.info "Returning recvTurn", trick
      result null, mapTrickToThrift(trick)

  play_card: (ticket, card, result) ->
    logger.info "play_card", ticket

    player = @_player(ticket)
    action = new actions.PlayCard(player, mapThriftToCard(card))
    @_game(ticket).handleAction action, (err) ->
      player.recvEndTrick (err, trick) ->
        return result mapErrorToThrift(err), null if err
        result null, mapTrickToThrift(trick)

  get_round_result: (ticket, result) ->
    logger.info "get_round_result", ticket

    @_player(ticket).recvEndRound (err, scores, status) ->
      return result mapErrorToThrift(err), null if err
      roundResult = new types.RoundResult(scores)
      roundResult.status = switch status
        when "endGame" then types.GameStatus.END_GAME
        when "nextRound" then types.GameStatus.NEXT_ROUND
      result null, roundResult

  get_game_result: (ticket, result) ->
    @_player(ticket).recvEndGame (err, scores) ->
      return result mapErrorToThrift(err), null if err
      gameResult = new types.GameResult(scores)
      result null, gameResult
