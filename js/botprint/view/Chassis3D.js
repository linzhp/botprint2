/**
 * @author Zhongpeng Lin
 */
Chassis3D.prototype = new THREE.Mesh();
Chassis3D.constructor = Chassis3D;

function Chassis3D(chassisModel) {
	var material = new THREE.MeshPhongMaterial();
	var shape = this.buildShape(chassisModel.shape);
	var geometry = shape.extrude({amount: PartsFolio.chassis.height});
	geometry.computeBoundingBox();
	var bBox = geometry.boundingBox;
	// record the position of the geometry
	var position = new THREE.Vector3((bBox.min.x+bBox.max.x)*.5, 
		(bBox.min.y+bBox.max.y)*.5, 0);
	/* move the geometry to center, so that later rotation of
	 * the mesh will be around the center of the geometry
	 */
	THREE.GeometryUtils.center(geometry);
	THREE.Mesh.call(this,  geometry, material);
	this.position = position;
	// replay transforms in original SVG
	$.each(chassisModel.transform, function(index, t){
		if(t[0] == 'T')
		{
			this.translateX(t[1]);
			this.translateY(t[2]);
		}else if(t[0] == 'R'){
			this.rotation.z += t[1] * Math.PI /180;
		}
	});
}

Chassis3D.prototype.buildShape = function(path) {
	var shape = new THREE.Shape();

	if(path.length == 3 &&
	   path[0][0] == "M" &&
	   path[1][0].toUpperCase() == "R" &&
	   path[2][0].toUpperCase() == "Z") {
		var dots = path[0].slice(1);
		var bezierPath = catmullRom2bezier(dots.concat(path[1].slice(1)), true);
		// replace the Catmull-rom path with Bezier path
		path.splice(1, path.length-1);
		path = path.concat(bezierPath);
	}
	// used to remove duplicate actions
	var existingActions = {};
	for(var i = 0; i < path.length; i++)
	{
		var action = path[i];
		if(!existingActions[action]){
			existingActions[action] = true;
			switch(action[0].toUpperCase()){
				case 'M':
					shape.moveTo(action[1], action[2]);
					break;
				case 'L':
					shape.lineTo(action[1], action[2]);
					break;
				case 'C':
					shape.bezierCurveTo(action[1], action[2], action[3], action[4], action[5], action[6]);
					break;
				case 'R':
					var points = [];
					for(var i=1; i < action.length; i+=2) {
						points.push(new THREE.Vector2(action[i], new THREE.Vector2(action[i+1])));
					}
					shape.splineThru(points);
					break;
				case 'Z':
					shape.closePath();
					break;
			}

		}
	}
	return shape;
};

// From Raphael.js
function catmullRom2bezier(crp, z) {
	var d = [];
	for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
		var p = [
					{x: +crp[i - 2], y: +crp[i - 1]},
					{x: +crp[i],     y: +crp[i + 1]},
					{x: +crp[i + 2], y: +crp[i + 3]},
					{x: +crp[i + 4], y: +crp[i + 5]}
				];
		if (z) {
			if (!i) {
				p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
			} else if (iLen - 4 == i) {
				p[3] = {x: +crp[0], y: +crp[1]};
			} else if (iLen - 2 == i) {
				p[2] = {x: +crp[0], y: +crp[1]};
				p[3] = {x: +crp[2], y: +crp[3]};
			}
		} else {
			if (iLen - 4 == i) {
				p[3] = p[2];
			} else if (!i) {
				p[0] = {x: +crp[i], y: +crp[i + 1]};
			}
		}
		d.push(["C",
			  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
			  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
			  (p[1].x + 6 * p[2].x - p[3].x) / 6,
			  (p[1].y + 6*p[2].y - p[3].y) / 6,
			  p[2].x,
			  p[2].y
		]);
	}

	return d;
}
