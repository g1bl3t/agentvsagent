machina = require('machina')()
Q = require 'q'

IdGenerator = require '../idGenerator'
logger = require '../logger'

PlayerState = machina.Fsm.extend
  initialState: "waitingForClient"
  states:
    waitingForServer:
      send: (args...) ->
        @request.resolve(args...)

      forward: (args..., request) ->
        request.reject(new Error("unexpectedMessage"))

    waitingForClient:
      forward: (args..., @request)->
        @transition "waitingForServer"

module.exports = class Player
  constructor: ->
    @id = IdGenerator.generate()
    @state = new PlayerState()
    # @state.on "transition", (details) ->
    #   console.log "changed state #{details}"
    #   logger.verbose "changed state #{details}"

  forward: (args...) ->
    request = Q.defer()
    @state.handle "forward", args..., request
    request.promise

  # notify?
  send: (args...) ->
    @state.handle "send", args...

