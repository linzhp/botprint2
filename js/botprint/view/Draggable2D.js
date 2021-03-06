/**
 * Decorator to make a 2D object draggable,
 * expecting the 2D object to have a position
 * getter and setter
 * @author Zhongpeng Lin
 */

function Draggable2D(object2D) {
	// handling events of svg by triggering events defined by us
	object2D.elem.drag(function(dx, dy, x, y, event){
		event.stopPropagation();
		object2D.trigger(UserEvents.dragMove, {dx: dx, dy: dy, x: x, y: y});
	}, function(x, y, event){
		event.stopPropagation();
		object2D.trigger(UserEvents.dragStart, {x: x, y: y});
	}, function(event){
		event.stopPropagation();
		object2D.trigger(UserEvents.dragEnd, {});
	});
	
	/* 
	 * As a click event occurs whenever there is a drag operation,
	 * in order to avoid this click event propagate to any ancestor
	 * element (bubble effect), it needs to be handled here and
	 * stopped from propagation. 
	 */
	object2D = Selectable(object2D);
	
	return object2D;
}
