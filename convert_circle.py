# coding=utf-8

import json
import shapefile
import codecs
from shapely.geometry import Polygon

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
