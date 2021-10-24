import { ChangeEvent, useCallback, useEffect, useState } from "react";
import MapBoxService from "../../services/MapboxService";
import { debounce } from "../../utils/debounce";

import { debounce as asyncDebounce } from "lodash";
import { useLocation } from "../../contexts/location/location-provider";
import DragList from "../../components/drag-list/DragList";
import DragListItem from "../../components/drag-list/DragListItem";

interface ILocationSeriesProps {
  onFindRoute: (coordinates: Array<[number, number]>) => void;
}

const LocationSeries: React.FC<ILocationSeriesProps> = (props) => {
  const {
    locations,
    setLocations,
    addLocation,
    updateLocation,
    orderedLocations,
    setOrderedLocations,
    allLocationsObj: allLocations,
    setAllLocationsObj: setAllLocations,
    removeUnselectedRoutes,
  } = useLocation();

  const [mapboxService, setMapboxService] = useState(() => new MapBoxService());

  const [locationOptions, setLocationOptions] = useState<any[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handleLocationSearch = useCallback(
    async (value: string) => {
      console.log("searching locations");
      const locations = await mapboxService.getLocations(value);
      let localLocationOptions = locations.features.map((feature: any) => {
        return {
          id: feature.id,
          name: feature.place_name,
          details: feature,
        };
      });

      setLocationOptions([...localLocationOptions]);
    },
    [mapboxService]
  );

  const debouncedSearch = useCallback(
    asyncDebounce(handleLocationSearch, 500),
    [handleLocationSearch]
  );

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    locationId: string
  ) => {
    console.log("handling change", e.target.value);
    updateLocation(locationId, e.target.value, false);
    if (e.target.value.length === 0) return;
    debouncedSearch(e.target.value);
  };

  const handleRemoval = (removedId: string) => {
    setLocations((prev: any) => {
      const newLocations = prev.filter((location: any) => location.id !== removedId);
      return newLocations;
    });
  };

  const handleRorder = (oldIdx: number, newIdx: number) => {
    console.log({
      oldIdx,
      newIdx,
    });

    setLocations((prev: any) => {
      let counter = oldIdx;
      let newItems = [...prev];
      const temp = newItems[oldIdx];
      while (counter != newIdx) {
        console.log({ counter });
        if (oldIdx < newIdx) {
          newItems[counter] = newItems[counter + 1];
          counter++;
        }
        if (oldIdx > newIdx) {
          newItems[counter] = newItems[counter - 1];
          counter--;
        }
        newItems[counter] = temp;
      }
      console.log({ newItems });
      return [...newItems];
    });
  };

  function handleSelect(locationId: string, orderedLocationId: string) {
    const selectedLocation = locationOptions.find(
      (location) => location.id === locationId
    );
    setAllLocations({
      ...allLocations,
      [orderedLocationId]: selectedLocation.details,
    });
    updateLocation(orderedLocationId, selectedLocation["name"], true);
  }

  return (
    <div className="flex flex-col">
      <DragList onReorder={handleRorder} removable={true}>
        {locations.map((currLocation) => (
          <DragListItem
            key={currLocation.id}
            removeIcon={<p className="p-5 icon text-red-50"> X </p>}
            onRemove={() => handleRemoval(currLocation.id)}
          >
            <p>{currLocation.text} </p>
          </DragListItem>
        ))}
      </DragList>
      <button className="bg-yellow" type="button">
        Add
      </button>
    </div>
  );
};

export default LocationSeries;
