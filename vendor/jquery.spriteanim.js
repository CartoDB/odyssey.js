/**
 * JQUERY SPRITE ANIM 0.1.7
 * ========================
 * A jQuery sprite animation library with:
 * - Full support for iPad/iPhone.
 * - Unlimited frames.
 * - Fast loading.
 * - Online generator.
 *
 * Author:   Morten Skyt @ Stupid Studio ApS <morten@stupid-studio.com>
 *
 * Sprite generator tool website:
 *           http://sprite.smplr.com
 *
 * Hosting for generator tool sponsored by:
 *           http://smplr.com
 *
 * Website and source code:
 *           http://github.com/StupidStudio/jQuery-Sprite-Anim
 *
 * License:  The MIT License (see LICENSE)
 */
jQuery(function($) {

	/**
	 * Convert a string version of true/false/0/1 to a boolean. Returns
	 * the second argument if first argument is undefined.
	 * Returns true if no default value (second arg) is given and the
	 * value is undefined as well.
	 */
	var stringToBoolean = function(val, defValue) {
		if (typeof defValue === "undefined") defValue = true;
		if (typeof val === "undefined") return defValue;
		if (val.toLowerCase() === "true" || val >= 1) return true;

		return false;
	};
	/**
	 * Convert a string with two digits, separated by x, into an array with two
	 * values. Ie. "123x456" becomes [123,456]
	 */
	var stringToCoords = function(raw) {
		if (typeof(raw) !== "string") $.error("String expected.");
		var split = raw.split('x');
		if (split.length !== 2) $.error("Should be two elements only.");

		var list = [];
		$.each(split, function() {
			var digit = Number($.trim(this));
			if (isNaN(digit)) $.error(this + " is not a digit.");
			list.push(digit);
		});

		return list;
	};

	/**
	 * The SpriteAnim class. Instantiated once per element.
	 */
	var SpriteAnim = function(elem) {
		this.elem = elem;
		this.initialize();
	};

	/**
	 * Constructor.
	 */
	SpriteAnim.prototype.initialize = function() {
		var settings = {
			autoplay: stringToBoolean($(this.elem).attr('data-autoplay'), true),
			autoload: stringToBoolean($(this.elem).attr('data-autoload'), true),
			retina: stringToBoolean($(this.elem).attr('data-retina'), false),
			baseurl: $(this.elem).attr('data-baseurl'),
			gridsize: stringToCoords($(this.elem).attr('data-grid')),
			blocksize: stringToCoords($(this.elem).attr('data-blocksize')),
			frames: Number($(this.elem).attr('data-frames')),
			fps: Number($(this.elem).attr('data-fps')),
			forwards: stringToBoolean($(this.elem).attr('data-forwards'), true),

			curFrame: -1
		};

		// defaults
		if (isNaN(settings.fps) || settings.fps <= 0) settings.fps = 12; // 12 fps default

		// missing attributes?
		if (!settings.baseurl) $.error("No baseurl defined.");
		if (!settings.gridsize) $.error("No grid size defined.");
		if (!settings.blocksize) $.error("No block size defined.");
		if (!settings.frames) $.error("No frame number defined.");
		if (isNaN(settings.frames) || settings.frames < 1) $.error("Frame number must be a positive digit.");

		// save the settings straight on this instance
		$.extend(this, settings);

		// create the dom elements and do the styling required
		this.prepareElements();

		// autoload? then load the graphics
		if (settings.autoload) {
			this.loadSheet();
			this.curFrame = this.getNextFrame();
			this.showCurrentFrame();
		}

		// autoplay? then play when the first frame is loaded
		if (settings.autoplay) $(this.elem).one('sheet-0-loaded', this.play.bind(this));
	};


	/**
	 * Get the amount of sheets.
	 */
	SpriteAnim.prototype.getNoSheets = function() {
		var perSheet = this.gridsize[0] * this.gridsize[1];
		return Math.ceil(this.frames / perSheet);
	};


	/**
	 * Get the current sheet index.
	 */
	SpriteAnim.prototype.getCurSheetIdx = function() {
		var perSheet = this.gridsize[0] * this.gridsize[1];
		return Math.floor( this.curFrame / perSheet );
	};


	/**
	 * Return the index of the next sheet (so we can prepare the background-image
	 * etc.)
	 */
	SpriteAnim.prototype.getNextSheetIdx = function() {
		var curIdx = this.getCurSheetIdx();
		var nextIdx;
		if (this.forwards) {
			var nextIdx = curIdx + 1;
			if (nextIdx >= this.getNoSheets()) nextIdx = 0;
		} else {
			var nextIdx = curIdx - 1;
			if (nextIdx < 0) nextIdx = this.getNoSheets() -1;
		}
		return nextIdx;
	};


	/**
	 * Create the animation elements and style them accordingly.
	 */
	SpriteAnim.prototype.prepareElements = function() {
		var outer = $(this.elem);
		outer.css({'position': 'relative'});

		var createSheets = this.getNoSheets() > 1 ? 2 : 1;

		// create the two sheet divs, which will contain the sprite images
		for (var i = 0; i < createSheets; i++) {
			outer.append($('<div class="sheet" data-idx="' + i + '">'));
		}

		// sheets
		var sheets = outer.children('div.sheet');

		// style the sheets
		sheets.css({
			position: 'absolute'
		});

		// set the required style attributes on the outer element
		var multiplier = this.retina ? 0.5 : 1;

		outer.css({
			width: this.blocksize[0] * multiplier,
			height: this.blocksize[1] * multiplier,
			overflow: 'hidden'
		});

		// move the sheets appropriately
		this.repositionSheets();
	};


	/**
	 * Reposition the sheets.
	 */
	SpriteAnim.prototype.repositionSheets = function() {
		var outer = $(this.elem);
		var sheets = outer.children('div.sheet');

		var createdSheets = this.getNoSheets() > 1 ? 2 : 1;
		sheets.eq(this.getCurSheetIdx() % createdSheets).css({ left: '0%' });
		if (createdSheets === 2) {
			sheets.eq((this.getCurSheetIdx() + 1) % 2).css({ left: '100%' });
		}
	};


	/**
	 * Load the files for the animation.
	 */
	SpriteAnim.prototype.loadSheet = function(sheetIdx) {
		if (typeof sheetIdx === "undefined") sheetIdx = [0, 1];
		if (!Array.isArray(sheetIdx)) sheetIdx = [Number(sheetIdx)];

		var outer = this.elem;

		// loaded and loading sheets states
		if (typeof this.loadedSheets === "undefined") this.loadedSheets = {};
		var loadedSheets = this.loadedSheets;

		// sheet loaded fn
		var sheetLoadedFn = function(sheetIdx) {
			$(outer).trigger('sheet-loaded', [ sheetIdx ]);
			$(outer).trigger('sheet-'+sheetIdx+'-loaded', [ sheetIdx ]);
		};

		// load the sheets!
		$.each(sheetIdx, function(aI, idx) {

			// loaded or loading, no need to do this again
			if (typeof loadedSheets[idx] !== "undefined") return sheetLoadedFn(idx);

			loadedSheets[sheetIdx] = 1;
			$('<img>').attr('src', this.baseurl + idx + ".png").imageLoad(function() {
				sheetLoadedFn(idx);
				loadedSheets[idx] = 2;
			});
		}.bind(this));
	};



	/**
	 * Return the index of the next frame in the animation. Loops around, if we're
	 * at the end.
	 */
	SpriteAnim.prototype.getNextFrame = function() {
		var nextFrame;
		
		if (this.forwards) {
			nextFrame = this.curFrame + 1;
			if (nextFrame >= this.frames) nextFrame = 0;
		} else {
			nextFrame = this.curFrame - 1;
			if (nextFrame < 0) nextFrame = this.frames-1;
		}

		return nextFrame;
	};


	/**
	 * Start playing the animation.
	 */
	SpriteAnim.prototype.play = function() {
		// fire the event and cancel, if event has been cancelled
		var ev = $.Event('play');
		$(this.elem).trigger(ev);
		if (ev.isDefaultPrevented()) return;

		this.doPlay();
	};


	/**
	 * Do the playing, according to the FPS.
	 */
	SpriteAnim.prototype.doPlay = function() {
		var self = this;
		
		// already running? then cancel that
		window.clearInterval(this.timer);

		// interval in milliseconds
		var msInterval = Math.round(1000 / this.fps);
		var startTime = (new Date()).getTime();


		var canPlayNextFrame = function() {
			var now = (new Date()).getTime();
			if (startTime + msInterval > now) return false;
			
			startTime = (new Date()).getTime();
			return true;
		};
		

		var animFn = (function animloop() {
			if (self.mustStop) { self.mustStop = false; return; }
			requestAnimFrame(animFn);
			if (!canPlayNextFrame()) return;
			
			// if the element no longer exist / is no longer injected in the DOM, then
			// stop the animation
			if(!$(this.elem).parent().length) return this.stop();
			
			var nextFrame = this.getNextFrame();

			// event
			var ev = $.Event('frame-'+nextFrame+'-show');
			$(this.elem).trigger(ev);
			if (ev.isDefaultPrevented()) return this.stop();

			// is the next frame last? well, that is special
			if (nextFrame === this.frames - 1) {
				var ev = $.Event('frame-last-show');
				$(this.elem).trigger(ev);
				if (ev.isDefaultPrevented()) return this.stop();
			}


			// do the actual showing
			this.curFrame = nextFrame; // iterate frame count
			this.showCurrentFrame();


			// event
			var ev = $.Event('frame-'+nextFrame+'-shown');
			$(this.elem).trigger(ev);
			if (ev.isDefaultPrevented()) return this.stop();

			// is the next frame last? well, that is special
			if (nextFrame === this.frames - 1) {
				var ev = $.Event('frame-last-shown');
				$(this.elem).trigger(ev);
				if (ev.isDefaultPrevented()) return this.stop();
			}
		}.bind(this));
		animFn();
		
	};


	/**
	 * Make sure the next sheet has the correct background-image, so it's ready
	 * for when it takes over.
	 */
	SpriteAnim.prototype.prepareNextSheet = function() {
		if (this.getNextSheetIdx() === this.getCurSheetIdx()) return;
		
		var newProp = 'url(' + this.baseurl + this.getNextSheetIdx() + '.png)';
		var nextSheetEl = $(this.elem).children('div.sheet').eq( (this.getCurSheetIdx() + 1) % 2 );
		
		if (nextSheetEl.css('background-image') === newProp) return;
		
		nextSheetEl.css({
			'background-image': newProp
		});
	};


	/**
	 * Set the style of the current sheet appropriately. Make sure the right
	 * sheet is positioned in the viewport.
	 */
	SpriteAnim.prototype.showCurrentFrame = function() {
		this.repositionSheets();

		var frameSheetIdx = this.curFrame % (this.gridsize[0] * this.gridsize[1]);

		var col = frameSheetIdx % this.gridsize[0];
		var row = Math.floor(frameSheetIdx / this.gridsize[0]);

		var multiplier = this.retina ? 0.5 : 1;

		var bgX = Math.floor(col * this.blocksize[0] * multiplier);
		var bgY = Math.floor(row * this.blocksize[1] * multiplier);

		// what is the background-size of this sheet?
		var sheetDimensions = this.getSheetDimensions( this.getCurSheetIdx() );

		var sheetEl = $(this.elem).children('div.sheet').eq( this.getCurSheetIdx() % 2 );

		var newProp = {
			'background-image': 'url(' + this.baseurl + this.getCurSheetIdx() + '.png)',
			'background-position': bgX*-1+'px '+bgY*-1+'px',
			'background-size': sheetDimensions[0]+'px '+sheetDimensions[1]+'px',
			'width': this.blocksize[0],
			'height': this.blocksize[1]
		};

		
		if (newProp['background-size'] === sheetEl.css('background-size')) delete newProp['background-size'];
		if (sheetEl.css('background-image').search( this.baseurl + this.getCurSheetIdx() + '.png' ) !== -1) delete newProp['background-image'];
		if (newProp['width'] === sheetEl.css('width')) delete newProp['width'];
		if (newProp['height'] === sheetEl.css('height')) delete newProp['height'];

		sheetEl.css(newProp);

		this.prepareNextSheet();
	};


	/**
	 * Stop the animation.
	 */
	SpriteAnim.prototype.stop = function() {
		this.mustStop = true;
	};


	/**
	 * Get the dimensions of the sheet given by the index.
	 */
	SpriteAnim.prototype.getSheetDimensions = function(idx) {
		var perSheet = this.gridsize[0] * this.gridsize[1];
		var startIdx = idx * perSheet;
		var endIdx = startIdx + perSheet;
		if (endIdx > this.frames) endIdx = this.frames;

		var multiplier = this.retina ? 0.5 : 1;

		var items = endIdx - startIdx;

		var width = this.blocksize[0] * items, height = 0;
		if (items > this.gridsize[0]) width = this.blocksize[0] * this.gridsize[0];
		height = this.blocksize[1] * Math.ceil( items / this.gridsize[0] );

		return [width*multiplier, height*multiplier];
	};


	/**
	 * Initialize the animation for the element.
	 */
	var initializeElement = function(elem) {
		// is this already initialized?
		if ($(elem).data('spriteanim')) return $(elem).data('spriteanim');
		var spriteanim = new SpriteAnim(elem);
		$(elem).data('spriteanim', spriteanim);

		return spriteanim;
	};


	/**
	 * The element function.
	 */
	$.fn.spriteanim = function(action, args) {
		if (typeof action === "undefined") action = "init";

		$(this).each(function() {
			var obj = initializeElement(this);

			switch (action) {
				case "init":
					break;

				case "stop":
					obj.stop();
					obj.timer = null;
					break;

				case "fps":
					obj.fps = args;
					if (obj.timer) obj.doPlay();   // was playing
					break;

				case "play":
					obj.play();
					break;
				
				case "forwards":
					obj.forwards = args;
					break;

				default:
					$.error("Invalid action.");
					break;
			}
		});

		return this;
	};
});




