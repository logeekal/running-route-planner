import { forwardRef, HTMLProps, useState } from "react";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import "./SideNav.scss";

const SideNav = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { children, className, ...restProps } = props;

    const [collapsed, setCollapsed] = useState(false);

    return (
      <aside
        className={`relative sidenav__container bg-primary ${
          className ? className : ""
        }
        ${collapsed ? "collapsed" : ""}
        `}
        ref={ref}
        {...restProps}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute right-0 z-10 w-8 h-8 cursor-pointer sidenav__switch top-20 bg-accent md:hidden"
            style={{
              transform: " translateX(100%)",
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <BiChevronsRight className="w-full h-full" />
            ) : (
              <BiChevronsLeft className="w-full h-full" />
            )}
          </div>
          <div className="w-full h-full sidenav__content">{children}</div>
        </div>
      </aside>
    );
  }
);

export default SideNav;
