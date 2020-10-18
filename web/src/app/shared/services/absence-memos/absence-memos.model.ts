export class AbsenceMemo {
    public id: string
    public attendee: string
    public training: string
    public reason: string
    public verified_by: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        attendee: string,
        training: string,
        reason: string,
        verified_by: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.attendee = attendee
        this.training = training
        this.reason = reason
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}