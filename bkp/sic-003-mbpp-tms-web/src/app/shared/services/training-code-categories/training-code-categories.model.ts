export class TrainingCodeCategory {
    public id: string
    public class_id: string
    public category_name: string
    public category_code: string
    public created_at: string
    public updated_at: string

    constructor(
        id: string,
        class_id: string,
        category_name: string,
        category_code: string,
        created_at: string,
        updated_at: string
    ){
        this.id = id
        this.class_id = class_id
        this.category_name = category_name
        this.category_code = category_code
        this.created_at = created_at
        this.updated_at = updated_at
    }
}