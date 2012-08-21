function ChassisHandler(view, options) {
	var self = {
		appEvents: ['chassisSelfIntersecting', 'chassisShapeUpdated'],
		
		chassisSelfIntersecting: function(payload) {
			view.warn();
		},
		
		chassisShapeUpdated: function(payload) {
			var chassis = JSON.parse(payload.chassis);
			view.updateShape(chassis.shape);
		}
	};
	Mixable(self).mix(EventHandler(view, options));
	return self;
}