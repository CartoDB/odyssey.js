#!/bin/sh
rm -rf editor/*

mkdir -p editor
wget -O editor/editor.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/editor.html
wget -O editor/scroll.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/scroll.html
wget -O editor/slides.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/slides.html
wget -O editor/torque.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/torque.html
wget -O editor/favicon.ico https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/favicon.ico
wget -O editor/favicon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/favicon.png

mkdir -p editor/img
wget -O editor/img/collapseButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/collapseButtonIcon.png
wget -O editor/img/expandButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/expandButtonIcon.png
wget -O editor/img/expandButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/expandButtonIcon.png
wget -O editor/img/downloadButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/downloadButtonIcon.png
wget -O editor/img/shareButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/shareButtonIcon.png
wget -O editor/img/crosshair.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/crosshair.png
wget -O editor/img/greyBarBkg.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/greyBarBkg.png
wget -O editor/img/helpButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/helpButtonIcon.png
wget -O editor/img/navBtns.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/navBtns.png
wget -O editor/img/expandToogleButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/expandToogleButtonIcon.png
wget -O editor/img/EditButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/img/EditButtonIcon.png


mkdir -p editor/fonts
wget -O editor/fonts/static-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/static-webfont.ttf
wget -O editor/fonts/static-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/static-webfont.svg
wget -O editor/fonts/static-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/static-webfont.woff
wget -O editor/fonts/static-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/static-webfont.eot
wget -O editor/fonts/aleo-regular-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-regular-webfont.ttf
wget -O editor/fonts/aleo-regular-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-regular-webfont.svg
wget -O editor/fonts/aleo-regular-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-regular-webfont.woff
wget -O editor/fonts/aleo-regular-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-regular-webfont.eot
wget -O editor/fonts/aleo-bold-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-bold-webfont.ttf
wget -O editor/fonts/aleo-bold-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-bold-webfont.svg
wget -O editor/fonts/aleo-bold-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-bold-webfont.woff
wget -O editor/fonts/aleo-bold-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/aleo-bold-webfont.eot
wget -O editor/fonts/ProximaNova-bold.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/ProximaNova-Bold.ttf
wget -O editor/fonts/ProximaNova-bold.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/ProximaNova-Bold.svg
wget -O editor/fonts/ProximaNova-bold.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/ProximaNova-Bold.woff
wget -O editor/fonts/ProximaNova-bold.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/fonts/ProximaNova-Bold.eot

mkdir -p editor/css
wget -O editor/css/screen.css https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/css/screen.css
wget -O editor/css/scroll.css  https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/css/scroll.css
wget -O editor/css/slides.css  https://raw.githubusercontent.com/CartoDB/odyssey.js/master/editor/css/slides.css

mkdir -p vendor
wget -O vendor/d3.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/d3.js
wget -O vendor/codemirror-markdown.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror-markdown.js
wget -O vendor/jszip.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jszip.js
wget -O vendor/jszip-utils.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jszip-utils.js
wget -O vendor/ZeroClipboard.min.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/ZeroClipboard.min.js
wget -O vendor/ZeroClipboard.swf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/ZeroClipboard.swf

mkdir -p vendor/codemirror
wget -O vendor/codemirror/codemirror.css https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror/codemirror.css
wget -O vendor/codemirror/codemirror.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror/codemirror.js

mkdir -p dist
wget -O dist/odyssey.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/dist/odyssey.js
wget -O dist/editor.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/dist/editor.js
