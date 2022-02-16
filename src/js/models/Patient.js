class Patient {

    constructor(id, name, age, gender, schooling, residence, country_of_study, image=null) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.schooling = schooling;
        this.residence = residence;
        this.country_of_study = country_of_study;
        this.image=image;
    }

}

export { Patient };
