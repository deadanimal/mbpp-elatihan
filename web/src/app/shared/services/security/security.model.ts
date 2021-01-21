export class SecurityQuestion {
    public id: string
    public question: string
    public created_at: string
    public modified_at: string
    constructor(
        id: string,
        question: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.question = question
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class SecurityAnswer {
    public id: string
    public user: string
    public question: string
    public answer: string
    public created_at: string
    public modified_at: string
    constructor(
        id: string,
        user: string,
        question: string,
        answer: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.user = user
        this.question = question
        this.answer = answer
        this.created_at = created_at
        this.modified_at = modified_at
    }
}