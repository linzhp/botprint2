/**
 * Chassis domain object. A chassis object 	has two decks (top and bottom),
 * and four panels front, back, left, and right. Each of these parts
 * contains a determined layout for the elements they will contain.
 *
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
function Chassis (opts){
	var options = {isLeaf: false, name: 'Chassis'};
	$.extend(options, opts || {});
	var self = {
		serializable: ['id', 'name', 'skeleton', 'transform', 'shape'],
		
		// path of the polygon
		skeleton: options.skeleton || [],
		transform: options.transform,
		
		isSelfIntersecting: function() {
			return IntersectionDetection.isSelfIntersecting(self.skeleton);
		},
		
		accept: function(visitor) {
			return visitor.visitChassis(this);
		},
		
		adapt: function() {
			self.radio.trigger(ApplicationEvents.chassisAdapted, {chassis: JSON.stringify(self)});
		}
	};

	// Mixing it in, just smash the methods of the newly created
	// View onto this object
	Mixable(self).mix(Part (options));
	return self;
}