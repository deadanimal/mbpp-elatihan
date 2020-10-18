export class Training {
    public id: string
    public title: string
    public description: string
    public organiser_type: string
    public organiser: string
    public course_type: string
    public category: string
    public course_code: string
    public target_group_type: string
    public target_group: string
    public department: string
    public max_participant: string
    public venue: string
    public address: string
    public start_date: string
    public start_time: string
    public end_date: string
    public end_time: string
    public cost: number
    public duration_days: number
    public status: string
    public speaker: string
    public fasilitator: string
    public attachment: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        title: string,
        description: string,
        organiser_type: string,
        organiser: string,
        course_type: string,
        category: string,
        course_code: string,
        target_group_type: string,
        target_group: string,
        department: string,
        max_participant: string,
        venue: string,
        address: string,
        start_date: string,
        start_time: string,
        end_date: string,
        end_time: string,
        cost: number,
        duration_days: number,
        status: string,
        speaker: string,
        fasilitator: string,
        attachment: string,
        created_at: string,
        updated_at: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.organiser_type = organiser_type
        this.organiser = organiser
        this.course_type = course_type
        this.category = category
        this.course_code = course_code
        this.target_group_type = target_group_type
        this.target_group = target_group
        this.department = department
        this.max_participant = max_participant
        this.venue = venue
        this.address = address
        this.start_date = start_date
        this.start_time = start_time
        this.end_date = end_date
        this.end_time = end_time
        this.cost = cost
        this.duration_days = duration_days
        this.status = status
        this.speaker = speaker
        this.fasilitator = fasilitator
        this.attachment = attachment
        this.created_at = created_at
        this.updated_at = updated_at
    }
}