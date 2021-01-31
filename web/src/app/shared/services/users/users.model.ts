export class User {
    public id: string
    public full_name: string
    public staff_id: string
    public nric: string
    public email: string
    public mobile: string
    public service_status: string
    public gender: string
    public user_type: string
    public organisation: string
    public appointed_at: string
    public confirmed_at: string
    public department_code: string
    public section_code: string
    public grade_code: string
    public position: string
    public salary_code: string
    public department: string
    public marital_type: string
    public religion: string
    public race: string
    public profile_picture: string
    public is_first_login: boolean
    public is_active: boolean

    constructor(
        id: string,
        full_name: string,
        staff_id: string,
        nric: string,
        email: string,
        mobile: string,
        service_status: string,
        gender: string,
        user_type: string,
        organisation: string,
        appointed_at: string,
        confirmed_at: string,
        department_code: string,
        section_code: string,
        grade_code: string,
        position: string,
        salary_code: string,
        department: string,
        marital_type: string,
        religion: string,
        race: string,
        profile_picture: string,
        is_first_login: boolean,
        is_active: boolean
    ) {
        this.id = id
        this.full_name = full_name
        this.staff_id = staff_id
        this.nric = nric
        this.email = email
        this.mobile = mobile
        this.gender = gender
        this.user_type = user_type
        this.organisation = organisation
        this.service_status = service_status
        this.appointed_at = appointed_at
        this.confirmed_at = confirmed_at
        this.department_code = department_code
        this.section_code = section_code
        this.grade_code = grade_code
        this.position = position
        this.salary_code = salary_code
        this.department = department
        this.marital_type = marital_type
        this.religion = religion
        this.race = race
        this.profile_picture = profile_picture
        this.is_first_login = is_first_login
        this.is_active = is_active
    }
}