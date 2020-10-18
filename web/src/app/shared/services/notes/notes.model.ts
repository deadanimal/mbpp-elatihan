export class Note {
    public id: string
    public training: string
    public title: string
    public note_code: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        title: string,
        note_code: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.title = title
        this.note_code = note_code
        this.created_at = created_at
        this.modified_at = modified_at
    }
}