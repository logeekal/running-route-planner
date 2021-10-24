import { FC, HTMLProps, ReactNode, useContext, useRef } from "react";
import { DragListContext } from "./DragList";

interface IDragListItem extends HTMLProps<HTMLLIElement> {
  dragIndicatorIcon?: ReactNode;
  removeIcon?: ReactNode;
  onRemove: () => void;
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
    onRemove,
    ...restProps
  } = props;

  let itemRef = useRef(null);
  return (
    <li
      className={`draggable 
      ${
        status === "DRAGGING" && draggedElementId === itemRef
          ? "dragging text-gray-100"
          : "text-black "
      }
      px-4
      py-2
      my-2
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