/**
 * THIRD PARTY LIBRARIES
 */


/**
 * Function.prototype.bind for older browsers.
 * 
 * Thanks to: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


/**
 * Array.isArray for older browsers.
 * 
 * Thanks to: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}


/*
 * jquery.imageload -  reliable image load event
 *
 * Copyright (c) 2011 Jess Thrysoee (jess@thrysoee.dk)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function($) {

	// global
	$.ImageLoader = function(src) {
		var img, loader;

		// internal image
		img = new Image();

		loader = $.Deferred(function(deferred) {
			var ns = '.ImageLoader',
				events;

			// load is unreliable on oldIE so also listen for readystatechange
			events = $.map(['readystatechange', 'load', 'abort', 'error'], function(type) {
				return type + ns;
			}).join(' ');

			$(img).bind(events, function(e) {

				if (e.type === 'readystatechange') {
					if (this.readyState !== 'complete') {
						// ignore and handle when error is fired
						return false;
					}
				}

				if (e.type === 'abort' || e.type === 'error') {
					deferred.rejectWith(this, [e]);
				} else {
					deferred.resolveWith(this, [e]);
				}

				$(this).unbind(ns);

				return false;
			});
		}).promise();


		// start image download
		loader.load = function() {
			if (!img.src) {
				img.src = src;
			}
			return this;
		};


		return loader;
	};


	// plugin
	$.fn.imageLoad = function(callback) {
		return this.filter('img').each(function() {
			var img = this;

			if (!img.src) {
				$.error('imageLoad: undefined src attribute');
			}

			// load internal image
			$.ImageLoader(img.src).load().then(function(e) {
				// call with the external image as 'this'
				callback.call(img, e);
			}, function(e) {
				callback.call(img, e);
			});

		});
	};

}(jQuery));


// Thanks to Paul Irish
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){ return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }; })();
