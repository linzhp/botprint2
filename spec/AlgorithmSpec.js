/**
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
describe("PCG-Algorithms", function(){
	var deck;
	var blocks;
	var dataMaker;

	beforeEach(function(){
		dataMaker   = new DataMaker();
		blocks 		= dataMaker.blocks();
		deck 	    = new Deck({name:"Bottom", bus: dataMaker.bus, dimensions: { w:500, h:500, d:0 }});
	});

	afterEach(function(){
		dataMaker = null;
		blocks    = null;
		deck	  = null;
	});

	describe("Once ready for packing the layout", function(){
		it("should pack a 50 by 50 area (via packer only)", function(){
			var packer = new BinPacker(deck);
			blocks.sort();
			packer.fit(blocks);
			var packed = [];
			for(var n = 0 ; n < blocks.length ; n++) {
				var block = blocks[n];
				if (block.fit) {
					packed.push(block);
				}
			}

			expect(packed.length).toBeGreaterThan(0);
		});

		it("should pack a 50 by 50 area (via algorithm)", function(){
			// todo(Huascar) do next
			expect(true).toBeTruthy();
		});
	});

	describe("Once ready for snapping wheels", function(){
		it("should bring wheels to chassis edges", function(){
			var skeleton = [['M', 0, 0], ['L', 0, 1], ['L', 1, 1], ['Z']];
			var parts = dataMaker.parts;
			// the chassis
			parts[0].skeleton = skeleton;
			// a wheel
			parts[1].x = 0;
			parts[1].y = 0.5;
			var radio = Bindable();
			var algo = WheelSnappingAlgorithm(parts, radio);
			algo.perform();
			expect(parts[1].x).toBe(0.5);
			expect(parts[1].y).toBe(0.5);
		});
	});
});