import {
  createContext,
  FC,
  useContext,
  useState,
} from "react";
import { ILocations } from "../../utils/types";

export type IWayPoint = ILocations["features"][0]


interface ILocationContext {
    locations: Array<IWayPoint>;
    addLocation: (feature: IWayPoint) => void;
    setLocations: any
}

export const LocationContext = createContext<ILocationContext>({} as ILocationContext);

const LocationProvider: FC<{}> = ({ children }) => {


  const [locations, setLocations] = useState<Array<IWayPoint>>([]);


  const addLocation = (feature: IWayPoint) => {
    setLocations(prev => [...prev, feature])
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        addLocation,
        setLocations
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

export default LocationProvider;
