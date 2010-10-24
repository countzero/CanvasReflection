/*
Name:       CanvasReflection
Version:    0.0.2 (24. October 2010)
Author:     Finn Rudolph
Support:    finn.rudolph@googlemail.com

License:    This code is licensed under a Creative Commons 
            Attribution-Noncommercial 3.0 Unported License 
            (http://creativecommons.org/licenses/by-nc/3.0/).

            You are free:
                + to Share - to copy, distribute and transmit the work
                + to Remix - to adapt the work

            Under the following conditions:
                + Attribution. You must attribute the work in the manner specified by the author or licensor 
                  (but not in any way that suggests that they endorse you or your use of the work). 
                + Noncommercial. You may not use this work for commercial purposes. 

            + For any reuse or distribution, you must make clear to others the license terms of this work.
            + Any of the above conditions can be waived if you get permission from the copyright holder.
            + Nothing in this license impairs or restricts the author's moral rights.
*/

/* Constructor */
function CanvasReflection()
{
	/* Closure for this */
	var my = this;

	/* Initialize */
	this.initialize = function(image)
	{
		/* Create canvas element */
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);

		/* Set options */
		this.options = 
		{
			canvas: canvas,
			context: canvas.getContext('2d'),
			image: image,
			width: image.width,
			height: image.height,
			reflectionPercent: 50,
			reflectionOpacity: 0.2,
			counter: 200 
		};

		/* Call the animation function every 10 ms */
		this.animationInterval = window.setInterval(my.animation, 10);
	};
	
	/* Animate the canvas scaling */
	this.animation = function()
	{
		/* Change the canvas dimensions */
		var height = my.options.height - my.options.counter;
		var width = (my.options.width / my.options.height) * height;
		var reflectionHeight = height * ( my.options.reflectionPercent / 100);

		/* Render the canvas element */
		my.reflect(my.options.canvas, my.options.context, my.options.image, width, height, reflectionHeight, my.options.reflectionOpacity);
		
		/* Decrease the counter */
		my.options.counter -= 1;
		
		/* Interrupt the interval after options.counter rounds */
		if(my.options.counter < 0)
		{
			window.clearInterval(my.animationInterval);
		}
	};

	/* Reflect the image */
	this.reflect = function(canvas, context, image, width, height, reflectionHeight, reflectionOpacity)
	{
		/* Set canvas dimensions */
		canvas.height = height + reflectionHeight;
		canvas.width = width;

		/* Draw flipped source image */
		context.save();
		context.translate(0,height);
		context.scale(1,-1);
		context.drawImage(image, 0, -height, width, height);
		context.restore();
		
		/* Draw gradient over flipped source image */
		context.save();
		context.globalCompositeOperation = 'destination-out';
		var gradient = context.createLinearGradient(0, height, 0, canvas.height);
		gradient.addColorStop(1, 'rgba(255, 255, 255, 1.0)');
		gradient.addColorStop(0, 'rgba(255, 255, 255, '+reflectionOpacity+')');
		context.fillStyle = gradient;
		context.rect(0, height, width, reflectionHeight);
		context.fill();
		context.restore();
		
		/* Draw source image on top */
		context.drawImage(image, 0, 0, width, height);
		context.restore();
	};
}	
	
/* Create global instance when the DOM structure has been loaded */
domReady(function()
{
	/* Reflect all images in the DOM */
	var images = document.getElementsByTagName('IMG'),
		max = images.length, 
		i;
	for(i=0;i<max;i++)
	{
		this['reflectedImage'+i] = new CanvasReflection();
		this['reflectedImage'+i].initialize(images[i]);
	}
});