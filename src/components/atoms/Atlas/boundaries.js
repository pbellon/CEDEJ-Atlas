import * as d3 from 'd3';
import * as spp from 'svg-path-properties';

const TEETH_GAP = 20;

export const BOUNDARIES = {
	TEETH: 'teeth',
	FULL: 'full',
	DASHED: 'dashed',
	NONE: null,
};

const attrs = (sel, _attrs)=>{
	for (const i in _attrs) {
		sel.attr(i, _attrs[i]); 
	}
	return sel;
};

const svgToImage = (svg)=>{
	return new Promise((resolve, reject)=>{
		const source = (new XMLSerializer()).serializeToString(svg); 
		const blob = new Blob([source], {type:'image/svg+xml;charset=utf-8'});
		const blobURL = URL.createObjectURL(blob); 
		const img = new Image();
		img.onload = ()=>{
			resolve(img);
			URL.revokeObjectURL(blobURL);
		};	
		img.src = blobURL; 
	});
};
const deg2rad = (deg)=>deg*(Math.PI/180)
const rad2deg = (rad)=>rad*(180/Math.PI)

const triangleAt = (path, l, base=4, height=4)=>{
	const point = path.properties.getPointAtLength(l);
	const tan = path.properties.getTangentAtLength(l);
	const angle = Math.atan(tan.y/tan.x);
	// find the angle to rotate
	const triangleAngle = deg2rad(rad2deg(angle)-90) ;
	const x0 = point.x - (base/2)*tan.x;
	const y0 = point.y - (base/2)*tan.y;

	const x1 = point.x + (base/2)*tan.x;
	const y1 = point.y + (base/2)*tan.y;

	const sx0 = point.x - height*Math.cos(triangleAngle);
	const sy0 = point.y - height*Math.sin(triangleAngle);
	
	const sx1 = point.x + height*Math.cos(triangleAngle);
	const sy1 = point.y + height*Math.sin(triangleAngle);
	
	return {
		base0:[x0,y0],
		base1:[x1,y1],
		tops:[[sx0, sy0], [sx1, sy1]]
	};
};


const drawPath = (context, path)=>{
	const path2d = new Path2D(path.path);
	const nbMarkers = Math.floor(path.length/TEETH_GAP);

	context.fillStyle = 'rgba(0,0,0,0)';
	context.strokeStyle = 'black';
	context.strokeWidth = 2;
	context.beginPath();
	context.fill(path2d);
	context.stroke(path2d);

	context.fillStyle = 'rgba(0,0,0,1)';
	for (let i = 1; i <= nbMarkers; i++){
		const l = i * TEETH_GAP;
		const { base0, base1, tops }  = triangleAt(path, l);
		let top = tops.find((p)=>{
			const isInPath = context.isPointInPath(path2d, p[0], p[1]);
			return path.exterior ? isInPath : !isInPath;
		});
		if(!top){ top = tops[0];}		
		
		context.beginPath();
		context.moveTo(base0[0], base0[1]);
		context.lineTo(base1[0], base1[1]);
		context.lineTo(top[0], top[1]);
		context.fill();
		context.closePath();
	}
};


const teethBoundaries = ({context, boundaries, projection })=>{

	const { width, height } = context.canvas;
	const fnPath = d3.geoPath().projection(projection);
	const fnCanvasPath = d3.geoPath().projection(projection).context(context);
	const _path = fnPath(boundaries);
	const centroid = projection(d3.geoCentroid(boundaries)); 

	const pathes = _path.split('M').splice(1).map((p)=>{
		const _p = `M${p}${p.indexOf('Z')>-1?'':'Z'}`;
		const props = spp.svgPathProperties(_p);
		return {
			properties: props,
			length: props.getTotalLength(),
			path: _p,
			centroid,
		}
	});

	if(pathes.length > 1){
		const exteriorPath = pathes.reduce((a, b)=>a.length > b.length ? a : b);
		pathes.forEach((p)=>{
			p.exterior = p.path == exteriorPath.path;
			drawPath(context, p);
		});
	} else {
		const path = pathes[0];
		path.exterior = true;
		drawPath(context, pathes[0]);
	}
};

const fullBoundaries = ()=>(null);
const dashedBoundaries = ()=>(null);

export const addBoundaries = ({pattern, ...options}) => {
	switch (pattern.boundaries) {
		case BOUNDARIES.TEETH:
			teethBoundaries({pattern, ...options});
			break;
		case BOUNDARIES.FULL:
			fullBoundaries({pattern, ...options});
			break;
		case BOUNDARIES.DASHED:
			dashedBoundaries({pattern, ...options});
			break;
		default:
			break;
	}
};

const initData = (data)=>{

};

const addAllBoundaries = (data)=>{

}
