import {locations} from "../tests/data/location_search_result";
import { route } from '../tests/data/route';

export type ILocations = typeof locations;

export interface ILocationOption {
  id: string;
  feature: GeoJSON.Feature
}

export type ILocationOptionObject = Record<string, ILocationOption>

export type ILocationMetaObj = Record<string, ILocations["features"][0]>

export type IRoute = typeof route
