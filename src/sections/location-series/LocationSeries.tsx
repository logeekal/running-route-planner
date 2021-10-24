import { useState } from "react";
import { reOrderArray } from "../../utils";
import "./LocationSeries.scss"

import { useLocation } from "../../contexts/location/LocationProvider";
import DragList from "../../components/drag-list/DragList";
import DragListItem from "../../components/drag-list/DragListItem";

import { MdDelete } from "react-icons/md";
import { ImMenu2 } from "react-icons/im";

interface ILocationSeriesProps {
  onFindRoute: (coordinates: Array<[number, number]>) => void;
}

const LocationSeries: React.FC<ILocationSeriesProps> = (props) => {
  const {
    locations,
    setLocations,
  } = useLocation();

  const [draggedElementId, setDraggedElementId] = useState<string>()

  const handleRemoval = (removedId: string) => {
    setLocations((prev: any) => {
      const newLocations = prev.filter(
        (location: any) => location.id !== removedId
      );
      return newLocations;
    });
  };

  const handleRorder = (oldIdx: number, newIdx: number) => {
    console.log({
      oldIdx,
      newIdx,
    });

    setLocations((prev: any) => {
      const newItems = reOrderArray(oldIdx, newIdx, prev);
      return [...newItems];
    });
  };

  return (
    <div className="flex flex-col">
      <DragList className="flex flex-col location__list gap-2" onReorder={handleRorder} removable={false}>
        {locations.map((currLocation) => (
          <DragListItem
            className="location__item"
            id={currLocation.id}
            onRemove={() => handleRemoval(currLocation.id)}
            onDragStatusUpdate ={ (status) => {
              if (status === "DRAGGING") {
                setDraggedElementId(currLocation.id)
              }else {
                setDraggedElementId(undefined)
              }
            } }
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-row items-center justify-center">
                <span className="px-2 mt-1 cursor-move">
                  <ImMenu2 />
                </span>
                <p className="cursor-text">{currLocation.text} </p>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-2 mt-1" onClick={() => handleRemoval(currLocation.id)}>
                  <MdDelete />
                </span>
              </div>
            </div>
          </DragListItem>
        ))}
      </DragList>
    </div>
  );
};

export default LocationSeries;
