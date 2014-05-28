## Develop

We use Compass to organize and work with stylesheets.

To compile the project's sass files into css:

```
compass compile
```

To watch the project for changes and compile whenever it does:

```
compass watch
```

This would be solved once we migrate to `2.0`, already in `jekyll2` branch, [pending gh-pages support](https://github.com/github/pages-gem/pull/63).


### Working with Jekyll

To start the server type the next command in your shell:

```
jekyll serve -w
```

And access normally in your browser to the next address:

http://0.0.0.0:4000

In order to download the dist files needed, type in the terminal:

```
./update_odyssey_dist_files.sh
```

## Deploy

Deploy to `gh-pages` and the website will be available in http://cartodb.github.io/odyssey.js
