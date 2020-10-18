export class TrainingNeedQuestion {
    public id: string
    public question: string
    public question_type: string
    public created_at: string
    public updated_at: string
    
    constructor(
        id: string,
        question: string,
        question_type: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.question = question
        this.question_type = question_type
        this.created_at = created_at
        this.updated_at = updated_at
    }
}