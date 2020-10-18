export class TrainingAssessmentQuestion {
    public id: string
    public assessment_question: string
    public assessment_type: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        assessment_question: string,
        assessment_type: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.assessment_question = assessment_question
        this.assessment_type = assessment_type
        this.created_at = created_at
        this.updated_at = updated_at
    }
}