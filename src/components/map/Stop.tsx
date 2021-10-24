import mgl, { LngLatLike, Map, MapboxGeoJSONFeature, Marker } from "mapbox-gl";
import {
  FC,
  HTMLProps,
  ReactElement,
  memo,
  useEffect,
  useRef,
  useState,
  ReactNode,
  RefObject,
} from "react";
import { useMap } from "../../components/map/MapContainer";

import ReactDOMServer from "react-dom/server";
import { ILocations } from "../../utils/types";

type IStop = HTMLProps<HTMLDivElement> & {
  feature: ILocations["features"][0];
  icon: ReactNode;
};

const Stop: FC<IStop> = (props) => {
  const { feature, children, icon, ...restProps } = props;

  const { map, markers, setMarkers } = useMap();

  const [marker, setMarker] = useState<mgl.Marker>();

  const markerRef = useRef() as RefObject<HTMLDivElement>;

  const markerValRef = useRef<Marker>();
  markerValRef.current = marker;

  useEffect(() => {
    return () => {
      console.log("cleaning up ", markerRef);
      if (!markerValRef.current) return;
      console.log("Removing marker", markerRef.current);
      const elementId = markerValRef.current.getElement().id
      const element = document.getElementById(elementId)
      element?.remove()

      setMarkers((prev: Array<mgl.Marker>) => {
        let newMarkers = prev.filter(
          (item) => item.getElement().id !== markerValRef.current!.getElement().id
        );
        console.log({
          prevMarker: prev.length,
          newMarker: newMarkers.length,
        });
        return newMarkers;
      });
    };
  }, []);

  console.log({ markers });

  useEffect(() => {
    if (!icon) return;

    let currMarker = new mgl.Marker(markerRef.current || undefined).setLngLat(
      feature.geometry.coordinates as LngLatLike
    );
    markerRef.current!.id = feature.id 
    setMarker(currMarker);
  }, [icon]);

  useEffect(() => {
    console.log({ marker });
    if (marker) {
      setMarkers((prev: Array<mgl.Marker>) => {
        const markerExists = prev.findIndex(
          (item) => item.getElement().id === markerRef.current!.id
        );
        if (markerExists !== -1) {
          console.log(markerExists);
          return [...prev];
        } else {
          marker.addTo(map!);
          return [...prev, marker];
        }
      });
    }
  }, [marker]);

  return (
    <div id={feature.id} {...restProps} ref={markerRef}>
      {icon}
    </div>
  );
};

export default Stop;
