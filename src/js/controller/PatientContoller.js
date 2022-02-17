import { Patient } from "../models/Patient.js";
import { Group } from "../models/Group.js";
import { TMTController } from "./TMTController.js";
import { PyramidsPharaohsController } from "./PyramidsPharaohsController.js";

class PatientController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new Patient('0104438643', "Fabian Nicolas Alvarez Palacios", 24, 'Masculino', 'Estudios universitarios', 'Cuenca', 'Ecuador');
        return group;
    }

    static getAll() {
        var list = [];
        for(var i=0; i < 50; i++) {
            list.push(new Patient(i, `Paciente ${i}`, Math.floor(Math.random() * 11) + 60, ['Masculino', 'Femenino'][(Math.random()>=0.5)? 1 : 0], `Escolaridad ${i}`, `Cuenca`, `Ecuador`));
        }
        return list;
    }

    static get_list_of_groups(patient_id) {
        var group_list = [];
        for(var i = 0; i < 3; i++) {
            group_list.push(new Group(i, 'Grupo '+i, 'Descripcion'));
        }
        return group_list;
    }

    static aux_alertar = false;
    static update(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static delete(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static insert(obj, user_id, group_code) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static get_active_patient() {
        return new Patient(1, 'Nicolas', 24, 'Masculino', 'Tercer Nivel', 'Cuenca', 'Ecuador', null);
    }

    static get_pending_games(patient_id) {
        var games = [];
        games.push(TMTController.getById(1));
        games.push(PyramidsPharaohsController.getById(1));

        return games;
    }

    static toClass(obj) {
        var patient = new Patient('', obj.name, obj.age, obj.gender, obj.schooling, obj.residence, obj.country_of_study, obj.image);
        return patient;
    }
}

export { PatientController };
