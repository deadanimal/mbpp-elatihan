export class Trainer {
    public id: string
    public name: string
    public phone: string
    public training: string
    public trainer_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        phone: string,
        training: string,
        trainer_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.phone = phone
        this.training = training
        this.trainer_type = trainer_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}