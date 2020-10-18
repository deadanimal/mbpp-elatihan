export class ExamEvent {
    public id: string
    public action: string
    public action_by: string
    public created_at: string

    constructor(
        id: string,
        action: string,
        action_by: string,
        created_at: string
    ){
        this.id = id
        this.action = action
        this.action_by = action_by
        this.created_at = created_at
    }
}