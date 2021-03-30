import { Training } from '../trainings/trainings.model'
import { User } from '../users/users.model'

export class Certificate {
    public id: string
    public training: string
    public attendee: string
    public generated_by: string
    public cert: string
    public created_at: string
    public modified_at: string
    
    constructor(
        id: string,
        training: string,
        attendee: string,
        generated_by: string,
        cert: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.generated_by = generated_by
        this.cert = cert
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class CertificateExtended {
    public id: string
    public training: Training
    public attendee: User
    public generated_by: User
    public cert: string
    public created_at: string
    public modified_at: string
    
    constructor(
        id: string,
        training: Training,
        attendee: User,
        generated_by: User,
        cert: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.generated_by = generated_by
        this.cert = cert
        this.created_at = created_at
        this.modified_at = modified_at
    }
}