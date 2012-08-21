/**
 * @author Zhongpeng Lin
 */
function Edge2DHandler(view, options) {
	var self = {
		userEvents: ['mouseOver', 'mouseMove', 'mouseOut', 'click'],
		
		mouseOver: function(payload) {
			// var event = RelativeCoordEvent(payload.event);
			// var position = {x: event.relativeX, y: event.relativeY};
			// var draw = view.target.elem.paper;
			// self.newVertex = draw.circle(position.x, position.y, 6);
			// self.newVertex.attr({fill: 'white', stroke: 'black'});
			// self.newVertex.click(function(event){debugger;});
		},
		
		mouseMove: function(payload) {
			if(self.newVertex) {
				self.newVertex.attr({cx: payload.x, cy: payload.y});
			}
		},
		
		mouseOut: function(payload) {
			if(self.newVertex){
				self.newVertex.remove();
			}
		},
		
		click: function(payload) {
			var chassis2D = view.target;
			var skeleton = chassis2D.skeleton;
			var path = skeleton.attrs.path;
			path.splice(options.pathIndex+1, 0, ['L', payload.x, payload.y]);
			skeleton.attr({path: path});
			var chassis = Chassis({skeleton: path,
									  transform: skeleton.transform(),
									  app: options.app,
									  id: chassis2D.id});
			chassis.update();
		}
	};
	
	Mixable(self).mix(EventHandler(view, options));
	return self;
}
