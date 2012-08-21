function ChassisAdjustingAlgorithm(parts, radio) {
	var self = {
		perform: function() {
			var wheels = [], chassis;
			parts.forEach(function(part) {
				if(part.name == 'Chassis') {
					chassis = part;
				} else if(part.name == 'Wheel'){
					wheels.push(part);
				}
			});
			
			var polygonPath = chassis.skeleton, shape;
			polygonPath.forEach(function(action, index){
				switch(action[0]){
					case 'M':
						shape = [['M', action[1], action[2]], ['R']];
						break;
					case 'L':
						shape[1].push(action[1], action[2]);
						break;
					case 'Z':
						shape.push('Z');
						break;
				}
			});
			
			chassis.shape = shape;
			radio.trigger(ApplicationEvents.chassisShapeUpdated, {chassis: JSON.stringify(chassis)});
		}
	};
	
	Mixable(self).mix(Algorithm(parts));
	return self;
}