import { FC, HTMLProps, ReactNode, RefObject, useContext, useRef } from "react";
import { DragListContext } from "./DragList";

interface IDragListItem extends HTMLProps<HTMLLIElement> {
  dragIndicatorIcon?: ReactNode;
  removeIcon?: ReactNode;
  id: string;
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
    id,
    onRemove,
    ...restProps
  } = props;

  let itemRef = useRef() as RefObject<HTMLLIElement>;
  console.log({itemRef:  itemRef.current})
  return (
    <li
      className={`draggable 
      list__item
      ${
        status === "DRAGGING" && draggedElementId === itemRef
          ? "dragging text-gray-100"
          : "text-gray-200 "
      }
      bg-white
      flex
      flex-row
      ${className ? className : ""}
      `}
      draggable
      onDragStart={() => {
        setStatus("START");
        console.log({itemRefDrag : itemRef.current})
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
