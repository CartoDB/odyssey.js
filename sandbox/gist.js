function relocateAssets(doc) {
  var s = location.pathname.split('/');
  var relocate_url = "http://cartodb.github.io" + s.slice(0, s.length - 1).join('/') + "/";

  var js = doc.getElementsByTagName('script');
  for (var i = 0; i < js.length; ++i) {
    var src = js[i].getAttribute('src');
    if (src && src.indexOf('http') !== 0) {
      js[i].setAttribute("src", (relocate_url + src).replace(/sandbox\/..\//g, ''));
    }
  }

  var css = doc.getElementsByTagName('link');
  for (var i = 0; i < css.length; ++i) {
    var href = css[i].getAttribute('href');
    if (href && href.indexOf('http') !== 0) {
      css[i].setAttribute("href", relocate_url + href);
    }
  }
}

function processHTML(html, md, transform) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');

  // transform
  transform && transform(doc);

  var md_template = doc.createElement("script");

  md_template.setAttribute("id", "md_template");
  md_template.setAttribute("type", "text/template");

  md_template.innerHTML = md;
  doc.body.appendChild(md_template);

  return '<!doctype><html>'+doc.documentElement.innerHTML+'</html>';
}

function files(md, template, callback) {
  function request(r, callback) {
    d3.xhr(r).get(callback);
  }
  queue(2)
    .defer(request, template + '.html')
    .awaitAll(ready);

  function ready(error, results) {
    results = results.map(function(r) {
      return r.responseText;
    });

    callback({
      'odyssey.html': processHTML(results[0], md, relocateAssets)
    });
  }
}

function zip(md, template, callback) {
  files(md, template, function(contents) {
    var zip = new JSZip();
    for (var f in contents) {
      zip.file(f, contents[f]);
    }
    callback(zip);
  });
}

function Gist(md, template, callback) {
  var gistData = null;

  d3.xhr(template + ".html").get(function(err, xhr) {
    var html = xhr.responseText;
    var payload = {
        "description": "Odyssey.js template",
        "public": true,
        "files": {
          'index.html': {
            content: processHTML(html, md, relocateAssets)
          }
        }
    };

    d3.xhr('https://api.github.com/gists')
      .header("Content-Type", "application/json")
      .post(JSON.stringify(payload), function(err, xhr) {
        gist = JSON.parse(xhr.responseText);
        var BLOCKS = 'http://bl.ocks.org/anonymous/raw/';
        // console.log(gist);
        callback({
          url: gist.url,
          html_url: BLOCKS + gist.id,
        });
      });
  });

}

module.exports = {
  gist: Gist,
  zip: zip
}
