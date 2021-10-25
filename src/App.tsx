import { RefObject, useEffect, useRef, useState } from "react";
import LocationSeries from "./sections/location-series/LocationSeries";
import LocationProvider from "./contexts/location/LocationProvider";
import RouteMap from "./sections/route-map/RouteMap";
import geoJson2GPX from "./utils/geojson2gpx";
import SideNav from "./components/layout/SideNav";
import { MdModeEdit } from "react-icons/md";
// @ts-ignore
import { NotificationManager, NotificationContainer } from 'react-notifications'

export default function App() {
  const [navigableRoute, setNavigableRoute] = useState<any>();

  const [routeName, setRouteName] = useState("My Route");

  const [mode, setMode] = useState<"EDIT" | "READ">("READ");

  const inputRef = useRef(null) as RefObject<HTMLInputElement>;

  const handleGPXDownload = () => {
    if (!navigableRoute) {
      NotificationManager.error("No Route Available to download. Please select at least 2 locations.")
      return;
    }

    const gpxString = geoJson2GPX(navigableRoute);
    downloadStringAsFile(gpxString, "application/xml", routeName.replaceAll(" ", "_") + ".gpx");
  };

  const downloadStringAsFile = (
    content: string,
    mimetype: string,
    name: string
  ) => {
    const file = new Blob([content], { type: mimetype });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEditRoute = () => {
    setMode("EDIT");
  };

  const handleSaveRouteName = (e: any) => {
    e.preventDefault();
    setMode("READ");
  };

  useEffect(()=>{ 
    document.title = `Welcome to JK Route Planner - ${routeName}`
  },[routeName])
  return (
    <LocationProvider>
      <div className="flex flex-row h-screen theme-normal bg-primary text-primary">
        <NotificationContainer />
        <SideNav className="flex flex-col px-4 py-8 flex-grow-1">
          <div className="flex flex-col items-center justify-between h-full py-8 sidemenu__container">
            <div className="flex flex-col w-full sidemenu__location-info">
              <div className="flex flex-row items-center justify-between float-left px-2 sidemenu__heading">
                {mode === "READ" ? (
                  <>
                    <h1 className="text-2xl font-bold" tabIndex={1}>
                      {routeName}
                    </h1>
                    <span
                      className="px-2"
                      onClick={handleEditRoute}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") handleEditRoute();
                      }}
                      tabIndex={2}
                    >
                      <MdModeEdit />
                    </span>
                  </>
                ) : (
                  <form
                    className="flex flex-row items-center justify-between"
                    onSubmit={(e) => handleSaveRouteName(e)}
                  >
                    <input
                      className="w-5/6 text-2xl font-bold border-2 bg-primary"
                      type="text"
                      value={routeName}
                      ref={inputRef}
                      name="routeName"
                      onChange={(e) => setRouteName(e.target.value)}
                      required={true}
                      autoFocus={true}
                    />
                    <input className="bg-primary " type="submit" value="💾" />
                  </form>
                )}
              </div>
              <hr className="h-2 mt-2 mb-4" />
              <div className="sidemenu__location">
                <LocationSeries onFindRoute={() => {}} />
              </div>
            </div>
            <button
              className="w-5/6 py-2 font-bold btn__download-route bg-accent rounded-normal text-inverse "
              type="button"
              onClick={handleGPXDownload}
            >
              Save Route as GPX
            </button>
          </div>
        </SideNav>
        <main className="w-full h-full flex-grow-9">
          <RouteMap onRoute={(geojson) => setNavigableRoute(geojson)} />
        </main>
      </div>
    </LocationProvider>
  );
}
