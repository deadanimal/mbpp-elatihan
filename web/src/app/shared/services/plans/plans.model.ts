export class Plan {
    public id: string
    public q1: number
    public q2: number
    public q3: number
    public q4: number
    public year: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        q1: number,
        q2: number,
        q3: number,
        q4: number,
        year: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.q1 = q1
        this.q2 = q2
        this.q3 = q3
        this.q4 = q4
        this.year = year
        this.created_at = created_at
        this.modified_at = modified_at
    }
}