import { FC, useEffect, useRef } from "react";
import { Layer as LayerType } from "mapbox-gl";
import { useMap } from "./MapContainer";

const Layer: FC<LayerType> = (props) => {
  const { id, type, source, ...restProps } = props;

  const layerIDRef = useRef<string>();
  layerIDRef.current = id;

  const { map } = useMap();

  useEffect(() => {
    return () => {
      if (!map || !layerIDRef.current) return;
      map.getLayer(layerIDRef.current) && map.removeLayer(layerIDRef.current);
      map.removeSource(layerIDRef.current);
      //remove if layer exists
    };
  }, []);

  useEffect(() => {
    console.log({ source, map });
    if (!map) return;
    if (!source) return;

    // create source if it does not exists
    if (map.getSource(id)) {
      let localSource = map?.getSource(id) as any;
      localSource && localSource.setData((source as any).data);
    } else {
      map.addSource(id, source as any);
    }

    if (!map.getLayer(id)) {
      map.addLayer({
        id,
        type: type as any,
        source: id,
        ...restProps as any
      });
    }
  }, [source, map, restProps, id , type]);

  return <span></span>;
};

export default Layer;
