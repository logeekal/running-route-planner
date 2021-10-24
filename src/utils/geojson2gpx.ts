import {IRoute} from "./types";
import xml from 'xml'

export default function geoJson2GPX(geoJSON: IRoute) {
  let xmlJson : any = {
    gpx: [
      {
        _attr: {
          xmlns: "http://www.topografix.com/GPX/1/1",
          version: "1.1",
          creator: "JK Route Planner",
        },
      },
      {
        rte: [
          {
            name: "MyRoute",
          },
        ]
      }
    ],
  };

  geoJSON.routes[0]["geometry"]["coordinates"].forEach(([lon, lat]: any) => {
    xmlJson.gpx.forEach(( child : any) => {
      if ('rte' in child) {
        child.rte.push({
          rtept : [
            {
              _attr: {
                lat,
                lon,
              }
            }
          ]
        })
      }
    })
  })

  return xml(xmlJson);
}
