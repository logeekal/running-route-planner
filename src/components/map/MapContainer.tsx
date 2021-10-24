import mgl, { Map, MapboxOptions,  EventData, MapMouseEvent  } from "mapbox-gl";
import {
  createContext,
  FC,
  HTMLProps,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export type IMapContainer = Partial<MapboxOptions> & {
  containerProps: HTMLProps<HTMLDivElement>;
  onClick?: (e: MapMouseEvent & EventData) => void
};

export interface IMapContext {
  map: Map | undefined;
  setMarkers: any;
  markers: Array<mgl.Marker>;
}



const MapContext = createContext<IMapContext>({} as IMapContext);


const MapContainer: FC<IMapContainer> = (props) => {
  const { container, containerProps, children, onClick, ...restMapProps } = props;
  const [markers, setMarkers] = useState<Array<mgl.Marker>>([]);
  const [bounds, setBounds] = useState<mgl.LngLatBounds>();
  const [map, setMap] = useState<Map>();
  

  const MAPBOX_API_KEY = process.env.REACT_APP_MAPBOX_KEY;
  let mapRef = useRef<HTMLDivElement>(null);

  mgl.accessToken = MAPBOX_API_KEY!;


  useEffect(() => {
    // update bounds
    if(markers.length == 0) return;
    const minLngLat = markers.reduce<[number, number]>(
      (prev, current) => {
        return [Math.min(current.getLngLat().lng, prev[0]), Math.min(current.getLngLat().lat, prev[1])];
      },
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    );

    const maxLngLat = markers.reduce<[number, number]>(
      (prev, current) => {
        return [Math.max(current.getLngLat().lng, prev[0]), Math.max(current.getLngLat().lat, prev[1])];
      },
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
    );

    // west, south, east, north
    console.log({
      minLngLat,
      maxLngLat
    })
    setBounds(
      new mgl.LngLatBounds([
        minLngLat[0],
        minLngLat[1],
        maxLngLat[0],
        maxLngLat[1],
      ])
    );
  }, [markers]);

  useEffect(() => {
    bounds && map?.fitBounds(bounds, { padding: 100 });
  }, [bounds]);

  useEffect(() => {
    if(!map) return;

    console.log("observing", map)

    const sizeObserver =  new ResizeObserver(() => map.resize())
    sizeObserver.observe(mapRef.current as Element)

    map.on("mouseover", () =>{
      map.getCanvas().style.cursor = "crosshair"
    })

    onClick && map.on("click",  onClick )

    return () => {
      console.log("removing observer")
      sizeObserver.disconnect()
    }
  },[map])

  useEffect(() => {
    if (mapRef.current) {
      let localMap = new mgl.Map({
        container: "my-map",
        ...restMapProps,
      });
      console.log({ localMap });
      localMap.getCanvas().style.width ="100%"
      localMap.setCenter([-73.9876, 40.7661]);
      setMap(localMap);
    }
  }, [mapRef]);




  return (
    <MapContext.Provider
      value={{
        map,
        setMarkers,
        markers,
      }}
    >
      {children}
      <div id="my-map" ref={mapRef} {...containerProps}></div>
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

export default MapContainer;
