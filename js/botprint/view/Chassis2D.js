function Chassis2D(skeleton, options) {
	var self = {
		skeleton: skeleton,
		vertices: [],
		edges: [],
		points: [],
		id: new Date().getTime(),
		
		set color(c) {
			self.elem.attr({fill: c});
		},
		
		get color(){
			return self.elem.attrs.fill;
		},
		
		select: function() {
			self.glow = self.elem.glow({color: self.color});
			self.showWidgets(self.elem);
			this.selected = true;
		},
		
		deselect: function() {
			if(self.glow) {
				self.glow.remove();
				self.glow = null;
			}
			self.hideWidgets();
			this.selected = false;
		},
		
		warn: function() {
			self.skeleton.attr({stroke: 'red'});
			if(self.selected)
				self.deselect();
			if(self.elem){
				self.elem.hide();
			}
			self.showWidgets(self.skeleton);
		},
		
		unwarn: function() {
			self.skeleton.attr({stroke: 'black'});
			self.elem.show();
			// remove widgets based on skeleton
			self.hideWidgets();
		},
		
		updateShape: function(path) {
			if(self.elem) {
				self.elem.attr({path: path});
			} else {
				var draw = self.skeleton.paper;
				self.elem = draw.path(path);
				self.elem.attr(options.shapeAttributes);
				
				var selectionHandler = SelectionHandler(Selectable(self), {app: options.app});
				selectionHandler.enable();
				self.trigger(UserEvents.click, {});
			}
			self.unwarn();
			if(self.selected) {
				self.deselect();
				self.select();
			}
		},
		
		showWidgets: function(target) {
			if(self.vertices.length>0)
				return;
			var path = target.attrs.path;
			var numPoints = self.skeleton.attrs.path.length - 1;
			for(var index = 0; index < numPoints; index++) {
				var action = path[index];
				var length = action.length;
				if(length < 3)
					return;
				var p = {x:action[length-2], y:action[length-1]}
				var widgetOptions = {app: options.app, pathIndex: index};
				var vertex = Vertex2D(p,
					self,
					widgetOptions);
				self.vertices.push(vertex);
				var edge = Edge2D(p, path[index+1], self, widgetOptions);
				self.edges.push(edge);
			}

		},
		
		hideWidgets: function() {
			while(self.vertices.length > 0){
				var vertex = self.vertices.pop();
				vertex.remove();
			}
			while(self.edges.length > 0) {
				var edge = self.edges.pop();
				edge.remove();
			}			
		}
	};
	
	Mixable(self).mix(View());
	
	var cHandler = ChassisHandler(self, {app: options.app});
	cHandler.enable();
	
	return self;
}
