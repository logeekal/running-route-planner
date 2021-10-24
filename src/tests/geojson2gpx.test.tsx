import geoJson2GPX from "../utils/geojson2gpx"
import { route } from './data/route'
import * as fs from 'fs'
import * as path from 'path'
import * as libxml from 'libxmljs'


describe("Test Converting geoJSON to GPX", () => {


  it("validates geojson output with gpx scheme", async () => {

    let xsd = fs.readFileSync( path.join(path.dirname(__filename), "gpx.xsd"))

    let xsdDoc = libxml.parseXmlString(xsd)
    let gpxOutput = geoJson2GPX(route)

    console.log(gpxOutput)

    let gpxDoc = libxml.parseXmlString(gpxOutput)

    expect(gpxDoc.validate(xsdDoc)).toBe(true)
    
  }) 
})
