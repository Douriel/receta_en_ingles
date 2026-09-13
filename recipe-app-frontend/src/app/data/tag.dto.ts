export class TagDto {
    uuid: string = "";
    name: string = "";

    constructor(tag: Partial<TagDto> = {}){
        Object.assign(this, tag);
    }
}