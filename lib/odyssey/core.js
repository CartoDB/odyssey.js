
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
  if (el instanceof NodeList || el instanceof HTMLCollection) {
    return el[0];
  } else if (el instanceof Element) {
    return el;
  }
  return document.getElementById(el);
}

module.exports = {
  getElement: getElement
};
