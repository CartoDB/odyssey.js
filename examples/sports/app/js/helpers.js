function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);

  return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function sanitizeCountry(s) {
  var r=s.toLowerCase();
  r = r.replace(new RegExp("\\s", 'g'),"-");
  r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
  r = r.replace(new RegExp("æ", 'g'),"ae");
  r = r.replace(new RegExp("ç", 'g'),"c");
  r = r.replace(new RegExp("[èéêë]", 'g'),"e");
  r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
  r = r.replace(new RegExp("ñ", 'g'),"n");
  r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
  r = r.replace(new RegExp("œ", 'g'),"oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
  r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
  r = r.replace(new RegExp("\\W", 'g'),"-");
  r = r.replace(new RegExp("'", 'g'),"-");

  return r;
}
