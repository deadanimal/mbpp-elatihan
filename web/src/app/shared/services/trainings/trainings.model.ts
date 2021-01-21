import { Domain } from '../domains/domains.model';
import { AbsenceMemoExtended } from '../absence-memos/absence-memos.model';
import { ApplicationExtended } from '../applications/applications.model';
import { AttendanceExtended } from '../attendances/attendances.model';
import { Note } from '../notes/notes.model';
import { User } from '../users/users.model';

export class Training {
    public id: string
    public title: string
    public description: string
    public method: string
    public country: string
    public organiser_type: string
    public organiser: string
    public course_type: string
    public core: string
    public domain: string
    public course_code: string
    public target_group_type: string
    public is_group_KPP_A: boolean
    public is_group_KPP_B: boolean
    public is_group_KPP_C: boolean
    public is_group_KP_A: boolean
    public is_group_KP_B: boolean
    public is_group_KP_C: boolean
    public is_department_PDB: boolean
    public is_department_UUU: boolean
    public is_department_UAD: boolean
    public is_department_UPP: boolean
    public is_department_UPS: boolean
    public is_department_JKP: boolean
    public is_department_JPD: boolean
    public is_department_JPH: boolean
    public is_department_JPP: boolean
    public is_department_JKJ: boolean
    public is_department_JKB: boolean
    public is_department_JKEA: boolean
    public is_department_JKEB: boolean
    public is_department_JPR: boolean
    public is_department_JKK: boolean
    public is_department_JKW: boolean
    public is_department_JLK: boolean
    public is_department_JPU: boolean
    public is_department_JPB: boolean
    public max_participant: number
    public venue: string
    public address: string
    public start_date: string
    public start_time: string
    public end_date: string
    public end_time: string
    public cost: number
    public transportation: boolean
    public duration_days: number
    public status: string
    public attachment: string
    public created_at: string
    public created_by: string
    public modified_at: string
    
    constructor(
        id: string,
        title: string,
        description: string,
        method: string,
        country: string,
        organiser_type: string,
        organiser: string,
        course_type: string,
        core: string,
        domain: string,
        course_code: string,
        target_group_type: string,
        is_group_KPP_A: boolean,
        is_group_KPP_B: boolean,
        is_group_KPP_C: boolean,
        is_group_KP_A: boolean,
        is_group_KP_B: boolean,
        is_group_KP_C: boolean,
        is_department_PDB: boolean,
        is_department_UUU: boolean,
        is_department_UAD: boolean,
        is_department_UPP: boolean,
        is_department_UPS: boolean,
        is_department_JKP: boolean,
        is_department_JPD: boolean,
        is_department_JPH: boolean,
        is_department_JPP: boolean,
        is_department_JKJ: boolean,
        is_department_JKB: boolean,
        is_department_JKEA: boolean,
        is_department_JKEB: boolean,
        is_department_JPR: boolean,
        is_department_JKK: boolean,
        is_department_JKW: boolean,
        is_department_JLK: boolean,
        is_department_JPU: boolean,
        is_department_JPB: boolean,
        max_participant: number,
        venue: string,
        address: string,
        start_date: string,
        start_time: string,
        end_date: string,
        end_time: string,
        cost: number,
        transportation: boolean,
        duration_days: number,
        status: string,
        attachment: string,
        created_at: string,
        created_by: string,
        modified_at: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.method = method 
        this.country = country
        this.organiser_type = organiser_type
        this.organiser = organiser
        this.course_type = course_type
        this.core = core
        this.domain = domain
        this.course_code = course_code
        this.target_group_type = target_group_type
        this.is_group_KPP_A = is_group_KPP_A
        this.is_group_KPP_B = is_group_KPP_B
        this.is_group_KPP_C = is_group_KPP_C
        this.is_group_KP_A = is_group_KP_A
        this.is_group_KP_B = is_group_KP_B
        this.is_group_KP_C = is_group_KP_C
        this.is_department_PDB = is_department_PDB
        this.is_department_UUU = is_department_UUU
        this.is_department_UAD = is_department_UAD
        this.is_department_UPP = is_department_UPP
        this.is_department_UPS = is_department_UPS
        this.is_department_JKP = is_department_JKP
        this.is_department_JPD = is_department_JPD
        this.is_department_JPH = is_department_JPH
        this.is_department_JPP = is_department_JPP
        this.is_department_JKJ = is_department_JKJ
        this.is_department_JKB = is_department_JKB
        this.is_department_JKEA = is_department_JKEA
        this.is_department_JKEB = is_department_JKEB
        this.is_department_JPR = is_department_JPR
        this.is_department_JKK = is_department_JKK
        this.is_department_JKW = is_department_JKW
        this.is_department_JLK = is_department_JLK
        this.is_department_JPU = is_department_JPU
        this.is_department_JPB = is_department_JPB
        this.max_participant = max_participant
        this.venue = venue
        this.address = address
        this.start_date = start_date
        this.start_time = start_time
        this.end_date = end_date
        this.end_time = end_time
        this.cost = cost
        this.transportation = transportation
        this.duration_days = duration_days
        this.status = status
        this.attachment = attachment
        this.created_at = created_at
        this.created_by = created_by
        this.modified_at = modified_at
    }
}

