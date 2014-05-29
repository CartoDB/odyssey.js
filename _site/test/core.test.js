

module('core')


test('getElement', function() {
  var div = document.createElement('div');
  var innerdiv = document.createElement('div');
  var a = document.createElement('a');
  a.setAttribute('class', 'next');
  div.appendChild(a);
  div.appendChild(innerdiv);

  equal(O.Core.getElement(div.getElementsByClassName('next')), a);

});
