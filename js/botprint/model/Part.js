/**
 * Part domain object.
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
function Part(opts){
	var children = [];
	var self = {
		id: opts.id,
		/**
		 * adds a new ``child'' part.
		 * @param child part to be added.
		 */
		add: function(child){
			if(self.isLeaf()){
				throw "Error: This object is not allowed to have any children. Therefore"
					+ ", calling the add method on this object will be a mistake."
			}
			children.push(child);
		},

		/**
		 * gets a given ``child'' located at a given index.
		 * @param idx location of the child of interest.
		 * @return {*} child of interest.
		 */
		getChild: function (idx){
			if(self.isLeaf()){
				throw "Error: This object is not allowed to have any children.."
			}
			return children[idx];
		},

		/**
		 * @return {Function} true if this is a leaf. False if this is a
		 * composite part.
		 */
		isLeaf: function(){
			return self.options().isLeaf;
		},

		removeAll: function(){
			children.forEach(function(elem){
				self.remove(elem);
			});
		},

		/**
		 * removes a ``child'' part.
		 * @param child child part to be removed.
		 * @return {Boolean} true if the child was removed.False otherwise.
		 */
		remove: function(child){
			if(self.isLeaf()){
				throw "Error: This object is not allowed to have any children. Therefore"
					+ ", calling the remove method on this object will be a mistake."
			}
			for (var node, i = 0; node = self.getChild(i); i++) {
				if(node == child){
					children.splice(i, 1);
					return true;
				}

				if(node.remove(child)){
					return true;
				}
			}

			return false;
		},

		/**
		 * samples the children data structure given a matching condition.
		 * @param filter matching condition.
		 */
		select: function(filter){
			if(self.isLeaf()){
				throw "Error: This object is not allowed to have any children. Therefore"
					+ ", calling the select method on this object will be a mistake."
			}
			filter = filter || function(p) { return true; };
			return children.select(filter);
		},

		update: function(){
			/* All attributes of self will be stringified by default.
			 * However, it is encouraged to specify a list of attributes
			 * in the serializable array, so that only those attributes will be
			 * stringified.
			 */
			var json = JSON.stringify(this);
			self.radio.trigger(ApplicationEvents.partUpdated, {part: json});
		},
		
		create: function() {
			var json = JSON.stringify(this);
			self.radio.trigger(ApplicationEvents.partAdded, {part: json});			
		}

	};

	// Mixing it in, just smash the methods of the newly created
	// View onto this object
	opts = opts || {};
	Mixable(self).mix( Model (opts));
	return self;
}
