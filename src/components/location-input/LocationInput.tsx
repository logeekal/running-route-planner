import {
  ChangeEvent,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLProps,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { TiThMenu } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";

type ILocationInput = {} & RefAttributes<HTMLInputElement> &
  HTMLProps<HTMLInputElement>;

const LocationInput: ForwardRefExoticComponent<ILocationInput> = forwardRef(
  (props, ref) => {
    return (
      <div className="flex items-center justify-center">
        <TiThMenu />
        <input type="text" ref={ref} {...props} />
        <div className="px-4">
          <AiFillDelete />
        </div>
      </div>
    );
  }
);

export default LocationInput;
