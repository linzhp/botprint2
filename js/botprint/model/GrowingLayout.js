/**
 * Determines the best fitting rect area.
 *
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
// This is the GrowingPacker to find an interesting area
function GrowingLayout(vertices){
	vertices = vertices || [];

	var self = {

		score: function(block, results) {

		},

		fit: function(blocks) {
			var n, node, block, len = blocks.length;
			var w = len > 0 ? blocks[0].w : 0;
			var h = len > 0 ? blocks[0].h : 0;
			this.root = { x: 0, y: 0, w: w, h: h };
			for (n = 0; n < len ; n++) {
				block = blocks[n];
				if (node = this.findNode(this.root, block.w, block.h))
					block.fit = this.splitNode(node, block.w, block.h);
				else
					block.fit = this.growNode(block.w, block.h);
			}
		},

		findNode: function(root, w, h) {
			if (root.used)
				return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
			else if ((w <= root.w) && (h <= root.h))
				return root;
			else
				return null;
		},

		splitNode: function(node, w, h) {
			node.used = true;
			node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
			node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
			return node;
		},

		growNode: function(w, h) {
			var canGrowDown  = (w <= this.root.w);
			var canGrowRight = (h <= this.root.h);

			var shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w)); // attempt to keep square-ish by growing right when height is much greater than width
			var shouldGrowDown  = canGrowDown  && (this.root.w >= (this.root.h + h)); // attempt to keep square-ish by growing down  when width  is much greater than height

			if (shouldGrowRight)
				return this.growRight(w, h);
			else if (shouldGrowDown)
				return this.growDown(w, h);
			else if (canGrowRight)
				return this.growRight(w, h);
			else if (canGrowDown)
				return this.growDown(w, h);
			else
				return null; // need to ensure sensible root starting size to avoid this happening
		},

		growRight: function(w, h) {
			this.root = {
				used: true,
				x: 0,
				y: 0,
				w: this.root.w + w,
				h: this.root.h,
				down: this.root,
				right: { x: this.root.w, y: 0, w: w, h: this.root.h }
			};
			if (node = this.findNode(this.root, w, h))
				return this.splitNode(node, w, h);
			else
				return null;
		},

		growDown: function(w, h) {
			this.root = {
				used: true,
				x: 0,
				y: 0,
				w: this.root.w,
				h: this.root.h + h,
				down:  { x: 0, y: this.root.h, w: this.root.w, h: h },
				right: this.root
			};
			if (node = this.findNode(this.root, w, h))
				return this.splitNode(node, w, h);
			else
				return null;
		},

		growDiagonal: function(w, h) {

		}
	};

	// Mixing it in, just smash the methods of the newly created
	// View onto this object
	Mixable(self).mix(Algorithm ({vertices: vertices}));
	return self;
}
