var expect = require('chai').expect;
var sinon = require('sinon');
console.log(sinon)
var Legato = require('../src/legato.js');

this.XMLHttpRequest = sinon.sandbox.useFakeXMLHttpRequest();

describe('Legato', function() {
  it('should instantiate', function() {
    expect(function() {
      new Legato('test');
    }).to.not.throw(TypeError)
  });

  describe('Legato.Node', function() {
    it('should instantiate', function() {
      var graph = new Legato(), node;
      expect(function() {
        node = graph.createNode('test.wav');
      }).to.not.throw(TypeError);

      expect(graph.createNode('test.wav').src).to.match(/test/);
    });

    it('should load an external sound file when instantiated with a src url', function() {
      var graph = new Legato(), node = graph.createNode('test.wav');

    });
  });

});