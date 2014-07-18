#!/bin/sh
rm -rf sandbox/*

mkdir -p sandbox
mkdir -p editor
wget -O sandbox/notsupportedbrowser.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/notsupportedbrowser.html
wget -O sandbox/sandbox.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/sandbox.html
wget -O sandbox/scroll.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/scroll.html
wget -O sandbox/slides.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides.html
wget -O sandbox/torque.html https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/torque.html
wget -O sandbox/favicon.ico https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/favicon.ico
wget -O sandbox/favicon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/favicon.png
wget -O sandbox/scroll0.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/scroll0.png
wget -O sandbox/scroll1.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/scroll1.png
wget -O sandbox/slides0.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides0.png
wget -O sandbox/slides1.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides1.png
wget -O sandbox/slides2.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides2.png
wget -O sandbox/slides3.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides3.png
wget -O sandbox/torque0.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/torque0.png
wget -O sandbox/torque1.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/torque1.png
wget -O sandbox/scroll.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/scroll.png
wget -O sandbox/slides.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/slides.png
wget -O sandbox/torque.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/torque.png
cp sandbox/favicon.ico favicon.ico
cp sandbox/favicon.png favicon.png

mkdir -p sandbox/img
wget -O sandbox/img/collapseButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/collapseButtonIcon.png
wget -O sandbox/img/expandButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/expandButtonIcon.png
wget -O sandbox/img/expandButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/expandButtonIcon.png
wget -O sandbox/img/downloadButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/downloadButtonIcon.png
wget -O sandbox/img/shareButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/shareButtonIcon.png
wget -O sandbox/img/crosshair.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/crosshair.png
wget -O sandbox/img/greyBarBkg.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/greyBarBkg.png
wget -O sandbox/img/helpButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/helpButtonIcon.png
wget -O sandbox/img/navBtns.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/navBtns.png
wget -O sandbox/img/expandToogleButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/expandToogleButtonIcon.png
wget -O sandbox/img/EditButtonIcon.png https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/img/EditButtonIcon.png


mkdir -p sandbox/fonts
wget -O sandbox/fonts/static-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/static-webfont.ttf
wget -O sandbox/fonts/static-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/static-webfont.svg
wget -O sandbox/fonts/static-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/static-webfont.woff
wget -O sandbox/fonts/static-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/static-webfont.eot
wget -O sandbox/fonts/aleo-regular-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-regular-webfont.ttf
wget -O sandbox/fonts/aleo-regular-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-regular-webfont.svg
wget -O sandbox/fonts/aleo-regular-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-regular-webfont.woff
wget -O sandbox/fonts/aleo-regular-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-regular-webfont.eot
wget -O sandbox/fonts/aleo-bold-webfont.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-bold-webfont.ttf
wget -O sandbox/fonts/aleo-bold-webfont.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-bold-webfont.svg
wget -O sandbox/fonts/aleo-bold-webfont.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-bold-webfont.woff
wget -O sandbox/fonts/aleo-bold-webfont.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/aleo-bold-webfont.eot
wget -O sandbox/fonts/ProximaNova-bold.ttf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/ProximaNova-Bold.ttf
wget -O sandbox/fonts/ProximaNova-bold.svg https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/ProximaNova-Bold.svg
wget -O sandbox/fonts/ProximaNova-bold.woff https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/ProximaNova-Bold.woff
wget -O sandbox/fonts/ProximaNova-bold.eot https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/fonts/ProximaNova-Bold.eot

mkdir -p sandbox/css
wget -O sandbox/css/screen.css https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/css/screen.css
wget -O sandbox/css/scroll.css  https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/css/scroll.css
wget -O sandbox/css/slides.css  https://raw.githubusercontent.com/CartoDB/odyssey.js/master/sandbox/css/slides.css

mkdir -p vendor
wget -O vendor/d3.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/d3.js
wget -O vendor/codemirror-markdown.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror-markdown.js
wget -O vendor/jszip.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jszip.js
wget -O vendor/jszip-utils.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jszip-utils.js
wget -O vendor/ZeroClipboard.min.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/ZeroClipboard.min.js
wget -O vendor/ZeroClipboard.swf https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/ZeroClipboard.swf
wget -O vendor/jquery-1.10.2.min.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jquery-1.10.2.min.js
wget -O vendor/jquery.imageload.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jquery.imageload.js
wget -O vendor/jquery.spriteanim.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/jquery.spriteanim.js

mkdir -p vendor/codemirror
wget -O vendor/codemirror/codemirror.css https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror/codemirror.css
wget -O vendor/codemirror/codemirror.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/vendor/codemirror/codemirror.js

mkdir -p dist
wget -O dist/odyssey.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/dist/odyssey.js
wget -O dist/sandbox.js https://raw.githubusercontent.com/CartoDB/odyssey.js/master/dist/sandbox.js

cp sandbox/* editor/*
