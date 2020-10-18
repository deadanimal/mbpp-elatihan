export class OrganisationType {
    public id: string
    public name: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        name: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.name = name
        this.created_at = created_at
        this.updated_at = updated_at
    }
}