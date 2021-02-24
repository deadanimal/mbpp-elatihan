import { Training } from "../trainings/trainings.model"
import { User } from "../users/users.model"

export class Application {
    public id: string
    public training: string
    public applicant: string
    public status: string
    public approved_level_1_by: string
    public approved_level_2_by: string
    public approved_level_3_by: string
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        applicant: string,
        status: string,
        approved_level_1_by: string,
        approved_level_2_by: string,
        approved_level_3_by: string,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.status = status
        this.approved_level_1_by = approved_level_1_by
        this.approved_level_2_by = approved_level_2_by
        this.approved_level_3_by = approved_level_3_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ApplicationExtended {
    public id: string
    public training: string
    public applicant: User
    public status: string
    public approved_level_1_by: User
    public approved_level_2_by: User
    public approved_level_3_by: User
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        applicant: User,
        status: string,
        approved_level_1_by: User,
        approved_level_2_by: User,
        approved_level_3_by: User,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.status = status
        this.approved_level_1_by = approved_level_1_by
        this.approved_level_2_by = approved_level_2_by
        this.approved_level_3_by = approved_level_3_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ApplicationSelfExtended {
    public id: string
    public training: Training
    public applicant: string
    public status: string
    public approved_level_1_by: User
    public approved_level_2_by: User
    public approved_level_3_by: User
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: Training,
        applicant: string,
        status: string,
        approved_level_1_by: User,
        approved_level_2_by: User,
        approved_level_3_by: User,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.status = status
        this.approved_level_1_by = approved_level_1_by
        this.approved_level_2_by = approved_level_2_by
        this.approved_level_3_by = approved_level_3_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ApplicationDepartmentExtended {
    public id: string
    public training: Training
    public applicant: User
    public status: string
    public approved_level_1_by: User
    public approved_level_2_by: User
    public approved_level_3_by: User
    public application_type: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: Training,
        applicant: User,
        status: string,
        approved_level_1_by: User,
        approved_level_2_by: User,
        approved_level_3_by: User,
        application_type: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.applicant = applicant
        this.status = status
        this.approved_level_1_by = approved_level_1_by
        this.approved_level_2_by = approved_level_2_by
        this.approved_level_3_by = approved_level_3_by
        this.application_type = application_type
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export const ApplicationStatus = [
    { text: 'AP', value: 'Diterima' },
    { text: 'RJ', value: 'Ditolak' },
    { text: 'RS', value: 'Disimpan' }
]