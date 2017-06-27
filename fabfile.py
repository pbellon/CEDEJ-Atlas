# coding=utf-8

import json
import shapefile
import codecs
from shapely.geometry import Polygon

def cleanProps(el, keys):
    el['properties'] = { key: el['properties'][key] for key in keys }
    return el

def cleanJSON(fn, keys_to_keep, ftype='geo', topo_key=None):
    fp = open("data/raw/%s" % fn, 'r')
    data = json.load(fp)
    if ftype == 'geo':
        data['features'] = map(lambda el: cleanProps(el, keys_to_keep), data['features'])
    if ftype == 'topo':
        for o in data['objects'][topo_key]['geometries']:
            o = cleanProps(o, keys_to_keep)
    
    with open("data/%s" % fn, 'w') as out:
        json.dump(data, out)

    
# Used to remove unused keys
def cleanData():
    cleanJSON('circles.json', ['size_', 'colours']);
    cleanJSON('temperatures.json', ['Temperatur']);
    cleanJSON('aridity.json', ['d_TYPE', 'OBJECTID_1']);

def cleanTopo():
    cleanJSON('topo-circles.json', ['size_', 'colours'], 'topo', 'circles');
    cleanJSON('topo-temperatures.json', ['Temperatur'], 'topo', 'areas');
    cleanJSON('topo-aridity.json', ['d_TYPE', 'OBJECTID_1'], 'topo', 'patterns');

def createCirclesData():
    # shpf = open('shapefiles/circles', 'r')
    shp = shapefile.Reader('shapefiles/circles')

    out = { 'type': 'FeatureCollection', 'features': []}
    fields = map(lambda f: f[0], shp.fields[1:])

    STR = type('')
    isStr = lambda e: type(e) == STR

    for shape in shp.shapeRecords():
        l = lambda r: r.decode('latin') if isStr(r) else r
        record = map(l, shape.record)
        props = dict(zip(fields, record))

        poly = Polygon(shape.shape.points)
        center = poly.centroid

        out_shape = {
            'type':'Feature',
            'properties': props,
            'geometry': {
                'type': 'Point', 'coordinates': [center.x, center.y]
            }
        }
        out['features'].append(out_shape)

    with open('data/circles.json', 'w') as outfile:
        json.dump(out, outfile)

