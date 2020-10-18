export class TrainingNeedAnswer {
    public id: string
    public question_id: string
    public answered_by: string
    public created_at: string
    
    constructor(
        id: string,
        question_id: string,
        answered_by: string,
        created_at: string
    ){
        this.id = id
        this.question_id = question_id
        this.answered_by = answered_by
        this.created_at = created_at
    }
}