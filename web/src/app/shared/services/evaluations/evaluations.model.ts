import { Training } from "../trainings/trainings.model"
import { User } from "../users/users.model"

export class Content {
    public id: string
    public evaluation: string
    public topic_trainer: string
    public content: string
    public presentation: string
    public relevance: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        evaluation: string,
        topic_trainer: string,
        content: string,
        presentation: string,
        relevance: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.evaluation = evaluation
        this.topic_trainer = topic_trainer
        this.content = content
        this.presentation = presentation
        this.relevance = relevance
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ContentExtended {
    public id: string
    public evaluation: InternalExtended
    public topic_trainer: string
    public content: string
    public presentation: string
    public relevance: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        evaluation: InternalExtended,
        topic_trainer: string,
        content: string,
        presentation: string,
        relevance: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.evaluation = evaluation
        this.topic_trainer = topic_trainer
        this.content = content
        this.presentation = presentation
        this.relevance = relevance
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class External {
    public id: string
    public training: string
    public attendee: string
    public answer_1: string
    public answer_2: string
    public answer_3: string
    public answer_4: string
    public answer_5: string
    public answer_6: string
    public answer_7: string
    public answer_8: string
    public answer_9: string
    public approved_by: string
    public verified_by: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        attendee: string,
        answer_1: string,
        answer_2: string,
        answer_3: string,
        answer_4: string,
        answer_5: string,
        answer_6: string,
        answer_7: string,
        answer_8: string,
        answer_9: string,
        approved_by: string,
        verified_by: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.answer_1 = answer_1
        this.answer_2 = answer_2
        this.answer_3 = answer_3
        this.answer_4 = answer_4
        this.answer_5 = answer_5
        this.answer_6 = answer_6
        this.answer_7 = answer_7
        this.answer_8 = answer_8
        this.answer_9 = answer_9
        this.approved_by = approved_by
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class ExternalExtended {
    public id: string
    public training: Training
    public attendee: User
    public answer_1: string
    public answer_2: string
    public answer_3: string
    public answer_4: string
    public answer_5: string
    public answer_6: string
    public answer_7: string
    public answer_8: string
    public answer_9: string
    public approved_by: User
    public verified_by: User
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: Training,
        attendee: User,
        answer_1: string,
        answer_2: string,
        answer_3: string,
        answer_4: string,
        answer_5: string,
        answer_6: string,
        answer_7: string,
        answer_8: string,
        answer_9: string,
        approved_by: User,
        verified_by: User,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.answer_1 = answer_1
        this.answer_2 = answer_2
        this.answer_3 = answer_3
        this.answer_4 = answer_4
        this.answer_5 = answer_5
        this.answer_6 = answer_6
        this.answer_7 = answer_7
        this.answer_8 = answer_8
        this.answer_9 = answer_9
        this.approved_by = approved_by
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class Internal {
    public id: string
    public training: string
    public attendee: string
    public answer_1: string
    public answer_2: string
    public answer_3: string
    public answer_4: string
    public answer_5: string
    public answer_6: string
    public answer_7: string
    public answer_8: string
    public answer_9: string
    public approved_by: string
    public verified_by: string
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: string,
        attendee: string,
        answer_1: string,
        answer_2: string,
        answer_3: string,
        answer_4: string,
        answer_5: string,
        answer_6: string,
        answer_7: string,
        answer_8: string,
        answer_9: string,
        approved_by: string,
        verified_by: string,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.answer_1 = answer_1
        this.answer_2 = answer_2
        this.answer_3 = answer_3
        this.answer_4 = answer_4
        this.answer_5 = answer_5
        this.answer_6 = answer_6
        this.answer_7 = answer_7
        this.answer_8 = answer_8
        this.answer_9 = answer_9
        this.approved_by = approved_by
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

export class InternalExtended {
    public id: string
    public training: Training
    public attendee: User
    public answer_1: string
    public answer_2: string
    public answer_3: string
    public answer_4: string
    public answer_5: string
    public answer_6: string
    public answer_7: string
    public answer_8: string
    public answer_9: string
    public approved_by: User
    public verified_by: User
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        training: Training,
        attendee: User,
        answer_1: string,
        answer_2: string,
        answer_3: string,
        answer_4: string,
        answer_5: string,
        answer_6: string,
        answer_7: string,
        answer_8: string,
        answer_9: string,
        approved_by: User,
        verified_by: User,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.training = training
        this.attendee = attendee
        this.answer_1 = answer_1
        this.answer_2 = answer_2
        this.answer_3 = answer_3
        this.answer_4 = answer_4
        this.answer_5 = answer_5
        this.answer_6 = answer_6
        this.answer_7 = answer_7
        this.answer_8 = answer_8
        this.answer_9 = answer_9
        this.approved_by = approved_by
        this.verified_by = verified_by
        this.created_at = created_at
        this.modified_at = modified_at
    }
}