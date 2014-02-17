
ODYSSEY_FILES= \
	lib/odyssey/start.js \
	lib/odyssey/story.js \
	lib/odyssey/actions/*.js \
	lib/odyssey/actions/leaflet/*.js \
	lib/odyssey/triggers/*.js \
	lib/odyssey/end.js 

dist/odyssey.js: $(ODYSSEY_FILES)
	cat $(ODYSSEY_FILES) > $@
