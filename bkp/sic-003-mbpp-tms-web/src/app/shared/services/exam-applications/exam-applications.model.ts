export class ExamApplication {
    public id: string
    public exam_code: string
    public applicant_staff_id: string
    public current_position_appoint_date: string
    public current_position_promotion_date: string
    public current_appoint_type: string
    public status_type: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        exam_code: string,
        applicant_staff_id: string,
        current_position_appoint_date: string,
        current_position_promotion_date: string,
        current_appoint_type: string,
        status_type: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.exam_code = exam_code
        this.applicant_staff_id = applicant_staff_id
        this.current_position_appoint_date = current_position_appoint_date
        this.current_position_promotion_date = current_position_promotion_date
        this.current_appoint_type = current_appoint_type
        this.status_type = status_type
        this.created_at = created_at
        this.updated_at = updated_at
    }
}