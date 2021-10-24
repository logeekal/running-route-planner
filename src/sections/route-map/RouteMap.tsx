import { MapMouseEvent, EventData } from "mapbox-gl";
import { FC, useEffect, useState } from "react";
import Layer from "../../components/map/Layer";
import MapContainer from "../../components/map/MapContainer";
import Stop from "../../components/map/Stop";
import Spinner from "../../components/spinner/Spinner";
import { useLocation } from "../../contexts/location/LocationProvider";
import MapBoxService from "../../services/MapboxService";
// @ts-ignore @eslint-disable
import {
  NotificationContainer,
  NotificationManager,
// @ts-ignore @eslint-disable
} from "react-notifications";

export interface IRouteMap {
  onRoute: (route: any) => void;
}

const RouteMap: FC<IRouteMap> = (props) => {
  const { onRoute } = props;
  const { locations, setLocations } = useLocation();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  const [loading, setLoading] = useState(false);

  const handleLocationSelectionFromMap = async (
    e: MapMouseEvent & EventData
  ) => {
    const mapBoxService = new MapBoxService();
    const response = await mapBoxService.getLocationByCood(
      e.lngLat.lng,
      e.lngLat.lat
    );
    if ("data" in response) {
      if (
        response.data &&
        "features" in response.data &&
        response.data.features.length > 0
      ) {
        setLocations((prev: any) => [...prev, response.data!.features[0]]);
      } else {
        NotificationManager.error(
          "Some Error Occured in retreiving the location. Please try some other location"
        );
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position && "coords" in position) {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      }, (err) => {
        NotificationManager.error(err.message + "Please navigate manually or allow location")
      });
    } else {
      NotificationManager.error(
        "Cannot fetch your location. Redirecting to a default location"
      );
    }
  }, []);

  const [primaryRoute, setPrimaryRoute] = useState<any>();

  useEffect(() => {
    if (locations.length > 1) {
      // draw route
      setLoading(true);
      debugger;
      const mapBoxService = new MapBoxService();

      const coordinates = locations.map(
        (location: any) => location.geometry.coordinates
      );
      mapBoxService
        .retrieveDirections(coordinates as Array<[number, number]>)
        .then((json) => {
          if (!("routes" in json)) {
            NotificationManager.error(
              "Some Error Occured in retreiving the route. Please try later."
            );
          }
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
        })
        .catch((_) => {
          NotificationManager.error(
            "Some Error Occured in retreiving the route. Please try later."
          );
        });
      setLoading(false);
    }
  }, [locations]);

  return (
    <MapContainer
      style="mapbox://styles/mapbox/satellite-streets-v11"
      zoom={9}
      center={userLocation ? [userLocation.lng, userLocation.lat] : undefined}
      containerProps={{
        className: "w-full h-full",
      }}
      onClick={(e: any) => handleLocationSelectionFromMap(e)}
    >
      <NotificationContainer />
      <Spinner loading={loading} />
      {primaryRoute ? (
        <Layer
          id="primaryRoute"
          type="line"
          source={primaryRoute}
          paint={{
            "line-color": "#6478d7",
            "line-width": 8,
          }}
          layout={{
            "line-join": "round",
            "line-cap": "round",
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
