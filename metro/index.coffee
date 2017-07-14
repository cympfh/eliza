db = require './db.json'


trim = (name) ->
    ignores = [/^都営地下鉄/, /^都営/, /^東京メトロ/, /^地下鉄/, /線$/, /駅$/]
    for pattern in ignores
        a = name.replace pattern, ''
        if a != name and a.length > 0
            return trim a
    name


line2stations = (line_name) ->
    line_name = trim line_name
    for line in db.lines
        if trim(line.name) == line_name
            return line.stations.join('\n')
    'Unknown line'


station2lines = (station_name) ->
    station_name = trim station_name
    lines = []
    for line in db.lines
        for station in line.stations
            for station_alias in station.split(':')
                if trim(station_alias) == station_name
                    lines.push line.name
    if lines.length > 0
        lines.join '\n'
    else
        'Unknown station'


module.exports = (arg, cont) ->
    if arg[arg.length - 1] == '線'
        result = line2stations arg
    else
        result = station2lines arg
    cont result
