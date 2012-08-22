function WheelHandler(view, options) {
	var normalColor = view.color;
	var self = {
		appEvents: ['wheelsOverlapping', 'wheelSnapped', 'wheelDetached'],
		wheelsOverlapping: function(payload) {
			if(payload.wheels.indexOf(view.id) >= 0 ) {
				view.isOverlapping = true;
				view.warn();
			} else {
				view.isOverlapping = false;
				if(!view.isDetached)
					view.unwarn();
			}
		},
		
		wheelSnapped: function(payload) {
			var wheel = JSON.parse(payload.wheel);
			if(wheel.id == view.id) {
				view.position = wheel;
				view.isDetached = false;
				if(!view.isOverlapping) {
					view.unwarn();
				}
			}
		},
		
		wheelDetached: function(payload) {
			var wheelID = payload.wheelID;
			if(wheelID == view.id) {
				view.isDetached = true;
				view.warn();
			}
		}
	};
	Mixable(self).mix(EventHandler(view, options));
	return self;
}

