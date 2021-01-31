import { User } from "../users/users.model"

export class Exam {
    public id: string
    public title: string
    public code: string
    public classification: string
    public organiser: string
    public active: boolean
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        title: string,
        code: string,
        classification: string,
        organiser: string,
        active: boolean,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.title = title
        this.code = code
        this.classification = classification
        this.organiser = organiser
        this.active = active
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ExamExtended {
    public id: string
    public title: string
    public code: string
    public classification: string
    public organiser: string
    public active: boolean
    public exam_attendees: ExamAttendee[]
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        title: string,
        code: string,
        classification: string,
        organiser: string,
        active: boolean,
        exam_attendees: ExamAttendee[],
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.title = title
        this.code = code
        this.classification = classification
        this.organiser = organiser
        this.active = active
        this.exam_attendees = exam_attendees
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ExamAttendee {
    public id: string
    public exam: string
    public staff: string
    public date: string
    public document_copy: string
    public result: string
    public note: string
    public created_at: string
    public modified_at: string
    constructor(
        id: string,
        exam: string,
        staff: string,
        date: string,
        document_copy: string,
        result: string,
        note: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.exam = exam
        this.staff = staff
        this.date = date
        this.document_copy = document_copy
        this.result = result
        this.note = note
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ExamAttendeeExtended {
    public id: string
    public exam: Exam
    public staff: User
    public date: string
    public document_copy: string
    public result: string
    public note: string
    public created_at: string
    public modified_at: string
    constructor(
        id: string,
        exam: Exam,
        staff: User,
        date: string,
        document_copy: string,
        result: string,
        note: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.exam = exam
        this.staff = staff
        this.date = date
        this.document_copy = document_copy
        this.result = result
        this.note = note
        this.created_at = created_at
        this.modified_at = modified_at
    }
}