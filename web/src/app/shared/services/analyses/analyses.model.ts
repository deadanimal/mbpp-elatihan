import { Core } from "../cores/cores.model"
import { User } from "../users/users.model"

export class Analysis {
    public id: string
    public staff: string
    public core: string
    public suggested_title: string
    public suggested_facilitator: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        staff: string,
        core: string,
        suggested_title: string,
        suggested_facilitator: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.staff = staff
        this.core = core
        this.suggested_title = suggested_title
        this.suggested_facilitator = suggested_facilitator
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class AnalysisExtended {
    public id: string
    public staff: User
    public core: Core
    public suggested_title: string
    public suggested_facilitator: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        staff: User,
        core: Core,
        suggested_title: string,
        suggested_facilitator: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.staff = staff
        this.core = core
        this.suggested_title = suggested_title
        this.suggested_facilitator = suggested_facilitator
        this.created_at = created_at
        this.modified_at = modified_at
    }
}