function WheelSnappingAlgorithm(parts) {
	var self = {
		perform: function() {
			var chassis, wheels = [];
			parts.forEach(function(p) {
				if(p.name == 'Wheel'){
					wheels.push(p);
				} else if(p.name == 'Chassis') {
					chassis = p;
				}
			});
			var polygon = [];
			chassis.skeleton.forEach(function(action){
				if(action.length == 3){
					polygon.push(new Vector2D(action[1], action[2]));
				}
			});
			
			wheels.forEach(function(w, i) {
				var lineStart = new Vector2D(0, w.y);
				var lineEnd = new Vector2D(10000, w.y);
				var intersect = Intersection.intersectLinePolygon(lineStart, lineEnd, polygon);
				if(intersect.status == 'Intersection') {
					var minDist = 10000, minX, points = intersect.points;
					points.forEach(function(p, i) {
						var dist = Math.abs(p.x-w.x);
						if(dist < minDist){
							minDist = dist;
							minX = p.x;
						}
					});
					if(w.x != minX){
						w.x = minX;
						w.snap();
					}
				} else {
					w.detach();
				}
			});
		}
	};
	Mixable(self).mix(Algorithm(parts));
	return self;
}