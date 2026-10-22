export class UnitDto {
    uuid: string = "";
    name: string = "";

    constructor(unit: Partial<UnitDto> = {}){
        Object.assign(this, unit);
    }
}