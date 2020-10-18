export class TrainingAttendance {
    public id: string
    public check_in: string
    public check_out: string
    public training: string
    public attendee: string
    public verified_by: string

    constructor(
        id: string,
        check_in: string,
        check_out: string,
        training: string,
        attendee: string,
        verified_by: string
    ){
        this.id = id
        this.check_in = check_in
        this.check_out = check_out
        this.training = training
        this.attendee = attendee
        this.verified_by = verified_by
    }
}