export class Domain {
    public id: string
    public name: string
    public active: boolean
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        active: boolean,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.active = active
        this.created_at = created_at
        this.modified_at = modified_at
    }
}