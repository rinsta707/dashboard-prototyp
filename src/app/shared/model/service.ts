import {Translation} from "./translation";

export interface Service {

  id: number | null,
  key: string,
  active: boolean,
  client: string,
  name: string,
  selected: boolean,
  translations: Translation[]

}
