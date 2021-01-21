import { User } from "../users/users.model"

export class Attendance {
    public id: string
    public training: string
    public attendee: string
    public is_attend: boolean
    public check_in: string
    public check_out: string
    public verified_by: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        attendee: string,
        is_attend: boolean,
        check_in: string,
        check_out: string,
        verified_by: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.is_attend = is_attend
        this.check_in = check_in
        this.check_out = check_out
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class AttendanceExtended {
    public id: string
    public training: string
    public attendee: User
    public is_attend: boolean
    public check_in: string
    public check_out: string
    public verified_by: User
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        attendee: User,
        is_attend: boolean,
        check_in: string,
        check_out: string,
        verified_by: User,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.is_attend = is_attend
        this.check_in = check_in
        this.check_out = check_out
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}