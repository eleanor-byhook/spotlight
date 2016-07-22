# HTML5 Canvas Spotlight effect

A 'spotlight' effect in the HTML5 canvas using a background canvas, a filter canvas, and an output canvas that renders the filter effect wherever your mouse is hovering. 

###Panning
 For images larger than the canvas, the background will pan when the user hovers their mouse close enough to an edge. 

### Compatability
Unlike most canvas filters, this does not use the built-in blend modes or `globalCompositeOperation`, thus making it compatible with most browsers:

Chrome 44+, Firefox 40+, Safari 8+, Opera 30+, Edge, IE10+ 


### To demo
`npm install`

`gulp`

![Spotlight-demo](/static/images/spotlightDemo.gif)

