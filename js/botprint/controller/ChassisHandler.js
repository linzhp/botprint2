function ChassisHandler(view, options) {
	var self = {
		appEvents: ['chassisSelfIntersecting', 'chassisAdapted'],
		
		chassisSelfIntersecting: function(payload) {
			view.warn();
		},
		
		chassisAdapted: function(payload) {
			var chassis = JSON.parse(payload.chassis);
			view.updateShape(chassis.shape);
		}
	};
	Mixable(self).mix(EventHandler(view, options));
	return self;
}