export class TrainingExtended {
    public id: string
    public title: string
    public description: string
    public method: string
    public country: string
    public organiser_type: string
    public organiser:  {
        id: string,
        name: string,
        shortname: string,
        created_at: string,
        modified_at: string
    }
    public course_type: string
    public core: {
        id: string,
        parent: string,
        child: string,
        created_at: string,
        modified_at: string
    }
    public domain: Domain
    public course_code: string
    public target_group_type: string
    public is_group_KPP_A: boolean
    public is_group_KPP_B: boolean
    public is_group_KPP_C: boolean
    public is_group_KP_A: boolean
    public is_group_KP_B: boolean
    public is_group_KP_C: boolean
    public is_department_PDB: boolean
    public is_department_UUU: boolean
    public is_department_UAD: boolean
    public is_department_UPP: boolean
    public is_department_UPS: boolean
    public is_department_JKP: boolean
    public is_department_JPD: boolean
    public is_department_JPH: boolean
    public is_department_JPP: boolean
    public is_department_JKJ: boolean
    public is_department_JKB: boolean
    public is_department_JKEA: boolean
    public is_department_JKEB: boolean
    public is_department_JPR: boolean
    public is_department_JKK: boolean
    public is_department_JKW: boolean
    public is_department_JLK: boolean
    public is_department_JPU: boolean
    public is_department_JPB: boolean
    public max_participant: number
    public venue: string
    public address: string
    public start_date: string
    public start_time: string
    public end_date: string
    public end_time: string
    public cost: number
    public transportation: boolean
    public duration_days: number
    public status: string
    public speaker: [
        {
            id: string,
            name: string,
            phone: string,
            training: string,
            trainer_type: string,
            created_at: string,
            modified_at: string
        }
    ]
    public facilitator: [
        {
            id: string,
            name: string,
            phone: string,
            training: string,
            trainer_type: string,
            created_at: string,
            modified_at: string
        }
    ]
    public attachment: string
    public training_training_notes: [Note]
    public training_application: [ApplicationExtended]
    public training_attendee: [AttendanceExtended]
    public training_absence_memo: [AbsenceMemoExtended]
    public created_at: string
    public created_by: User
    public modified_at: string
    
