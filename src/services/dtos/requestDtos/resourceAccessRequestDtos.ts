import type { ResourceAccessMode } from "../enums";

declare global {
    namespace RequestDtos {
        type ResourceAccess = {
            type: string;
            primaryId: number;
            secondaryId: number | null;
            mode: ResourceAccessMode;
        }
    }
}

export { };