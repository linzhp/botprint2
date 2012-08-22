/**
 * @author Zhongpeng Lin
 *
 */

function VertexDraggingHandler(view, options) {
	
	var self = {
		dragStart: function(payload) {
			self.super.dragStart(payload);
			view.target.elem.attr({opacity: 0.3});
		},
		
		dragMove: function(payload) {
			self.super.dragMove(payload);
			var position = view.position;
			var skeleton = view.target.skeleton;
			var path = skeleton.attrs.path;
			path[options.pathIndex][1] = position.x;
			path[options.pathIndex][2] = position.y;
			skeleton.attr({path: path});
		},
		
		dragEnd: function(payload) {
			self.super.dragEnd(payload);
			var chassis2D = view.target;
			chassis2D.elem.attr({opacity: 1});
			var skeleton = chassis2D.skeleton;
			var path = skeleton.attrs.path;
			var chassis = Chassis({skeleton: path,
									  transform: skeleton.transform(),
									  app: options.app,
									  id: chassis2D.id});
			chassis.update();
		}
	};
	Mixable(self).mix(DraggingHandler(view, options));

	return self;
}
