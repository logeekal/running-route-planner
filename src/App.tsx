import {useState} from "react";
import LocationSeries from "./sections/location-series/LocationSeries";
import LocationProvider from "./contexts/location/location-provider";
import RouteMap from "./sections/route-map/RouteMap";
import geoJson2GPX from "./utils/geojson2gpx";


export default function App() {

  const [navigableRoute, setNavigableRoute] = useState<any>()
  
  const handleGPXDownload = () => {
    if (!navigableRoute){
      alert("route not available")
      return;
    }

    const gpxString = geoJson2GPX(navigableRoute)
    downloadStringAsFile(gpxString, "application/xml", "Myroute.gpx")
  }

  const downloadStringAsFile = (content: string, mimetype: string, name: string  ) => {
    const file = new Blob([content], {type :  mimetype})
    const element = document.createElement("a")
    element.href= URL.createObjectURL(file)
    element.download = name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  
  return <LocationProvider>
    <div className="flex flex-row h-screen">
      <div className="flex flex-col flex-initial sidebar">
        <LocationSeries onFindRoute={() => {}}/>
        <button type="button" onClick={handleGPXDownload}>Save Route as GPX</button>
      </div>
        <RouteMap  onRoute={(geojson) => setNavigableRoute(geojson)}/>       
    </div>
  </LocationProvider>
}
