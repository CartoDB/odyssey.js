
VENDOR_FILES = vendor/d3.custom.js

ODYSSEY_FILES= \
	index.js \
	lib/odyssey/story.js \
	lib/odyssey/actions/*.js \
	lib/odyssey/actions/leaflet/*.js \
	lib/odyssey/triggers/*.js \

dist/odyssey.js: $(ODYSSEY_FILES) $(VENDOR_FILES)
	browserify -s Odyssey index.js > $@

vendor/d3.custom.js:
	node_modules/smash/smash node_modules/d3/src/start.js node_modules/d3/src/event/dispatch.js node_modules/d3/src/core/rebind.js node_modules/d3/src/end.js > $@

clean: 
	rm -rf dist/*
