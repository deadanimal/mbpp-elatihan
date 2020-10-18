export class TrainingCodeClass {
    public id: string
    public group_id: string
    public class_name: string
    public class_code: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        group_id: string,
        class_name: string,
        class_code: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.group_id = group_id
        this.class_name = class_name
        this.class_code = class_code
        this.created_at = created_at
        this.updated_at = updated_at
    }
}