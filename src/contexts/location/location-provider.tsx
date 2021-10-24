import {
  createContext,
  Dispatch,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useLocationValue from "../../hooks/useLocationValue";
import { ILocationMetaObj, ILocations } from "../../utils/types";

export type IWayPoint = ILocations["features"][0]


interface ILocationContext extends ReturnType<typeof useLocationValue> {
  allLocationsObj: ILocationMetaObj;
  setAllLocationsObj: Dispatch<ILocationMetaObj>;
  setLocations: any
}

export const LocationContext = createContext<ILocationContext>({} as ILocationContext);

const LocationProvider: FC<{}> = ({ children }) => {

  const [allLocationsObj, setAllLocationsObj] = useState<ILocationMetaObj>({});

  const [locations, setLocations] = useState<Array<IWayPoint>>([]);

  const [orderedLocations, setOrderedLocations] = useState<string[]>(() =>
    Object.keys(locations)
  );

  const addLocation = (feature: IWayPoint) => {
    setLocations(prev => [...prev, feature])
  };

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
   }, []);
 
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

  return (
    <LocationContext.Provider
      value={{
        locations,
        addLocation,
        updateLocation,
        orderedLocations,
        setOrderedLocations,
        allLocationsObj,
        setAllLocationsObj,
        removeUnselectedRoutes,
        getEmptySlotId,
        setLocations
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

export default LocationProvider;
