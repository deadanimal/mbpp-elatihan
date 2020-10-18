export class TrainingAbsence {
    public id: string
    public staff_id: string
    public course_code: string
    public reason: string
    public approved_by: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        staff_id: string,
        course_code: string,
        reason: string,
        approved_by: string,
        created_at: string,
        updated_at: string
    ){
        this.id =id
        this.staff_id = staff_id
        this.course_code = course_code
        this.reason = reason
        this.approved_by = approved_by
        this.created_at = created_at
        this.updated_at = updated_at
    }
}