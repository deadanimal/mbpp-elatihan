import { User } from "../users/users.model"

export class Application {
    public id: string
    public training: string
    public applicant: string
    public is_approved: boolean
    public approved_by: string
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        applicant: string,
        is_approved: boolean,
        approved_by: string,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.is_approved = is_approved
        this.approved_by = approved_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ApplicationExtended {
    public id: string
    public training: string
    public applicant: User
    public is_approved: boolean
    public approved_by: User
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        applicant: User,
        is_approved: boolean,
        approved_by: User,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.is_approved = is_approved
        this.approved_by = approved_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}