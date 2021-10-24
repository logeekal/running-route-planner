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
import {
  LocationContext,
  useLocation,
} from "../../contexts/location/location-provider";
import MapBoxService from "../../services/MapboxService";

export interface IRouteMap {
  onRoute: ( route: any ) => void
}

const RouteMap: FC<IRouteMap> = (props) => {

  const { onRoute } = props;
  const {
    locations,
    addLocation,
    orderedLocations,
    allLocationsObj,
    setAllLocationsObj,
    getEmptySlotId,
    updateLocation,
    setLocations,
  } = useContext(LocationContext);

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
          }
          
          setPrimaryRoute(geojson);
          onRoute(json)
        });
    }
  }, [locations]);

  return (
    <MapContainer
      style="mapbox://styles/mapbox/streets-v11"
      zoom={9}
      containerProps={{
        className: "w-full h-full",
      }}
      onClick={(e) => handleLocationSelectionFromMap(e)}
    >
      {primaryRoute ? (
        <Layer id="primaryRoute" type="line" source={primaryRoute} />
      ) : (
        <></>
      )}

      {locations.map((location, idx) => {
        return (
          <Stop
            feature={location}
            key={location.id}
            icon={
              <div className="absolute w-8 h-8 p-1 text-white bg-black rounded-full grid place-items-center" style={{
              transform :"translate(-50%, -50%)"
                }}>
                {idx + 1}
              </div>
            }
          />
        );
      })}
    </MapContainer>
  );
};

export default RouteMap;
