export class User {
    public id: string
    public full_name: string
    public staff_id: string
    public nric: string
    public email: string
    public mobile: string
    public gender: string
    public user_type: string
    public organisation: string
    public grade: string
    public position: string
    public salary_code: string
    public department: string
    public marital_type: string
    public religion: string
    public race: string
    public profile_picture: string
    public is_active: boolean

    constructor(
        id: string,
        full_name: string,
        staff_id: string,
        nric: string,
        email: string,
        mobile: string,
        gender: string,
        user_type: string,
        organisation: string,
        grade: string,
        position: string,
        salary_code: string,
        department: string,
        marital_type: string,
        religion: string,
        race: string,
        profile_picture: string,
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
        this.grade = grade
        this.position = position
        this.salary_code = salary_code
        this.department = department
        this.marital_type = marital_type
        this.religion = religion
        this.race = race
        this.profile_picture = profile_picture
        this.is_active = is_active
    }
}