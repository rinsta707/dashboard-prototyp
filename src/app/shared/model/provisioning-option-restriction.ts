import {Translation} from "./translation";

export interface ProvisioningOptionRestriction {
  id: number,
  value: string,
  translations: Translation[],
  translation: string
}
