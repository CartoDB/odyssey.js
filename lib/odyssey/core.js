
function getElement(el) {
  if(typeof jQuery !== 'undefined') {
    if (el instanceof jQuery) {
      return el[0];
    } else if(typeof el === 'string') {
      if (el[0] === '#' || el[0] === '.') {
        return getElement($(el));
      }
    }
  } 
  if (el instanceof NodeList) {
    return el[0];
  } else if (el instanceof Element) {
    return el;
  }
  return document.getElementById(el);
}

function getElements(el) {
  if(typeof jQuery !== 'undefined') {
    if (el instanceof jQuery) {
      return el[0];
    } else if(typeof el === 'string') {
      if (el[0] === '#' || el[0] === '.') {
        return getElement($(el));
      }
    }
  } 
  if (el instanceof NodeList) {
    return el[0];
  } else if (el instanceof Element) {
    return el;
  }
  return document.getElementById(el);
}


module.exports = {
  getElement: getElement
};
