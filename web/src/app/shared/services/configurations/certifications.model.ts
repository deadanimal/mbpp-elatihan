export class Certification {
    public id: string
    public name: string
    public value: number
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        value: number,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.value = value
        this.created_at = created_at
        this.modified_at = modified_at
    }
}