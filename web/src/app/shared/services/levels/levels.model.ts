export class Level {
    public id: string
    public year: string
    public level: number
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        year: string,
        level: number,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.year = year
        this.level = level
        this.created_at = created_at
        this.modified_at = modified_at
    }
}