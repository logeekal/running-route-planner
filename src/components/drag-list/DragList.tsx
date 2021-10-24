import {
  createContext,
  useState,
  HTMLProps,
  useEffect,
  Ref,
  useRef,
  isValidElement,
  cloneElement,
} from "react";

interface IDragListContext {
  status: "IDLE" | "DRAGGING" | "START" | "END";
  listLength: number;
  draggedElementId: any;
  removable: boolean
  childrenRefs: Ref<HTMLLIElement>[];
  [k: string]: any;
}

export const DragListContext = createContext({} as IDragListContext);

export type IDragList = HTMLProps<HTMLUListElement> & {
  onReorder: (oldIdx: number, newIdx: number) => void;
  /**
   * Are items in the list removable
   */ 
  removable?: boolean
};

export default function DragList(props: IDragList) {
  const { className, children, onReorder, removable, ...restProps } = props;
  
  const [status, setStatus] = useState<IDragListContext["status"]>("IDLE");
  const [draggedElementId, setDraggedElementId] = useState<any>();
  const [childrenRefs, setChildrenRefs] = useState([]);
  const [orderedChildren, setOrderedChildren] = useState<any>([]);
  const [dragElementInitialIndex, setDragElementInitialIndex] = useState<number| undefined>();
  const [dragElementFinalIndex, setDragElementFinalIndex] = useState<number| undefined>()
  const [removableState, setRemovableState] = useState(removable || false)


  useEffect(() => {
    setRemovableState(removable ||  false)
  },[removable])


  useEffect(() => {}, [status]);

  const parentRef: Ref<HTMLUListElement> = useRef(null);
  
  useEffect(() => {
    if (!parentRef || !parentRef.current) return;
    if (!draggedElementId) {
      setDragElementInitialIndex(undefined);
    }
    else {
     const initialIndex = Array.from(parentRef.current.children).indexOf(draggedElementId.current)
     setDragElementInitialIndex(initialIndex)
    }
  }, [draggedElementId]);

  useEffect(() => {
    if (!children) return;

    if (props.children instanceof Array) {
      const result = props.children.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...child.props,
          });
        } else {
          throw new Error("Not a valid element");
        }
      });

      setOrderedChildren(result);
    }
  }, [children]);

  const findNearest = (dragTargetYPosition: number, draggedEl: Element) => {
    const children = (parentRef.current as HTMLUListElement).children;

    if (!children) return;
    return Array.from(children)
      .filter((current) => current != draggedEl)
      .reduce<{
        offset: number;
        el: Element;
        index: number | undefined
      }>(
        (closest, current: Element, index) => {
          const { y, height } = current.getBoundingClientRect();
          const offset = dragTargetYPosition - y - height / 2;
          if (offset < 0) {
            if (offset > closest.offset) {
              return {
                offset,
                el: current,
                index: index
              };
            } else {
              return closest;
            }
          } else {
            return closest;
          }
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          el: (null as unknown) as Element,
          index: dragElementInitialIndex
        }
      );
  };

  return (
    <DragListContext.Provider
      value={{
        status,
        listLength: 1,
        setStatus,
        draggedElementId,
        setDraggedElementId,
        childrenRefs,
        setChildrenRefs,
        removable: removableState
      }}
    >
      <ul
        className="px-4 py-4 list-none draggable-list-container"
        {...restProps}
        onDragOver={(e) => {
          e.preventDefault();
          const nearestNode = findNearest(e.clientY, draggedElementId.current);
          if (!nearestNode) return;
          if (nearestNode.offset == Number.NEGATIVE_INFINITY) {
            parentRef?.current?.appendChild(draggedElementId.current);
            setDragElementFinalIndex(orderedChildren.length - 1)
            return;
          }
          console.log(nearestNode.el.innerHTML);
          parentRef?.current?.insertBefore(
            draggedElementId.current,
            nearestNode.el
          );

          setDragElementFinalIndex(nearestNode.index)
          return;
        }}

        onDrop={(e) => {
          e.preventDefault()
          const nearestNode = findNearest(e.clientY, draggedElementId.current);
          if (!nearestNode) return;
          const newIdx = nearestNode.index || dragElementInitialIndex;
          onReorder(dragElementInitialIndex ||0, dragElementFinalIndex || 0)
        }}
        ref={parentRef}
      >
        {children}
      </ul>
    </DragListContext.Provider>
  );
}
