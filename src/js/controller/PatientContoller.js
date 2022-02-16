import { Patient } from "../models/Patient.js";
import { Group } from "../models/Group.js";

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

    static insert(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }
}

export { PatientController };
