import * as d3 from 'd3';

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
}

const teethBoundaries = ({context, boundaries, projection })=>{
  const { width, height } = context.canvas;
	const fnPath = d3.geoPath().projection(projection);
	const svg = d3.select('#render').append('svg');
  const marker = svg.append('defs').append('marker');

	attrs(svg, {
		title: 'lepattern',
		version: 1.1,
		xmlns: 'http://www.w3.org/2000/svg',
		width, 
		height
	});

	attrs(marker, {
		id: 'Triangle',
		viewBox: '0 0 6 6',
//    markerUnits: '',
		markerWidth: 3,
		markerHeight: 3,
		orient: 'auto'
	});
	marker.append('path').attr('d', 'M 3 6 L 0 0 L 6 0 z'); 

 	const path = svg.append('g').append('path');
	attrs(path, {
		'fill': 'rgba(0,0,0,0)',
		'stroke':'#000',
		'd': fnPath(boundaries),
		'marker':'none',
		'stroke-width': 2,
		'stroke-color':'#000',
		'marker-mid': 'url(#Triangle)',
	});

	svgToImage(svg.node()).then((img)=>{
  	context.drawImage(img, 0,0);
	});
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
