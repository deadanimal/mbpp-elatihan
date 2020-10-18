export class Exam {
    public id: string
    public staff: string
    public title: string
    public code: string
    public date: string
    public document_copy: string
    public result: string
    public classification: string
    public note: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        staff: string,
        title: string,
        code: string,
        date: string,
        document_copy: string,
        result: string,
        classification: string,
        note: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.staff = staff
        this.title = title
        this.code = code
        this.date = date
        this.document_copy = document_copy
        this.result = result
        this.classification = classification
        this.note = note
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ExamTemp {
    public id: string
    public staff: string
    public staff_name: string
    public department: string
    public title: string
    public code: string
    public date: string
    public document_copy: string
    public result: string
    public classification: string
    public note: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        staff: string,
        staff_name: string,
        department: string,
        title: string,
        code: string,
        date: string,
        document_copy: string,
        result: string,
        classification: string,
        note: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.staff = staff
        this.staff_name = staff_name
        this.department = department
        this.title = title
        this.code = code
        this.date = date
        this.document_copy = document_copy
        this.result = result
        this.classification = classification
        this.note = note
        this.created_at = created_at
        this.modified_at = modified_at
    }
}