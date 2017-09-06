
/*  Constants: */
var svgViewBoxWidth = 800	// The original width value of the viewBox attribute for the svg element.
var svgViewBoxHeight = 600	// The original height value of the viewBox attribute for the svg element.
var leftArrow = 37	// The numeric code for the left arrow key.
var upArrow = 38
var rightArrow = 39
var downArrow = 40
var panRate = 10	// Number of pixels to pan per key press.
var zoomRate = 1.1	// Must be greater than 1. Increase this value for faster zooming (i.e., less granularity).

/* Globals: */
var theSvgElement

function processKeyPress (evt) {
  var viewBox = theSvgElement.getAttribute('viewBox')	// Grab the object representing the SVG element's viewBox attribute.
  var viewBoxValues = viewBox.split(' ')				// Create an array and insert each individual view box attribute value (assume they're seperated by a single whitespace character).

  viewBoxValues[0] = parseFloat(viewBoxValues[0])		// Convert string "numeric" values to actual numeric values.
  viewBoxValues[1] = parseFloat(viewBoxValues[1])

  switch (evt.keyCode) {
    case leftArrow:
      viewBoxValues[0] += panRate	// Increase the x-coordinate value of the viewBox attribute to pan right.
      break
    case rightArrow:
      viewBoxValues[0] -= panRate	// Decrease the x-coordinate value of the viewBox attribute to pan left.
      break
    case upArrow:
      viewBoxValues[1] += panRate	// Increase the y-coordinate value of the viewBox attribute to pan down.
      break
    case downArrow:
      viewBoxValues[1] -= panRate	// Decrease the y-coordinate value of the viewBox attribute to pan up.
      break
  } // switch

  theSvgElement.setAttribute('viewBox', viewBoxValues.join(' '))	// Convert the viewBoxValues array into a string with a white space character between the given values.
}

function zoom (zoomType) {
  var viewBox = theSvgElement.getAttribute('viewBox')	// Grab the object representing the SVG element's viewBox attribute.
  var viewBoxValues = viewBox.split(' ')				// Create an array and insert each individual view box attribute value (assume they're seperated by a single whitespace character).

  viewBoxValues[2] = parseFloat(viewBoxValues[2])		// Convert string "numeric" values to actual numeric values.
  viewBoxValues[3] = parseFloat(viewBoxValues[3])

  if (zoomType == 'zoomIn') {
    viewBoxValues[2] /= zoomRate	// Decrease the width and height attributes of the viewBox attribute to zoom in.
    viewBoxValues[3] /= zoomRate
  } else if (zoomType == 'zoomOut') {
    viewBoxValues[2] *= zoomRate	// Increase the width and height attributes of the viewBox attribute to zoom out.
    viewBoxValues[3] *= zoomRate
  } else { alert('function zoom(zoomType) given invalid zoomType parameter.') }

  theSvgElement.setAttribute('viewBox', viewBoxValues.join(' '))	// Convert the viewBoxValues array into a string with a white space character between the given values.

  var currentZoomFactor = svgViewBoxWidth / viewBoxValues[2]										// Calculates the current zoom factor, could have just as easily used svgViewBoxHeight.
  var newText = document.createTextNode('Current zoom factor = ' + currentZoomFactor.toFixed(3))	// Create a generic new text node object.
  var parentNode = document.getElementById('currentZoomFactorText')  								// Get the parent node of the text node we want to replace.

  parentNode.replaceChild(newText, parentNode.firstChild)  // Replace the first child text node with the new text object.
}

function zoomViaMouseWheel (mouseWheelEvent) {
  if (mouseWheelEvent.wheelDelta > 0) { zoom('zoomIn') } else { zoom('zoomOut') }

    /* When the mouse is over the webpage, don't let the mouse wheel scroll the entire webpage: */
  mouseWheelEvent.cancelBubble = true
  return false
}

function initialize () {
    /* Add event listeners: */
  window.addEventListener('keydown', processKeyPress, true)		// OK to let the keydown event bubble.
  window.addEventListener('mousewheel', zoomViaMouseWheel, false)	// Don't let the mousewheel event bubble up to stop native browser window scrolling.

    /* Set a global variable and detect if the browser supports SVG: */
  theSvgElement = document.getElementById('svgElement')			// Best to only access the SVG element after the page has fully loaded.

  if (theSvgElement.namespaceURI != 'http://www.w3.org/2000/svg')	// Alert the user if their browser does not support SVG.
      { alert('Inline SVG in HTML5 is not supported. This document requires a browser that supports HTML5 inline SVG.') }

    /* For the svg element, specifically set the viewBox attribute's width and height values in that one of them will be used to calculate the current scaling factor. */
  theSvgElement.setAttribute('viewBox', '0 0 ' + svgViewBoxWidth + ' ' + svgViewBoxHeight)
}
