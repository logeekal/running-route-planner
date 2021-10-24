import mgl, { LngLatLike,  Marker } from "mapbox-gl";
import {
  FC,
  HTMLProps,
  useEffect,
  useRef,
  useState,
  ReactNode,
  RefObject,
} from "react";
import { useMap } from "../../components/map/MapContainer";

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
      if (!markerValRef.current) return;
      const elementId = markerValRef.current.getElement().id
      const element = document.getElementById(elementId)
      element?.remove()

      setMarkers((prev: Array<mgl.Marker>) => {
        let newMarkers = prev.filter(
          (item) => item.getElement().id !== markerValRef.current!.getElement().id
        );
        return newMarkers;
      });
    };
  }, []);


  useEffect(() => {
    if (!icon) return;

    let currMarker = new mgl.Marker(markerRef.current || undefined).setLngLat(
      feature.geometry.coordinates as LngLatLike
    );
    markerRef.current!.id = feature.id 
    setMarker(currMarker);
  }, [icon]);

  useEffect(() => {
    if (marker) {
      setMarkers((prev: Array<mgl.Marker>) => {
        const markerExists = prev.findIndex(
          (item) => item.getElement().id === markerRef.current!.id
        );
        if (markerExists !== -1) {
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
