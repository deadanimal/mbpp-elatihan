export class ExamResult {
    public id: string
    public exam_code: string
    public staff_id: string
    public result: string
    public created_at: string

    constructor(
        id: string,
        exam_code: string,
        staff_id: string,
        result: string,
        created_at: string
    ){
        this.id = id
        this.exam_code = exam_code
        this.staff_id = staff_id
        this.result = result
        this.created_at = created_at
    }
}