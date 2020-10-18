export class Exam {
    public id: string
    public title: string
    public staff: string
    public code: string
    public date: string
    public document_copy: string
    public result: string
    public created_at: string
    public updated_at: string
    
    constructor(
        id: string,
        title: string,
        staff: string,
        code: string,
        date: string,
        document_copy: string,
        result: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.title = title
        this.staff = staff
        this.code = code
        this.date = date
        this.document_copy = document_copy
        this.result = result
        this.created_at = created_at
        this.updated_at = updated_at
    }
}