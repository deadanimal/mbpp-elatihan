export class SecurityQuestion {
    public id: string
    public question: string
    public created_at: string

    constructor(
        id: string,
        question: string,
        created_at: string
    ){
        this.id = id
        this.question = question
        this.created_at = created_at
    }
}