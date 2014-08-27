legato.js
========
A lightweight wrapper on the WebAudio API to create node graphs and signal processing mixes. 

#Usage
```js
  var l = new Legato();

  l.createNode('hi-hat.wav').then(function(node) {
    node.play();
  });

  l.createNode('hi-hat.wav').then(function(node) {
    node.addEffect('reverb', {room: 10});
    node.play();
  });
```