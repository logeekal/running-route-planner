import { FC, HTMLProps, ReactNode, RefObject, useContext, useEffect, useRef } from "react";
import { DragListContext } from "./DragList";

interface IDragListItem extends HTMLProps<HTMLLIElement> {
  dragIndicatorIcon?: ReactNode;
  removeIcon?: ReactNode;
  id: string;
  onRemove: () => void;
  onDragStatusUpdate?: (status: string) => void
}

const DragListItem: FC<IDragListItem> = (props) => {
  const {
    status,
    setStatus,
    setDraggedElementId,
    draggedElementId,
    removable,
  } = useContext(DragListContext);

  const {
    key,
    className,
    dragIndicatorIcon,
    removeIcon,
    id,
    onRemove,
    onDragStatusUpdate,
    ...restProps
  } = props;

  useEffect(() =>{
    onDragStatusUpdate && onDragStatusUpdate(status)
  },[status])

  let itemRef = useRef() as RefObject<HTMLLIElement>;
  return (
    <li
      className={`draggable 
      list__item
      ${
        status === "DRAGGING" && draggedElementId === itemRef
          ? "dragging "
          : ""
      }
      bg-white
      flex
      flex-row
      ${className ? className : ""}
      `}
      draggable
      onDragStart={() => {
        setStatus("START");
        setDraggedElementId(itemRef)
      }}
      onDrag={() => {
        setStatus("DRAGGING");

      }}
      onDragEnd={() => {
        setStatus("END");
        setDraggedElementId(null);
      }}
      key={id}
      ref={itemRef}
      {...restProps}
    >
      {dragIndicatorIcon ? dragIndicatorIcon : null}
      {props.children}
      <div
        className="cursor-pointer item__control-remove "
        onClick={() => onRemove()}
      >
        {removable ? removeIcon || "x" : null}
      </div>
    </li>
  );
};

export default DragListItem;