    constructor(
        id: string,
        title: string,
        description: string,
        method: string,
        country: string,
        organiser_type: string,
        organiser: {
            id: string,
            name: string,
            shortname: string,
            created_at: string,
            modified_at: string
        },
        course_type: string,
        core: {
            id: string,
            parent: string,
            child: string,
            created_at: string,
            modified_at: string
        },
        domain: Domain,
        course_code: string,
        target_group_type: string,
        is_group_KPP_A: boolean,
        is_group_KPP_B: boolean,
        is_group_KPP_C: boolean,
        is_group_KP_A: boolean,
        is_group_KP_B: boolean,
        is_group_KP_C: boolean,
        is_department_PDB: boolean,
        is_department_UUU: boolean,
        is_department_UAD: boolean,
        is_department_UPP: boolean,
        is_department_UPS: boolean,
        is_department_JKP: boolean,
        is_department_JPD: boolean,
        is_department_JPH: boolean,
        is_department_JPP: boolean,
        is_department_JKJ: boolean,
        is_department_JKB: boolean,
        is_department_JKEA: boolean,
        is_department_JKEB: boolean,
        is_department_JPR: boolean,
        is_department_JKK: boolean,
        is_department_JKW: boolean,
        is_department_JLK: boolean,
        is_department_JPU: boolean,
        is_department_JPB: boolean,
        max_participant: number,
        venue: string,
        address: string,
        start_date: string,
        start_time: string,
        end_date: string,
        end_time: string,
        cost: number,
        transportation: boolean,
        duration_days: number,
        status: string,
        speaker: [
            {
                id: string,
                name: string,
                phone: string,
                training: string,
                trainer_type: string,
                created_at: string,
                modified_at: string
            }
        ],
        facilitator: [
                {
                id: string,
                name: string,
                phone: string,
                training: string,
                trainer_type: string,
                created_at: string,
                modified_at: string
            }
        ],
        attachment: string,
        training_training_notes: [Note],
        training_application: [ApplicationExtended],
        training_attendee: [AttendanceExtended],
        training_absence_memo: [AbsenceMemoExtended],
        created_at: string,
        created_by: User,
        modified_at: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.method = method 
        this.country = country
        this.organiser_type = organiser_type
        this.organiser = organiser
        this.course_type = course_type
        this.core = core
        this.domain = domain
        this.course_code = course_code
        this.target_group_type = target_group_type
        this.is_group_KPP_A = is_group_KPP_A
        this.is_group_KPP_B = is_group_KPP_B
        this.is_group_KPP_C = is_group_KPP_C
        this.is_group_KP_A = is_group_KP_A
        this.is_group_KP_B = is_group_KP_B
        this.is_group_KP_C = is_group_KP_C
        this.is_department_PDB = is_department_PDB
        this.is_department_UUU = is_department_UUU
        this.is_department_UAD = is_department_UAD
        this.is_department_UPP = is_department_UPP
        this.is_department_UPS = is_department_UPS
        this.is_department_JKP = is_department_JKP
        this.is_department_JPD = is_department_JPD
        this.is_department_JPH = is_department_JPH
        this.is_department_JPP = is_department_JPP
        this.is_department_JKJ = is_department_JKJ
        this.is_department_JKB = is_department_JKB
        this.is_department_JKEA = is_department_JKEA
        this.is_department_JKEB = is_department_JKEB
        this.is_department_JPR = is_department_JPR
        this.is_department_JKK = is_department_JKK
        this.is_department_JKW = is_department_JKW
        this.is_department_JLK = is_department_JLK
        this.is_department_JPU = is_department_JPU
        this.is_department_JPB = is_department_JPB
        this.max_participant = max_participant
        this.venue = venue
        this.address = address
        this.start_date = start_date
        this.start_time = start_time
        this.end_date = end_date
        this.end_time = end_time
        this.cost = cost
        this.transportation = transportation
        this.duration_days = duration_days
        this.status = status
        this.speaker = speaker
        this.facilitator = facilitator
        this.attachment = attachment
        this.training_training_notes = training_training_notes
        this.training_application = training_application
        this.training_attendee  = training_attendee
        this.training_absence_memo = training_absence_memo
        this.created_at = created_at
        this.created_by = created_by
        this.modified_at = modified_at
    }
}