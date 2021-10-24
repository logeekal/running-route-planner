import { ILocations } from "../utils/types";

export default class MapBoxService {
  key = process.env.REACT_APP_MAPBOX_KEY;
  base_url = "https://api.mapbox.com";
  directions_url = `${this.base_url}/directions/v5`;
  constructor() {
    if (!this.key) {
      throw Error("Map key not found");
    }
  }

  async getLocations(locationText: string): Promise<ILocations> {
    let url = new URL(
      `${this.base_url}/geocoding/v5/mapbox.places/${locationText}.json`
    );
    url.search = `access_token=${this.key!}`;

    const response = await fetch(url.toString());

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async getLocationByCood(
    longitude: number,
    latitude: number
  ): Promise<{
    data?: ILocations ,
    error?: string
  }> {
    let url = new URL(
      `${this.base_url}/geocoding/v5/mapbox.places/${ longitude },${ latitude }.json`
    );

    url.search = `access_token=${this.key}`

    const response = await fetch(url.toString());

    if (response.ok) {

      return { data: await  response.json() as  unknown as ILocations };
    } else {
      return { error: await response.text() };
    }
  }

  async retrieveDirections(
    coordinates: Array<[number, number]>,
    profile: string = "mapbox/walking",
    steps: boolean = true,
    geometry: string = "geojson",
    walkway_bias: -1 | 1 = 1
  ) {
    const url = `${this.directions_url}/${profile}`;
    const stringCoordinates = coordinates.reduce<string>(
      (prev, current, index) => {
        let delimiter = ";";
        if (index === 0) {
          delimiter = "";
        }
        return prev + delimiter + current.join(",");
      },
      ""
    );

    let final_url = new URL(`${url}/${stringCoordinates}`);
    final_url.search = new URLSearchParams({
      steps: steps.toString(),
      geometries: geometry,
      walkway_bias: walkway_bias.toString(),
      access_token: this.key!
    }).toString();

    const response = await fetch(final_url.toString());

    if (response.ok) {
      return response.json();
    } else {
      return response.text();
    }
  }
}
