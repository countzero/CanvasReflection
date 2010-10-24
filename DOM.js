/* DOMContentLoaded event handler - by Tanny O'Haley [http://tanny.ica.com/ICA/TKO/tkoblog.nsf/dx/domcontentloaded-for-browsers-part-v] */
var domReadyEvent =
{
	name: "domReadyEvent",
	/* Array of DOMContentLoaded event handlers.*/
	events: {},
	domReadyID: 1,
	bDone: false,
	DOMContentLoadedCustom: null,

	/* Function that adds DOMContentLoaded listeners to the array.*/
	add: function(handler)
	{
		/* Assign each event handler a unique ID. If the handler has an ID, it has already been added to the events object or been run.*/
		if (!handler.$$domReadyID)
		{
			handler.$$domReadyID = this.domReadyID++;

			/* If the DOMContentLoaded event has happened, run the function. */
			if(this.bDone)
			{
				handler();
			}

			/* store the event handler in the hash table */
			this.events[handler.$$domReadyID] = handler;
		}
	},

	remove: function(handler)
	{
		/* Delete the event handler from the hash table */
		if (handler.$$domReadyID)
		{
			delete this.events[handler.$$domReadyID];
		}
	},

	/* Function to process the DOMContentLoaded events array. */
	run: function()
	{
		/* quit if this function has already been called */
		if (this.bDone)
		{
			return;
		}

		/* Flag this function so we don't do the same thing twice */
		this.bDone = true;

		/* iterates through array of registered functions */
		for (var i in this.events)
		{
			this.events[i]();
		}
	},

	schedule: function()
	{
		/* Quit if the init function has already been called*/
		if (this.bDone)
		{
			return;
		}

		/* First, check for Safari or KHTML.*/
		if(/KHTML|WebKit/i.test(navigator.userAgent))
		{
			if(/loaded|complete/.test(document.readyState))
			{
				this.run();
			}
			else
			{
				/* Not ready yet, wait a little more.*/
				setTimeout(this.name + ".schedule()", 100);
			}
		}
		else if(document.getElementById("__ie_onload"))
		{
			/* Second, check for IE.*/
			return true;
		}

		/* Check for custom developer provided function.*/
		if(typeof this.DOMContentLoadedCustom === "function")
		{
			/* if DOM methods are supported, and the body element exists (using a double-check
			including document.body, for the benefit of older moz builds [eg ns7.1] in which
			getElementsByTagName('body')[0] is undefined, unless this script is in the body section) */
			if(typeof document.getElementsByTagName !== 'undefined' && (document.getElementsByTagName('body')[0] !== null || document.body !== null))
			{
				/* Call custom function. */
				if(this.DOMContentLoadedCustom())
				{
					this.run();
				}
				else
				{
					/* Not ready yet, wait a little more. */
					setTimeout(this.name + ".schedule()", 250);
				}
			}
		}
		return true;
	},

	init: function()
	{
		/* If addEventListener supports the DOMContentLoaded event.*/
		if(document.addEventListener)
		{
			document.addEventListener("DOMContentLoaded", function() { domReadyEvent.run(); }, false);
		}

		/* Schedule to run the init function.*/
		setTimeout("domReadyEvent.schedule()", 100);

		function run()
		{
			domReadyEvent.run();
		}

		/* Just in case window.onload happens first, add it to onload using an available method.*/
		if(typeof addEvent !== "undefined")
		{
			addEvent(window, "load", run);
		}
		else if(document.addEventListener)
		{
			document.addEventListener("load", run, false);
		}
		else if(typeof window.onload === "function")
		{
			var oldonload = window.onload;
			window.onload = function()
			{
				domReadyEvent.run();
				oldonload();
			};
		}
		else
		{
			window.onload = run;
		}

		/* for Internet Explorer */
		/*@cc_on
			@if (@_win32 || @_win64)
			document.write("<script id=__ie_onload defer src=\"//:\"><\/script>");
			var script = document.getElementById("__ie_onload");
			script.onreadystatechange = function()
			{
				if (this.readyState == "complete")
				{
					domReadyEvent.run(); // call the onload handler
				}
			};
			@end
		@*/
	}
};
var domReady = function(handler) { domReadyEvent.add(handler); };
domReadyEvent.init();