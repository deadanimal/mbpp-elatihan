export class User {
    public id: string
    public full_name: string
    public new_nric: string
    public old_nric: string
    public staff_id: string
    public email: string
    public telephone_number: string
    public salary_code: string
    public grade: string
    public position: string
    public address: string
    public emergency_contact: string
    public emergency_number: string
    public profile_picture: string
    public user_type: string
    public gender_type: string
    public department_type: string
    public marital_type: string
    public religion_type: string
    public race_type: string
    public is_first_login: boolean

    constructor(
        id: string,
        full_name: string,
        new_nric: string,
        old_nric: string,
        staff_id: string,
        email: string,
        telephone_number: string,
        salary_code: string,
        grade: string,
        position: string,
        address: string,
        emergency_contact: string,
        emergency_number: string,
        profile_picture: string,
        user_type: string,
        gender_type: string,
        department_type: string,
        marital_type: string,
        religion_type: string,
        race_type: string,
        is_first_login: boolean
    ){
        this.id = id
        this.full_name = full_name
        this.new_nric = new_nric
        this.old_nric = old_nric
        this.staff_id = staff_id
        this.email = email
        this.telephone_number = telephone_number
        this.salary_code = salary_code
        this.grade = grade
        this.position = position
        this.address = address
        this.emergency_contact = emergency_contact
        this.emergency_number = emergency_number
        this.profile_picture = profile_picture
        this.user_type = user_type
        this.gender_type = gender_type
        this.department_type = department_type
        this.religion_type = religion_type
        this.marital_type = marital_type
        this.race_type = race_type
        this.is_first_login = is_first_login
    }
}

export class TokenResponse {
    public refresh: string
    public access: string

    constructor(
        refresh: string,
        access: string
    ){
        this.refresh = refresh
        this.access = access
    }
}

export class Registration {
    public username: string
    public email: string
    public password1: string
    public password2: string

    constructor(
        username: string,
        email: string,
        password1: string,
        password2: string
    ){
        this.username = username
        this.email = email
        this.password1 = password1
        this.password2 = password2
    }
}