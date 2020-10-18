export class ExamAttendance {
    public id: string
    public exam_code: string
    public attendee: string
    public check_in: string
    public check_out: string
    public verified_by: string

    constructor(
        id: string,
        exam_code: string,
        attendee: string,
        check_in: string,
        check_out: string,
        verified_by: string
    ){
        this.id = id
        this.exam_code = exam_code
        this.attendee = attendee
        this.check_in = check_in
        this.check_out = check_out
        this.verified_by = verified_by
    }
}