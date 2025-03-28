export class Core {
    public id: string
    public parent: string
    public child: string
    public active: boolean
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        parent: string,
        child: string,
        active: boolean,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.parent = parent
        this.child = child
        this.active = active
        this.created_at = created_at
        this.modified_at = modified_at
    }
}