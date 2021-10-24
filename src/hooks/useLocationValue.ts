import {GeoJsonProperties, Geometry, Point} from "geojson";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { ILocationOptionObject, ILocations } from "../utils/types";


type IWayPoint = ILocations["features"][0]

export type IUseLocationValue = {
  locations: Array<IWayPoint>;
  addLocation: (value: IWayPoint) => void;
  updateLocation: (id: string, newValue: string, selected: boolean) => void;
  orderedLocations: string[];
  setOrderedLocations: any;
  removeUnselectedRoutes: () => void;
  getEmptySlotId: () => string | undefined;
};

export default function useLocationValue(): IUseLocationValue {
  const [locations, setLocations] = useState<Array<IWayPoint>>([]);

  const [orderedLocations, setOrderedLocations] = useState<string[]>(() =>
    Object.keys(locations)
  );

  const addLocation = useCallback((location: IWayPoint) => {
    setLocations([...locations, location])
  }, [locations]);

   const getEmptySlotId = useCallback(() => {
     return "";
/*
 *    const emptySlotId = orderedLocations.find(
 *      (orderedLocationId) => locations[orderedLocationId].selected === false
 *    );
 *    if (emptySlotId) {
 *      console.log("found empty slot", JSON.stringify(locations));
 *      return emptySlotId;
 *    }
 *    let newEmptySlot = genNewLocation();
 *    setLocations({
 *      ...locations,
 *      [newEmptySlot.id]: {
 *        id: newEmptySlot.id,
 *        value: "",
 *        selected: false,
 *      },
 *    });
 *    return newEmptySlot.id;
 */
   }, [locations, orderedLocations]);
 
  const updateLocation = (id: string, value: string, selected: boolean) => {
    return;
/*
 *    setLocations((prev) => (
 *      ...prev,
 *      [id]: {
 *        ...prev[id],
 *        value: value,
 *        selected,
 *      },
 *    }));
 *
 *    if (!orderedLocations.includes(id)) {
 *      setOrderedLocations([...orderedLocations, id]);
 *    }
 */
  };

  const removeUnselectedRoutes = () => {
    return;
/*
 *    const resultLocationObj: ILocationOptionObject = {};
 *    for (let id in locations) {
 *      if (locations[id].selected) {
 *        resultLocationObj[id] = locations[id];
 *      }
 *    }
 *
 *    setOrderedLocations(
 *      orderedLocations.filter(
 *        (location) => locations[location].selected != false
 *      )
 *    );
 */
  };

  return {
    locations,
    addLocation,
    updateLocation,
    getEmptySlotId,
    orderedLocations,
    setOrderedLocations,
    removeUnselectedRoutes,
  };
}
