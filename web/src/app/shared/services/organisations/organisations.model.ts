export class Organisation {
    public id: string
    public name: string
    public shortname: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        shortname: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.shortname = shortname
        this.created_at = created_at
        this.modified_at = modified_at
    }
}