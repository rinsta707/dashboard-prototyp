import {Translation} from "./translation";
import {ProvisioningOptionRestriction} from "./provisioning-option-restriction";

export interface ProvisioningOption {

    id: number | null;
    key: string;
    type: string;
    selected: boolean;
    name: string,
    description: string,
    names: Translation[],
    descriptions: Translation[]
    restrictions: ProvisioningOptionRestriction[]

}
