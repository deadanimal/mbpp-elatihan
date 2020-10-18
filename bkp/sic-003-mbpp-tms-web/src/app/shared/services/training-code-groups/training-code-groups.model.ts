export class TrainingCodeGroup {
    public id: string
    public group_name: string
    public group_code: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        group_name: string,
        group_code: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.group_name = group_name
        this.group_code = group_code
        this.created_at = created_at
        this.updated_at = updated_at
    }
}