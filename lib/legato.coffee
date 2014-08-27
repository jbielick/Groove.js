do (root = this) ->


  class Legato
    constructor: (options = {sampleRate: 48000}) ->
      { @sampleRate } = options
      @context = @getAudioContext()

    getAudioContext: ->
      new root.webkitAudioContext?() || new root.AudioContext?()

    createNode: (src) ->
      if src
        node = new Node @context, src
        node.load src
      else  
        new Node @context

    connectNode: (node) ->

    @defer: ->
      return new Deferred

  class Deferred
    constructor: ->
      @thens = []
      @catches = []
      @finallys = []
      @promise = new Promise @
    resolve: ->
      @resolved = Array.prototype.slice.call arguments
      thenCb.apply(@, arguments) for thenCb in @thens
      finallyCb.apply(@, arguments) for finallyCb in @finallys
    reject: ->
      @rejected = Array.prototype.slice.call arguments
      catchCb.apply(@, arguments) for catchCb in @catches
      finallyCb.apply(@, arguments) for finallyCb in @finallys

  class Promise
    constructor: (@deferred) ->
    then: (cb) =>
      @deferred.thens.push cb
      if @deferred.resolved
        cb.apply(@deferred, @deferred.resolved)
    catch: (cb) =>
      @deferredcatches.push cb
      if @deferred.rejected
        cb.apply(@deferred, @deferred.rejected)
    finally: (cb) =>
      @deferred.finallys.push cb
      if @deferred.resolved or @deferred.rejected
        cb.apply(@deferred, @deferred.resolved or @deferred.rejected)

  class Node
    constructor: (@context, @src) ->
    load: (src) ->
      deferred = new Deferred
      @ready = false
      xhr = new root.XMLHttpRequest()
      xhr.open 'GET', src, true
      xhr.responseType = 'arraybuffer'
      xhr.onload = (e) =>
        @context.decodeAudioData xhr.response, (buffer) =>
          @buffer = buffer
          @ready = true
          deferred.resolve @
      xhr.send()
      console.log deferred.promise
      deferred.promise

    play: (delay = 0) ->
      unless @ready
        throw new Error "You cannot play the node until the buffer has loaded."
      sound = @context.createBufferSource()
      sound.buffer = @buffer

      @renderEffects sound

      # sound.connect(@context.destination)
      sound.start(0)
    
    renderEffects: (sound) ->
      lowpass = @context.createBiquadFilter()
      panner = @context.createPanner()
      gainNode = @context.createGain()
      gainNode.gain.units = 8
      # compressor = @context.createDynamicsCompressor()
      sound.connect(lowpass)
      lowpass.connect(panner)
      panner.connect(gainNode)
      # gainNode.connect(compressor)
      lowpass.connect(@context.destination)

    # oneShotSound.start(context.currentTime + 0.75)


  if module? and typeof module is 'object'
    module.exports = Legato
  else if define? and typeof define is 'function'
    define 'Legato', [], Legato
  root.Legato = Legato
