
VENDOR_FILES= vendor/d3.custom.js vendor/d3.js

ODYSSEY_FILES= \
	index.js \
	lib/odyssey/core.js \
	lib/odyssey/story.js \
	lib/odyssey/template.js \
	lib/odyssey/actions/*.js \
	lib/odyssey/actions/leaflet/*.js \
	lib/odyssey/triggers/*.js \
	lib/odyssey/util/*.js

ODYSSEY_SANDBOX_FILES= sandbox/*.js

all: dist/odyssey.js  dist/sandbox.js

dist/odyssey.js: $(ODYSSEY_FILES) $(VENDOR_FILES)
	node node_modules/browserify/bin/cmd.js -s O index.js > $@
	#browserify -s O index.js > $@

dist/sandbox.js: $(ODYSSEY_SANDBOX_FILES) $(VENDOR_FILES)
	node node_modules/browserify/bin/cmd.js -s editor sandbox/sandbox.js > $@

vendor/d3.custom.js:
	node_modules/smash/smash node_modules/d3/src/start.js node_modules/d3/src/event/dispatch.js node_modules/d3/src/core/rebind.js node_modules/d3/src/end.js > $@

clean:
	rm -rf dist/*
