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
    public training_type: string
    public core: string
    public domain: string
    public course_code: string
    public target_group_type: string
    public is_group_KP_A: boolean
    public is_group_KP_B: boolean
    public is_group_KP_C: boolean
    public is_group_KP_D: boolean
    public is_department_11: boolean
    public is_department_15: boolean
    public is_department_21: boolean
    public is_department_31: boolean
    public is_department_41: boolean
    public is_department_45: boolean
    public is_department_47: boolean
    public is_department_51: boolean
    public is_department_55: boolean
    public is_department_61: boolean
    public is_department_63: boolean
    public is_department_71: boolean
    public is_department_81: boolean
    public is_department_86: boolean
    public is_department_90: boolean
    public is_department_91: boolean
    public is_department_92: boolean
    public is_department_93: boolean
    public is_department_94: boolean
    public is_position_01: boolean
    public is_position_02: boolean
    public is_position_03: boolean
    public is_position_04: boolean
    public is_position_05: boolean
    public is_position_06: boolean
    public is_position_07: boolean
    public is_position_08: boolean
    public is_position_09: boolean
    public is_position_10: boolean
    public is_position_11: boolean
    public is_position_12: boolean
    public is_position_13: boolean
    public is_position_14: boolean
    public is_position_15: boolean
    public is_position_16: boolean
    public is_position_17: boolean
    public is_position_18: boolean
    public is_position_19: boolean
    public is_position_20: boolean
    public is_position_21: boolean
    public is_position_22: boolean
    public is_position_23: boolean
    public is_position_24: boolean
    public is_position_25: boolean
    public is_position_26: boolean
    public is_position_27: boolean
    public is_position_28: boolean
    public is_position_29: boolean
    public is_position_30: boolean
    public is_position_31: boolean
    public is_position_32: boolean
    public is_position_33: boolean
    public is_position_34: boolean
    public is_position_35: boolean
    public is_position_36: boolean
    public is_position_37: boolean
    public is_position_38: boolean
    public is_position_39: boolean
    public is_position_40: boolean
    public is_position_41: boolean
    public is_position_42: boolean
    public is_position_43: boolean
    public is_position_44: boolean
    public is_position_45: boolean
    public is_position_46: boolean
    public is_position_47: boolean
    public is_position_48: boolean
    public is_position_49: boolean
    public is_position_50: boolean
    public is_position_51: boolean
    public is_position_52: boolean
    public is_position_53: boolean
    public is_position_54: boolean
    public is_position_55: boolean
    public is_position_60: boolean
    public is_ba19: boolean
    public is_fa29: boolean
    public is_fa32: boolean
    public is_fa41: boolean
    public is_fa44: boolean
    public is_fa48: boolean
    public is_ft19: boolean
    public is_ga17: boolean
    public is_ga19: boolean
    public is_ga22: boolean
    public is_ga26: boolean
    public is_ga29: boolean
    public is_ga32: boolean
    public is_ga41: boolean
    public is_gv41: boolean
    public is_ha11: boolean
    public is_ha14: boolean
    public is_ha16: boolean
    public is_ha19: boolean
    public is_ha22: boolean
    public is_ja19: boolean
    public is_ja22: boolean
    public is_ja29: boolean
    public is_ja36: boolean
    public is_ja38: boolean
    public is_ja40: boolean
    public is_ja41: boolean
    public is_ja44: boolean
    public is_ja48: boolean
    public is_ja52: boolean
    public is_ja54: boolean
    public is_kp11: boolean
    public is_kp14: boolean
    public is_kp19: boolean
    public is_kp22: boolean
    public is_kp29: boolean
    public is_kp32: boolean
    public is_kp41: boolean
    public is_la29: boolean
    public is_la41: boolean
    public is_la44: boolean
    public is_la52: boolean
    public is_la54: boolean
    public is_na01: boolean
    public is_na11: boolean
    public is_na14: boolean
    public is_na17: boolean
    public is_na19: boolean
    public is_na22: boolean
    public is_na26: boolean
    public is_na29: boolean
    public is_na30: boolean
    public is_na32: boolean
    public is_na36: boolean
    public is_na41: boolean
    public is_na44: boolean
    public is_na48: boolean
    public is_na52: boolean
    public is_na54: boolean
    public is_ra01: boolean
    public is_ra03: boolean
    public is_ua11: boolean
    public is_ua14: boolean
    public is_ua17: boolean
    public is_ua19: boolean
    public is_ua24: boolean
    public is_ua29: boolean
    public is_ua32: boolean
    public is_ua36: boolean
    public is_ua41: boolean
    public is_ud43: boolean
    public is_ud48: boolean
    public is_ud52: boolean
    public is_vu06: boolean
    public is_vu07: boolean
    public is_wa17: boolean
    public is_wa19: boolean
    public is_wa22: boolean
    public is_wa26: boolean
    public is_wa28: boolean
    public is_wa29: boolean
    public is_wa32: boolean
    public is_wa36: boolean
    public is_wa41: boolean
    public is_wa44: boolean
    public is_wa48: boolean
    public is_wa52: boolean
    public is_wa54: boolean
    public is_waa41: boolean
    public is_waa44: boolean
    public max_participant: number
    public venue: string
    public address: string
    public start_date: string
    public start_time: string
    public end_date: string
    public end_time: string
    public schedule_notes: string
    public cost: number
    public transportation: boolean
    public duration_days: number
    public status: string
    public attachment: string
    public attachment_approval: string
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
        training_type: string,
        core: string,
        domain: string,
        course_code: string,
        target_group_type: string,
        is_group_KP_A: boolean,
        is_group_KP_B: boolean,
        is_group_KP_C: boolean,
        is_group_KP_D: boolean,
        is_department_11: boolean,
        is_department_15: boolean,
        is_department_21: boolean,
        is_department_31: boolean,
        is_department_41: boolean,
        is_department_45: boolean,
        is_department_47: boolean,
        is_department_51: boolean,
        is_department_55: boolean,
        is_department_61: boolean,
        is_department_63: boolean,
        is_department_71: boolean,
        is_department_81: boolean,
        is_department_86: boolean,
        is_department_90: boolean,
        is_department_91: boolean,
        is_department_92: boolean,
        is_department_93: boolean,
        is_department_94: boolean,
        is_position_01: boolean,
        is_position_02: boolean,
        is_position_03: boolean,
        is_position_04: boolean,
        is_position_05: boolean,
        is_position_06: boolean,
        is_position_07: boolean,
        is_position_08: boolean,
        is_position_09: boolean,
        is_position_10: boolean,
        is_position_11: boolean,
        is_position_12: boolean,
        is_position_13: boolean,
        is_position_14: boolean,
        is_position_15: boolean,
        is_position_16: boolean,
        is_position_17: boolean,
        is_position_18: boolean,
        is_position_19: boolean,
        is_position_20: boolean,
        is_position_21: boolean,
        is_position_22: boolean,
        is_position_23: boolean,
        is_position_24: boolean,
        is_position_25: boolean,
        is_position_26: boolean,
        is_position_27: boolean,
        is_position_28: boolean,
        is_position_29: boolean,
        is_position_30: boolean,
        is_position_31: boolean,
        is_position_32: boolean,
        is_position_33: boolean,
        is_position_34: boolean,
        is_position_35: boolean,
        is_position_36: boolean,
        is_position_37: boolean,
        is_position_38: boolean,
        is_position_39: boolean,
        is_position_40: boolean,
        is_position_41: boolean,
        is_position_42: boolean,
        is_position_43: boolean,
        is_position_44: boolean,
        is_position_45: boolean,
        is_position_46: boolean,
        is_position_47: boolean,
        is_position_48: boolean,
        is_position_49: boolean,
        is_position_50: boolean,
        is_position_51: boolean,
        is_position_52: boolean,
        is_position_53: boolean,
        is_position_54: boolean,
        is_position_55: boolean,
        is_position_60: boolean,
        is_ba19: boolean,
        is_fa29: boolean,
        is_fa32: boolean,
        is_fa41: boolean,
        is_fa44: boolean,
        is_fa48: boolean,
        is_ft19: boolean,
        is_ga17: boolean,
        is_ga19: boolean,
        is_ga22: boolean,
        is_ga26: boolean,
        is_ga29: boolean,
        is_ga32: boolean,
        is_ga41: boolean,
        is_gv41: boolean,
        is_ha11: boolean,
        is_ha14: boolean,
        is_ha16: boolean,
        is_ha19: boolean,
        is_ha22: boolean,
        is_ja19: boolean,
        is_ja22: boolean,
        is_ja29: boolean,
        is_ja36: boolean,
        is_ja38: boolean,
        is_ja40: boolean,
        is_ja41: boolean,
        is_ja44: boolean,
        is_ja48: boolean,
        is_ja52: boolean,
        is_ja54: boolean,
        is_kp11: boolean,
        is_kp14: boolean,
        is_kp19: boolean,
        is_kp22: boolean,
        is_kp29: boolean,
        is_kp32: boolean,
        is_kp41: boolean,
        is_la29: boolean,
        is_la41: boolean,
        is_la44: boolean,
        is_la52: boolean,
        is_la54: boolean,
        is_na01: boolean,
        is_na11: boolean,
        is_na14: boolean,
        is_na17: boolean,
        is_na19: boolean,
        is_na22: boolean,
        is_na26: boolean,
        is_na29: boolean,
        is_na30: boolean,
        is_na32: boolean,
        is_na36: boolean,
        is_na41: boolean,
        is_na44: boolean,
        is_na48: boolean,
        is_na52: boolean,
        is_na54: boolean,
        is_ra01: boolean,
        is_ra03: boolean,
        is_ua11: boolean,
        is_ua14: boolean,
        is_ua17: boolean,
        is_ua19: boolean,
        is_ua24: boolean,
        is_ua29: boolean,
        is_ua32: boolean,
        is_ua36: boolean,
        is_ua41: boolean,
        is_ud43: boolean,
        is_ud48: boolean,
        is_ud52: boolean,
        is_vu06: boolean,
        is_vu07: boolean,
        is_wa17: boolean,
        is_wa19: boolean,
        is_wa22: boolean,
        is_wa26: boolean,
        is_wa28: boolean,
        is_wa29: boolean,
        is_wa32: boolean,
        is_wa36: boolean,
        is_wa41: boolean,
        is_wa44: boolean,
        is_wa48: boolean,
        is_wa52: boolean,
        is_wa54: boolean,
        is_waa41: boolean,
        is_waa44: boolean,
        max_participant: number,
        venue: string,
        address: string,
        start_date: string,
        start_time: string,
        end_date: string,
        end_time: string,
        schedule_notes: string,
        cost: number,
        transportation: boolean,
        duration_days: number,
        status: string,
        attachment: string,
        attachment_approval: string,
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
        this.training_type = training_type
        this.core = core
        this.domain = domain
        this.course_code = course_code
        this.target_group_type = target_group_type
        this.is_group_KP_A = is_group_KP_A
        this.is_group_KP_B = is_group_KP_B
        this.is_group_KP_C = is_group_KP_C
        this.is_group_KP_D = is_group_KP_D
        this.is_department_11 = is_department_11
        this.is_department_15 = is_department_15
        this.is_department_21 = is_department_21
        this.is_department_31 = is_department_31
        this.is_department_41 = is_department_41
        this.is_department_45 = is_department_45
        this.is_department_47 = is_department_47
        this.is_department_51 = is_department_51
        this.is_department_55 = is_department_55
        this.is_department_61 = is_department_61
        this.is_department_63 = is_department_63
        this.is_department_71 = is_department_71
        this.is_department_81 = is_department_81
        this.is_department_86 = is_department_86
        this.is_department_90 = is_department_90
        this.is_department_91 = is_department_91
        this.is_department_92 = is_department_92
        this.is_department_93 = is_department_93
        this.is_department_94 = is_department_94
        this.is_position_01 = is_position_01
        this.is_position_02 = is_position_02
        this.is_position_03 = is_position_03
        this.is_position_04 = is_position_04
        this.is_position_05 = is_position_05
        this.is_position_06 = is_position_06
        this.is_position_07 = is_position_07
        this.is_position_08 = is_position_08
        this.is_position_09 = is_position_09
        this.is_position_10 = is_position_10
        this.is_position_11 = is_position_11
        this.is_position_12 = is_position_12
        this.is_position_13 = is_position_13
        this.is_position_14 = is_position_14
        this.is_position_15 = is_position_15
        this.is_position_16 = is_position_16
        this.is_position_17 = is_position_17
        this.is_position_18 = is_position_18
        this.is_position_19 = is_position_19
        this.is_position_20 = is_position_20
        this.is_position_21 = is_position_21
        this.is_position_22 = is_position_22
        this.is_position_23 = is_position_23
        this.is_position_24 = is_position_24
        this.is_position_25 = is_position_25
        this.is_position_26 = is_position_26
        this.is_position_27 = is_position_27
        this.is_position_28 = is_position_28
        this.is_position_29 = is_position_29
        this.is_position_30 = is_position_30
        this.is_position_31 = is_position_31
        this.is_position_32 = is_position_32
        this.is_position_33 = is_position_33
        this.is_position_34 = is_position_34
        this.is_position_35 = is_position_35
        this.is_position_36 = is_position_36
        this.is_position_37 = is_position_37
        this.is_position_38 = is_position_38
        this.is_position_39 = is_position_39
        this.is_position_40 = is_position_40
        this.is_position_41 = is_position_41
        this.is_position_42 = is_position_42
        this.is_position_43 = is_position_43
        this.is_position_44 = is_position_44
        this.is_position_45 = is_position_45
        this.is_position_46 = is_position_46
        this.is_position_47 = is_position_47
        this.is_position_48 = is_position_48
        this.is_position_49 = is_position_49
        this.is_position_50 = is_position_50
        this.is_position_51 = is_position_51
        this.is_position_52 = is_position_52
        this.is_position_53 = is_position_53
        this.is_position_54 = is_position_54
        this.is_position_55 = is_position_55
        this.is_position_60 = is_position_60
        this.is_ba19 = is_ba19 
        this.is_fa29 = is_fa29 
        this.is_fa32 = is_fa32 
        this.is_fa41 = is_fa41 
        this.is_fa44 = is_fa44 
        this.is_fa48 = is_fa48 
        this.is_ft19 = is_ft19 
        this.is_ga17 = is_ga17 
        this.is_ga19 = is_ga19 
        this.is_ga22 = is_ga22 
        this.is_ga26 = is_ga26 
        this.is_ga29 = is_ga29 
        this.is_ga32 = is_ga32 
        this.is_ga41 = is_ga41 
        this.is_gv41 = is_gv41 
        this.is_ha11 = is_ha11 
        this.is_ha14 = is_ha14 
        this.is_ha16 = is_ha16 
        this.is_ha19 = is_ha19 
        this.is_ha22 = is_ha22 
        this.is_ja19 = is_ja19 
        this.is_ja22 = is_ja22 
        this.is_ja29 = is_ja29 
        this.is_ja36 = is_ja36 
        this.is_ja38 = is_ja38 
        this.is_ja40 = is_ja40 
        this.is_ja41 = is_ja41 
        this.is_ja44 = is_ja44 
        this.is_ja48 = is_ja48 
        this.is_ja52 = is_ja52 
        this.is_ja54 = is_ja54 
        this.is_kp11 = is_kp11 
        this.is_kp14 = is_kp14 
        this.is_kp19 = is_kp19 
        this.is_kp22 = is_kp22 
        this.is_kp29 = is_kp29 
        this.is_kp32 = is_kp32 
        this.is_kp41 = is_kp41 
        this.is_la29 = is_la29 
        this.is_la41 = is_la41 
        this.is_la44 = is_la44 
        this.is_la52 = is_la52 
        this.is_la54 = is_la54 
        this.is_na01 = is_na01 
        this.is_na11 = is_na11 
        this.is_na14 = is_na14 
        this.is_na17 = is_na17 
        this.is_na19 = is_na19 
        this.is_na22 = is_na22 
        this.is_na26 = is_na26 
        this.is_na29 = is_na29 
        this.is_na30 = is_na30 
        this.is_na32 = is_na32 
        this.is_na36 = is_na36 
        this.is_na41 = is_na41 
        this.is_na44 = is_na44 
        this.is_na48 = is_na48 
        this.is_na52 = is_na52 
        this.is_na54 = is_na54 
        this.is_ra01 = is_ra01 
        this.is_ra03 = is_ra03 
        this.is_ua11 = is_ua11 
        this.is_ua14 = is_ua14 
        this.is_ua17 = is_ua17 
        this.is_ua19 = is_ua19 
        this.is_ua24 = is_ua24 
        this.is_ua29 = is_ua29 
        this.is_ua32 = is_ua32 
        this.is_ua36 = is_ua36 
        this.is_ua41 = is_ua41 
        this.is_ud43 = is_ud43 
        this.is_ud48 = is_ud48 
        this.is_ud52 = is_ud52 
        this.is_vu06 = is_vu06 
        this.is_vu07 = is_vu07 
        this.is_wa17 = is_wa17 
        this.is_wa19 = is_wa19 
        this.is_wa22 = is_wa22 
        this.is_wa26 = is_wa26 
        this.is_wa28 = is_wa28 
        this.is_wa29 = is_wa29 
        this.is_wa32 = is_wa32 
        this.is_wa36 = is_wa36 
        this.is_wa41 = is_wa41 
        this.is_wa44 = is_wa44 
        this.is_wa48 = is_wa48 
        this.is_wa52 = is_wa52 
        this.is_wa54 = is_wa54 
        this.is_waa41 = is_waa41 
        this.is_waa44 = is_waa44
        this.max_participant = max_participant
        this.venue = venue
        this.address = address
        this.start_date = start_date
        this.start_time = start_time
        this.end_date = end_date
        this.end_time = end_time
        this.schedule_notes = schedule_notes
        this.cost = cost
        this.transportation = transportation
        this.duration_days = duration_days
        this.status = status
        this.attachment = attachment
        this.attachment_approval = attachment_approval
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
    public training_type: TrainingType
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
    public is_group_KP_A: boolean
    public is_group_KP_B: boolean
    public is_group_KP_C: boolean
    public is_group_KP_D: boolean
    public is_department_11: boolean
    public is_department_15: boolean
    public is_department_21: boolean
    public is_department_31: boolean
    public is_department_41: boolean
    public is_department_45: boolean
    public is_department_47: boolean
    public is_department_51: boolean
    public is_department_55: boolean
    public is_department_61: boolean
    public is_department_63: boolean
    public is_department_71: boolean
    public is_department_81: boolean
    public is_department_86: boolean
    public is_department_90: boolean
    public is_department_91: boolean
    public is_department_92: boolean
    public is_department_93: boolean
    public is_department_94: boolean
    public is_position_01: boolean
    public is_position_02: boolean
    public is_position_03: boolean
    public is_position_04: boolean
    public is_position_05: boolean
    public is_position_06: boolean
    public is_position_07: boolean
    public is_position_08: boolean
    public is_position_09: boolean
    public is_position_10: boolean
    public is_position_11: boolean
    public is_position_12: boolean
    public is_position_13: boolean
    public is_position_14: boolean
    public is_position_15: boolean
    public is_position_16: boolean
    public is_position_17: boolean
    public is_position_18: boolean
    public is_position_19: boolean
    public is_position_20: boolean
    public is_position_21: boolean
    public is_position_22: boolean
    public is_position_23: boolean
    public is_position_24: boolean
    public is_position_25: boolean
    public is_position_26: boolean
    public is_position_27: boolean
    public is_position_28: boolean
    public is_position_29: boolean
    public is_position_30: boolean
    public is_position_31: boolean
    public is_position_32: boolean
    public is_position_33: boolean
    public is_position_34: boolean
    public is_position_35: boolean
    public is_position_36: boolean
    public is_position_37: boolean
    public is_position_38: boolean
    public is_position_39: boolean
    public is_position_40: boolean
    public is_position_41: boolean
    public is_position_42: boolean
    public is_position_43: boolean
    public is_position_44: boolean
    public is_position_45: boolean
    public is_position_46: boolean
    public is_position_47: boolean
    public is_position_48: boolean
    public is_position_49: boolean
    public is_position_50: boolean
    public is_position_51: boolean
    public is_position_52: boolean
    public is_position_53: boolean
    public is_position_54: boolean
    public is_position_55: boolean
    public is_position_60: boolean
    public is_ba19: boolean
    public is_fa29: boolean
    public is_fa32: boolean
    public is_fa41: boolean
    public is_fa44: boolean
    public is_fa48: boolean
    public is_ft19: boolean
    public is_ga17: boolean
    public is_ga19: boolean
    public is_ga22: boolean
    public is_ga26: boolean
    public is_ga29: boolean
    public is_ga32: boolean
    public is_ga41: boolean
    public is_gv41: boolean
    public is_ha11: boolean
    public is_ha14: boolean
    public is_ha16: boolean
    public is_ha19: boolean
    public is_ha22: boolean
    public is_ja19: boolean
    public is_ja22: boolean
    public is_ja29: boolean
    public is_ja36: boolean
    public is_ja38: boolean
    public is_ja40: boolean
    public is_ja41: boolean
    public is_ja44: boolean
    public is_ja48: boolean
    public is_ja52: boolean
    public is_ja54: boolean
    public is_kp11: boolean
    public is_kp14: boolean
    public is_kp19: boolean
    public is_kp22: boolean
    public is_kp29: boolean
    public is_kp32: boolean
    public is_kp41: boolean
    public is_la29: boolean
    public is_la41: boolean
    public is_la44: boolean
    public is_la52: boolean
    public is_la54: boolean
    public is_na01: boolean
    public is_na11: boolean
    public is_na14: boolean
    public is_na17: boolean
    public is_na19: boolean
    public is_na22: boolean
    public is_na26: boolean
    public is_na29: boolean
    public is_na30: boolean
    public is_na32: boolean
    public is_na36: boolean
    public is_na41: boolean
    public is_na44: boolean
    public is_na48: boolean
    public is_na52: boolean
    public is_na54: boolean
    public is_ra01: boolean
    public is_ra03: boolean
    public is_ua11: boolean
    public is_ua14: boolean
    public is_ua17: boolean
    public is_ua19: boolean
    public is_ua24: boolean
    public is_ua29: boolean
    public is_ua32: boolean
    public is_ua36: boolean
    public is_ua41: boolean
    public is_ud43: boolean
    public is_ud48: boolean
    public is_ud52: boolean
    public is_vu06: boolean
    public is_vu07: boolean
    public is_wa17: boolean
    public is_wa19: boolean
    public is_wa22: boolean
    public is_wa26: boolean
    public is_wa28: boolean
    public is_wa29: boolean
    public is_wa32: boolean
    public is_wa36: boolean
    public is_wa41: boolean
    public is_wa44: boolean
    public is_wa48: boolean
    public is_wa52: boolean
    public is_wa54: boolean
    public is_waa41: boolean
    public is_waa44: boolean
    public max_participant: number
    public venue: string
    public address: string
    public start_date: string
    public start_time: string
    public end_date: string
    public end_time: string
    public schedule_notes: string
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
    public attachment_approval: string
    public training_training_notes: Note[]
    public training_application: ApplicationExtended[]
    public training_attendee: AttendanceExtended[]
    public training_absence_memo: AbsenceMemoExtended[]
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
        training_type: TrainingType,
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
        is_group_KP_A: boolean,
        is_group_KP_B: boolean,
        is_group_KP_C: boolean,
        is_group_KP_D: boolean,
        is_department_11: boolean,
        is_department_15: boolean,
        is_department_21: boolean,
        is_department_31: boolean,
        is_department_41: boolean,
        is_department_45: boolean,
        is_department_47: boolean,
        is_department_51: boolean,
        is_department_55: boolean,
        is_department_61: boolean,
        is_department_63: boolean,
        is_department_71: boolean,
        is_department_81: boolean,
        is_department_86: boolean,
        is_department_90: boolean,
        is_department_91: boolean,
        is_department_92: boolean,
        is_department_93: boolean,
        is_department_94: boolean,
        is_position_01: boolean,
        is_position_02: boolean,
        is_position_03: boolean,
        is_position_04: boolean,
        is_position_05: boolean,
        is_position_06: boolean,
        is_position_07: boolean,
        is_position_08: boolean,
        is_position_09: boolean,
        is_position_10: boolean,
        is_position_11: boolean,
        is_position_12: boolean,
        is_position_13: boolean,
        is_position_14: boolean,
        is_position_15: boolean,
        is_position_16: boolean,
        is_position_17: boolean,
        is_position_18: boolean,
        is_position_19: boolean,
        is_position_20: boolean,
        is_position_21: boolean,
        is_position_22: boolean,
        is_position_23: boolean,
        is_position_24: boolean,
        is_position_25: boolean,
        is_position_26: boolean,
        is_position_27: boolean,
        is_position_28: boolean,
        is_position_29: boolean,
        is_position_30: boolean,
        is_position_31: boolean,
        is_position_32: boolean,
        is_position_33: boolean,
        is_position_34: boolean,
        is_position_35: boolean,
        is_position_36: boolean,
        is_position_37: boolean,
        is_position_38: boolean,
        is_position_39: boolean,
        is_position_40: boolean,
        is_position_41: boolean,
        is_position_42: boolean,
        is_position_43: boolean,
        is_position_44: boolean,
        is_position_45: boolean,
        is_position_46: boolean,
        is_position_47: boolean,
        is_position_48: boolean,
        is_position_49: boolean,
        is_position_50: boolean,
        is_position_51: boolean,
        is_position_52: boolean,
        is_position_53: boolean,
        is_position_54: boolean,
        is_position_55: boolean,
        is_position_60: boolean,
        is_ba19: boolean,
        is_fa29: boolean,
        is_fa32: boolean,
        is_fa41: boolean,
        is_fa44: boolean,
        is_fa48: boolean,
        is_ft19: boolean,
        is_ga17: boolean,
        is_ga19: boolean,
        is_ga22: boolean,
        is_ga26: boolean,
        is_ga29: boolean,
        is_ga32: boolean,
        is_ga41: boolean,
        is_gv41: boolean,
        is_ha11: boolean,
        is_ha14: boolean,
        is_ha16: boolean,
        is_ha19: boolean,
        is_ha22: boolean,
        is_ja19: boolean,
        is_ja22: boolean,
        is_ja29: boolean,
        is_ja36: boolean,
        is_ja38: boolean,
        is_ja40: boolean,
        is_ja41: boolean,
        is_ja44: boolean,
        is_ja48: boolean,
        is_ja52: boolean,
        is_ja54: boolean,
        is_kp11: boolean,
        is_kp14: boolean,
        is_kp19: boolean,
        is_kp22: boolean,
        is_kp29: boolean,
        is_kp32: boolean,
        is_kp41: boolean,
        is_la29: boolean,
        is_la41: boolean,
        is_la44: boolean,
        is_la52: boolean,
        is_la54: boolean,
        is_na01: boolean,
        is_na11: boolean,
        is_na14: boolean,
        is_na17: boolean,
        is_na19: boolean,
        is_na22: boolean,
        is_na26: boolean,
        is_na29: boolean,
        is_na30: boolean,
        is_na32: boolean,
        is_na36: boolean,
        is_na41: boolean,
        is_na44: boolean,
        is_na48: boolean,
        is_na52: boolean,
        is_na54: boolean,
        is_ra01: boolean,
        is_ra03: boolean,
        is_ua11: boolean,
        is_ua14: boolean,
        is_ua17: boolean,
        is_ua19: boolean,
        is_ua24: boolean,
        is_ua29: boolean,
        is_ua32: boolean,
        is_ua36: boolean,
        is_ua41: boolean,
        is_ud43: boolean,
        is_ud48: boolean,
        is_ud52: boolean,
        is_vu06: boolean,
        is_vu07: boolean,
        is_wa17: boolean,
        is_wa19: boolean,
        is_wa22: boolean,
        is_wa26: boolean,
        is_wa28: boolean,
        is_wa29: boolean,
        is_wa32: boolean,
        is_wa36: boolean,
        is_wa41: boolean,
        is_wa44: boolean,
        is_wa48: boolean,
        is_wa52: boolean,
        is_wa54: boolean,
        is_waa41: boolean,
        is_waa44: boolean,
        max_participant: number,
        venue: string,
        address: string,
        start_date: string,
        start_time: string,
        end_date: string,
        end_time: string,
        schedule_notes: string,
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
        attachment_approval: string,
        training_training_notes: Note[],
        training_application: ApplicationExtended[],
        training_attendee: AttendanceExtended[],
        training_absence_memo: AbsenceMemoExtended[],
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
        this.training_type = training_type
        this.core = core
        this.domain = domain
        this.course_code = course_code
        this.target_group_type = target_group_type
        this.is_group_KP_A = is_group_KP_A
        this.is_group_KP_B = is_group_KP_B
        this.is_group_KP_C = is_group_KP_C
        this.is_group_KP_D = is_group_KP_D
        this.is_department_11 = is_department_11
        this.is_department_15 = is_department_15
        this.is_department_21 = is_department_21
        this.is_department_31 = is_department_31
        this.is_department_41 = is_department_41
        this.is_department_45 = is_department_45
        this.is_department_47 = is_department_47
        this.is_department_51 = is_department_51
        this.is_department_55 = is_department_55
        this.is_department_61 = is_department_61
        this.is_department_63 = is_department_63
        this.is_department_71 = is_department_71
        this.is_department_81 = is_department_81
        this.is_department_86 = is_department_86
        this.is_department_90 = is_department_90
        this.is_department_91 = is_department_91
        this.is_department_92 = is_department_92
        this.is_department_93 = is_department_93
        this.is_department_94 = is_department_94
        this.is_position_01 = is_position_01
        this.is_position_02 = is_position_02
        this.is_position_03 = is_position_03
        this.is_position_04 = is_position_04
        this.is_position_05 = is_position_05
        this.is_position_06 = is_position_06
        this.is_position_07 = is_position_07
        this.is_position_08 = is_position_08
        this.is_position_09 = is_position_09
        this.is_position_10 = is_position_10
        this.is_position_11 = is_position_11
        this.is_position_12 = is_position_12
        this.is_position_13 = is_position_13
        this.is_position_14 = is_position_14
        this.is_position_15 = is_position_15
        this.is_position_16 = is_position_16
        this.is_position_17 = is_position_17
        this.is_position_18 = is_position_18
        this.is_position_19 = is_position_19
        this.is_position_20 = is_position_20
        this.is_position_21 = is_position_21
        this.is_position_22 = is_position_22
        this.is_position_23 = is_position_23
        this.is_position_24 = is_position_24
        this.is_position_25 = is_position_25
        this.is_position_26 = is_position_26
        this.is_position_27 = is_position_27
        this.is_position_28 = is_position_28
        this.is_position_29 = is_position_29
        this.is_position_30 = is_position_30
        this.is_position_31 = is_position_31
        this.is_position_32 = is_position_32
        this.is_position_33 = is_position_33
        this.is_position_34 = is_position_34
        this.is_position_35 = is_position_35
        this.is_position_36 = is_position_36
        this.is_position_37 = is_position_37
        this.is_position_38 = is_position_38
        this.is_position_39 = is_position_39
        this.is_position_40 = is_position_40
        this.is_position_41 = is_position_41
        this.is_position_42 = is_position_42
        this.is_position_43 = is_position_43
        this.is_position_44 = is_position_44
        this.is_position_45 = is_position_45
        this.is_position_46 = is_position_46
        this.is_position_47 = is_position_47
        this.is_position_48 = is_position_48
        this.is_position_49 = is_position_49
        this.is_position_50 = is_position_50
        this.is_position_51 = is_position_51
        this.is_position_52 = is_position_52
        this.is_position_53 = is_position_53
        this.is_position_54 = is_position_54
        this.is_position_55 = is_position_55
        this.is_position_60 = is_position_60
        this.is_ba19 = is_ba19 
        this.is_fa29 = is_fa29 
        this.is_fa32 = is_fa32 
        this.is_fa41 = is_fa41 
        this.is_fa44 = is_fa44 
        this.is_fa48 = is_fa48 
        this.is_ft19 = is_ft19 
        this.is_ga17 = is_ga17 
        this.is_ga19 = is_ga19 
        this.is_ga22 = is_ga22 
        this.is_ga26 = is_ga26 
        this.is_ga29 = is_ga29 
        this.is_ga32 = is_ga32 
        this.is_ga41 = is_ga41 
        this.is_gv41 = is_gv41 
        this.is_ha11 = is_ha11 
        this.is_ha14 = is_ha14 
        this.is_ha16 = is_ha16 
        this.is_ha19 = is_ha19 
        this.is_ha22 = is_ha22 
        this.is_ja19 = is_ja19 
        this.is_ja22 = is_ja22 
        this.is_ja29 = is_ja29 
        this.is_ja36 = is_ja36 
        this.is_ja38 = is_ja38 
        this.is_ja40 = is_ja40 
        this.is_ja41 = is_ja41 
        this.is_ja44 = is_ja44 
        this.is_ja48 = is_ja48 
        this.is_ja52 = is_ja52 
        this.is_ja54 = is_ja54 
        this.is_kp11 = is_kp11 
        this.is_kp14 = is_kp14 
        this.is_kp19 = is_kp19 
        this.is_kp22 = is_kp22 
        this.is_kp29 = is_kp29 
        this.is_kp32 = is_kp32 
        this.is_kp41 = is_kp41 
        this.is_la29 = is_la29 
        this.is_la41 = is_la41 
        this.is_la44 = is_la44 
        this.is_la52 = is_la52 
        this.is_la54 = is_la54 
        this.is_na01 = is_na01 
        this.is_na11 = is_na11 
        this.is_na14 = is_na14 
        this.is_na17 = is_na17 
        this.is_na19 = is_na19 
        this.is_na22 = is_na22 
        this.is_na26 = is_na26 
        this.is_na29 = is_na29 
        this.is_na30 = is_na30 
        this.is_na32 = is_na32 
        this.is_na36 = is_na36 
        this.is_na41 = is_na41 
        this.is_na44 = is_na44 
        this.is_na48 = is_na48 
        this.is_na52 = is_na52 
        this.is_na54 = is_na54 
        this.is_ra01 = is_ra01 
        this.is_ra03 = is_ra03 
        this.is_ua11 = is_ua11 
        this.is_ua14 = is_ua14 
        this.is_ua17 = is_ua17 
        this.is_ua19 = is_ua19 
        this.is_ua24 = is_ua24 
        this.is_ua29 = is_ua29 
        this.is_ua32 = is_ua32 
        this.is_ua36 = is_ua36 
        this.is_ua41 = is_ua41 
        this.is_ud43 = is_ud43 
        this.is_ud48 = is_ud48 
        this.is_ud52 = is_ud52 
        this.is_vu06 = is_vu06 
        this.is_vu07 = is_vu07 
        this.is_wa17 = is_wa17 
        this.is_wa19 = is_wa19 
        this.is_wa22 = is_wa22 
        this.is_wa26 = is_wa26 
        this.is_wa28 = is_wa28 
        this.is_wa29 = is_wa29 
        this.is_wa32 = is_wa32 
        this.is_wa36 = is_wa36 
        this.is_wa41 = is_wa41 
        this.is_wa44 = is_wa44 
        this.is_wa48 = is_wa48 
        this.is_wa52 = is_wa52 
        this.is_wa54 = is_wa54 
        this.is_waa41 = is_waa41 
        this.is_waa44 = is_waa44
        this.max_participant = max_participant
        this.venue = venue
        this.address = address
        this.start_date = start_date
        this.start_time = start_time
        this.end_date = end_date
        this.end_time = end_time
        this.schedule_notes = schedule_notes
        this.cost = cost
        this.transportation = transportation
        this.duration_days = duration_days
        this.status = status
        this.speaker = speaker
        this.facilitator = facilitator
        this.attachment = attachment
        this.attachment_approval = attachment_approval
        this.training_training_notes = training_training_notes
        this.training_application = training_application
        this.training_attendee  = training_attendee
        this.training_absence_memo = training_absence_memo
        this.created_at = created_at
        this.created_by = created_by
        this.modified_at = modified_at
    }
}

export class TrainingType {
    public id: string
    public name: string
    public active: boolean
    public created_at: string
    public modified_at: string

    constructor(
        id: string,
        name: string,
        active: boolean,
        created_at: string,
        modified_at: string
    ) {
        this.id = id
        this.name = name
        this.active = active
        this.created_at = created_at
        this.modified_at = modified_at
    }
}

