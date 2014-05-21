
function Gist(md, template) {

  var gistData = null;

  d3.xhr( template + ".html").get(function(err, xhr) {
    var html = xhr.responseText;
    html = html.replace('</body>', '<scri' + 'pt src="slides.js"></scri' + 'pt></body>');
    createGist(html);
  });

  function createGist(html)  {
    d3.xhr('https://api.github.com/gists')
      .header("Content-Type", "application/json")
      .post(JSON.stringify({
        "description": "Odyssey.js template",
        "public": true,
        "files": {
          "slides.js": {
            "content": "window.ODYSSEY_MD ='" + md + "';"
          },
          "index.html": {
            "content": html
          }
        }
      }), function(err, xhr) {
        gist = JSON.parse(xhr.responseText);
        console.log(gist.url);
      });
  }

}

window.Gist = Gist;
module.exports = Gist;
