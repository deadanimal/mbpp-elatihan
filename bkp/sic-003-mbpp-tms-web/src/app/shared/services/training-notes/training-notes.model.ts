export class TrainingNote {
    public id: string
    public course_code: string
    public title: string
    public note_code: string
    public note_file: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        course_code: string,
        title: string,
        note_code: string,
        note_file: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.course_code = course_code
        this.title = title
        this.note_code = note_code
        this.note_file = note_file
        this.created_at = created_at
        this.updated_at = updated_at
    }
}