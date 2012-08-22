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
		var parts;
		beforeEach(function() {
			parts = dataMaker.parts;
			var skeleton = [['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['Z']];
			// the chassis
			parts[0].skeleton = skeleton;
			// a wheel
			parts[1].x = 0;
			parts[1].y = 50;
			// another wheel
			parts[2].x = 0;
			parts[2].y = 1000;
			// a wheel inside the chassis
			parts[3].x = 60;
			parts[3].y = 50;
		});
		
		it('should bring wheels to chassis edges', function(){
			spyOn(parts[1], 'snap');
			var algo = WheelSnappingAlgorithm(parts);
			algo.perform();
			expect(parts[1].x).toBe(50-PartsFolio.wheel.axis);
			expect(parts[1].y).toBe(50);
			expect(parts[1].snap).toHaveBeenCalled();
		});
		
		it('should detach a wheel if it is too far way from the chassis', function() {
			var wheel = parts[2];
			spyOn(wheel, 'detach');
			var algo = WheelSnappingAlgorithm(parts);
			algo.perform();
			expect(wheel.detach).toHaveBeenCalled();
		});
		
		it('should extrude wheels out', function() {
			spyOn(parts[3], 'snap');
			var algo = WheelSnappingAlgorithm(parts);
			algo.perform();
			expect(parts[3].x).toBe(50-PartsFolio.wheel.axis);
			expect(parts[3].y).toBe(50);
			expect(parts[3].snap).toHaveBeenCalled();			
		});
	});
});