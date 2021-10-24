import mgl, {
  Map,
  LngLatLike,
  LngLatBoundsLike,
  LngLatBounds,
  MapMouseEvent,
  EventData,
} from "mapbox-gl";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Layer from "../../components/map/Layer";
import MapContainer from "../../components/map/MapContainer";
import Stop from "../../components/map/Stop";
import Spinner from "../../components/spinner/Spinner";
import {
  LocationContext,
  useLocation,
} from "../../contexts/location/location-provider";
import MapBoxService from "../../services/MapboxService";

export interface IRouteMap {
  onRoute: (route: any) => void;
}

const RouteMap: FC<IRouteMap> = (props) => {
  const { onRoute } = props;
  const {
    locations,
    setLocations,
  } = useContext(LocationContext);


  const [ loading, setLoading ] = useState(false)

  const handleLocationSelectionFromMap = async (
    e: MapMouseEvent & EventData
  ) => {
    const mapBoxService = new MapBoxService();
    const response = await mapBoxService.getLocationByCood(
      e.lngLat.lng,
      e.lngLat.lat
    );
    if ("data" in response) {
      console.log({ "adding-location": locations });
      setLocations((prev: any) => [...prev, response.data!.features[0]]);
    }
  };

  const [primaryRoute, setPrimaryRoute] = useState<any>();

  useEffect(() => {
    if (locations.length > 1) {
      // draw route
      setLoading(true)
      debugger
      const mapBoxService = new MapBoxService();

      const coordinates = locations.map(
        (location) => location.geometry.coordinates
      );
      mapBoxService
        .retrieveDirections(coordinates as Array<[number, number]>)
        .then((json) => {
          const geojson = {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: json["routes"][0]["geometry"],
                },
              ],
            },
          };

          setPrimaryRoute(geojson);
          onRoute(json);
        });
      setLoading(false)
    }
    
  }, [locations]);

  return (
    <MapContainer
      style="mapbox://styles/mapbox/satellite-streets-v11"
      zoom={9}
      containerProps={{
        className: "w-full h-full",
      }}
      onClick={(e) => handleLocationSelectionFromMap(e)}
    >
      <Spinner loading={loading} />
      {primaryRoute ? (
        <Layer id="primaryRoute" type="line" source={primaryRoute} 
          paint={{
            "line-color": "#6478d7",
            "line-width": 8
          }}
          layout= {{
            "line-join": "round",
            "line-cap":  "round"
          }}
          
        />
      ) : (
        <></>
      )}

      {locations.map((location, idx) => {
        return (
          <div className={location.id} key={location.id}>
            <Stop
              feature={location}
              key={location.id}
              icon={
                <div
                  className="absolute w-8 h-8 p-1 border-4 rounded-full border-accent text-primary bg-primary grid place-items-center"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {idx + 1}
                </div>
              }
            />
          </div>
        );
      })}
    </MapContainer>
  );
};

export default RouteMap;
