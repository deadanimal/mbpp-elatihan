export class TrainingAssessmentAnswer {
    public id: string
    public assessment_type: string
    public answer: string
    public answered_by: string
    public created_at: string

    constructor(
        id: string,
        assessment_type: string,
        answer: string,
        answered_by: string,
        created_at: string
    ){
        this.id = id
        this.assessment_type = assessment_type
        this.answer = answer
        this.answered_by = answered_by
        this.created_at = created_at
    }
}