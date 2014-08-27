var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(root) {
  var Deferred, Legato, Node, Promise;
  Legato = (function() {
    function Legato(options) {
      if (options == null) {
        options = {
          sampleRate: 48000
        };
      }
      this.sampleRate = options.sampleRate;
      this.context = this.getAudioContext();
    }

    Legato.prototype.getAudioContext = function() {
      return (typeof root.webkitAudioContext === "function" ? new root.webkitAudioContext() : void 0) || (typeof root.AudioContext === "function" ? new root.AudioContext() : void 0);
    };

    Legato.prototype.createNode = function(src) {
      var node;
      if (src) {
        node = new Node(this.context, src);
        return node.load(src);
      } else {
        return new Node(this.context);
      }
    };

    Legato.prototype.connectNode = function(node) {};

    Legato.defer = function() {
      return new Deferred;
    };

    return Legato;

  })();
  Deferred = (function() {
    function Deferred() {
      this.thens = [];
      this.catches = [];
      this.finallys = [];
      this.promise = new Promise(this);
    }

    Deferred.prototype.resolve = function() {
      var finallyCb, thenCb, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.resolved = Array.prototype.slice.call(arguments);
      _ref = this.thens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thenCb = _ref[_i];
        thenCb.apply(this, arguments);
      }
      _ref1 = this.finallys;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        finallyCb = _ref1[_j];
        _results.push(finallyCb.apply(this, arguments));
      }
      return _results;
    };

    Deferred.prototype.reject = function() {
      var catchCb, finallyCb, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.rejected = Array.prototype.slice.call(arguments);
      _ref = this.catches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        catchCb = _ref[_i];
        catchCb.apply(this, arguments);
      }
      _ref1 = this.finallys;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        finallyCb = _ref1[_j];
        _results.push(finallyCb.apply(this, arguments));
      }
      return _results;
    };

    return Deferred;

  })();
  Promise = (function() {
    function Promise(deferred) {
      this.deferred = deferred;
      this["finally"] = __bind(this["finally"], this);
      this["catch"] = __bind(this["catch"], this);
      this.then = __bind(this.then, this);
    }

    Promise.prototype.then = function(cb) {
      this.deferred.thens.push(cb);
      if (this.deferred.resolved) {
        return cb.apply(this.deferred, this.deferred.resolved);
      }
    };

    Promise.prototype["catch"] = function(cb) {
      this.deferredcatches.push(cb);
      if (this.deferred.rejected) {
        return cb.apply(this.deferred, this.deferred.rejected);
      }
    };

    Promise.prototype["finally"] = function(cb) {
      this.deferred.finallys.push(cb);
      if (this.deferred.resolved || this.deferred.rejected) {
        return cb.apply(this.deferred, this.deferred.resolved || this.deferred.rejected);
      }
    };

    return Promise;

  })();
  Node = (function() {
    function Node(context, src) {
      this.context = context;
      this.src = src;
    }

    Node.prototype.load = function(src) {
      var deferred, xhr;
      deferred = new Deferred;
      this.ready = false;
      xhr = new root.XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = (function(_this) {
        return function(e) {
          return _this.context.decodeAudioData(xhr.response, function(buffer) {
            _this.buffer = buffer;
            _this.ready = true;
            return deferred.resolve(_this);
          });
        };
      })(this);
      xhr.send();
      console.log(deferred.promise);
      return deferred.promise;
    };

    Node.prototype.play = function(delay) {
      var sound;
      if (delay == null) {
        delay = 0;
      }
      if (!this.ready) {
        throw new Error("You cannot play the node until the buffer has loaded.");
      }
      sound = this.context.createBufferSource();
      sound.buffer = this.buffer;
      this.renderEffects(sound);
      return sound.start(0);
    };

    Node.prototype.renderEffects = function(sound) {
      var gainNode, lowpass, panner;
      lowpass = this.context.createBiquadFilter();
      panner = this.context.createPanner();
      gainNode = this.context.createGain();
      gainNode.gain.units = 8;
      sound.connect(lowpass);
      lowpass.connect(panner);
      panner.connect(gainNode);
      return lowpass.connect(this.context.destination);
    };

    return Node;

  })();
  if ((typeof module !== "undefined" && module !== null) && typeof module === 'object') {
    module.exports = Legato;
  } else if ((typeof define !== "undefined" && define !== null) && typeof define === 'function') {
    define('Legato', [], Legato);
  }
  return root.Legato = Legato;
})(this);
