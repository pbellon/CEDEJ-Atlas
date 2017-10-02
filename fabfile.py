# coding=utf-8

import json
import shapefile
import codecs
from shapely.geometry import Polygon

def cleanProps(el, keys):
    el['properties'] = { key: el['properties'][key] for key in keys }
    for k in keys: 
        val = el['properties'][k]
        if k == 'Temperatur' and (val == 0 or val == '0'):
            el['properties'] = None
            return el
        if not val or (type(val) == type('') and val.strip() == '' or val == 'null'):
            el['properties'] = None
            return el

    return el

def cleanJSON(fn, keys_to_keep, ftype='geo', topo_key=None):
    fp = open("data/raw/%s" % fn, 'r')
    data = json.load(fp)
    fp.close()
    if ftype == 'geo':
        data['features'] = filter(
            lambda f: f['properties'] != None,
            map(lambda el: cleanProps(el, keys_to_keep), data['features'])
        )

    if ftype == 'topo':
        for o in data['objects'][topo_key]['geometries']:
            o = cleanProps(o, keys_to_keep)
    
    with open("data/clean/%s" % fn, 'w') as out:
        json.dump(data, out)

    
# Used to remove unused keys
def cleanData():
    cleanJSON('circles.json', ['size_', 'colours']);
    cleanJSON('temperatures.json', ['Temperatur']);
    cleanJSON('aridity.json', ['d_TYPE', 'OBJECTID_1']);

def combineDataFiles(out='data/compiled.json'):
    files = ['circles','temperatures', 'deserts', 'aridity', 'rivers', 'lakes']
    result = {}
    for name in files:
        fd = open("data/clean/%s.json" % name, 'r')
        fdata = json.load(fd)
        result[name] = fdata
        fd.close()
    
    with open(out, 'w') as outd:
        json.dump(result, outd)

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

