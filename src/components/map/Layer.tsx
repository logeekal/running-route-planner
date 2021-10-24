import { FC, useEffect, useRef } from "react";
import mgl, { AnySourceData, Layer as LayerType } from "mapbox-gl";
import { useMap } from "./MapContainer";

{
  /*
   *{
   *
   *  id: string,
   *  type: "fill"| "line"| "symbol"| "circle"| "heatmap"| "fill-extrusion"| "raster"| "hillshade"| "background"| "sky";
   *  source: mgl.GeoJSONSource,
   *  layout: mgl.la
   *
   */
}
const Layer: FC<LayerType> = (props) => {
  const { id, type, source } = props;

  const layerIDRef = useRef<string>();
  layerIDRef.current = id;

  const { map } = useMap();

  useEffect(() => {
    return () => {
      if (!map || !layerIDRef.current) return;
      map.removeSource(layerIDRef.current);
      //remove if layer exists
      map.getLayer(layerIDRef.current) && map.removeLayer(layerIDRef.current);
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
        /*
         *layout,
         *paint: paint as any
         */
      });
    }
  }, [source]);

  return <span></span>;
};

export default Layer;
