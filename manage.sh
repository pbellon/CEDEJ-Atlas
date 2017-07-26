#!/usr/bin/env zsh

convert(){
  converted="topo-$2"
  ./node_modules/topojson-server/bin/geo2topo $1=data/$2 > data/$converted
}

buildData(){
  convert areas temperature_f.json
  convert circles circle.json
  convert patterns aridity.json
}


if [[ "$(type -w $@)" =~ .*function ]];
then
  echo Starting "$@"
  eval $(printf "%q " "$@")
else
  echo "Function $@ not found, please check manage.sh file"
fi

