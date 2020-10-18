export class TrainingApplication {
    public id: string
    public course_code: string
    public applicant_staff_id: string
    public department_coordinator: string
    public approved_by: string
    public status_type: string
    public comment: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        course_code: string,
        applicant_staff_id: string,
        department_coordinator: string,
        approved_by: string,
        status_type: string,
        comment: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.course_code = course_code
        this.applicant_staff_id = applicant_staff_id
        this.department_coordinator = department_coordinator
        this.approved_by = approved_by
        this.status_type = status_type
        this.comment = comment
        this.created_at = created_at
        this.updated_at = updated_at
    }
}