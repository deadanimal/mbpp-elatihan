export class Configuration {
    public id: string
    public name: string
    public slug: string
    public value: number
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        slug: string,
        value: number,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.slug = slug
        this.value = value
        this.created_at = created_at
        this.modified_at = modified_at
    }
}