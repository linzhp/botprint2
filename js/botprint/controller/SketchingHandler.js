/**
 * @author Zhongpeng Lin
 */

function SketchingHandler(view, options) {
	
	var self = {
		userEvents: ['click', 'mouseMove', 'dblClick'],
		
		click: function(payload) {
			var x = payload.x;
			var y = payload.y;

			if(this.skeleton){
				// Extend the path
				var path = this.skeleton.attrs.path;
				this.skeleton.attr('path', path +' L ' + x + ' ' + y);
			}else{
				// Create a new path
				var draw = view.draw;
				this.skeleton = draw.path('M '+x+' '+y+' L ' + x + ' ' + y);
				this.skeleton.attr(view.shapeAttributes);
			}
		},
		
		mouseMove: function(payload) {
			var x = payload.x;
			var y = payload.y;

			if(this.skeleton){
				// Modify the last path element
				var path = this.skeleton.attrs.path;
				var last = path[path.length - 1];
				last[1] = x;
				last[2] = y;
				this.skeleton.attr('path', path);
			}
		},
		
		dblClick: function(payload){
			if(this.skeleton){
				var path = this.skeleton.attrs.path;
				/* click event handler is called twice
				 * before this. Two pop operations from path
				 * are to offset the effect of two click events
				 */ 
				path.pop();
				path.pop();
				this.skeleton.attr({path: path +'Z', stroke: 'black', fill: null});
				var chassis2D = Chassis2D(this.skeleton, {app:options.app, shapeAttributes:view.shapeAttributes});
				view.doneSketching(chassis2D);
				var chassis = Chassis({skeleton: this.skeleton.attrs.path,
									  transform: this.skeleton.transform(),
									  app: options.app,
									  id: chassis2D.id});
				chassis.create();
				this.skeleton = null;
			}
		}
	};
	
	Mixable(self).mix(EventHandler(view, options));
	return self;
}
