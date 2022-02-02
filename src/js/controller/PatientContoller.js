import { Patient } from "../models/Patient.js";

class PatientController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new Patient(1, "Name by id", "description by id");
        return group;
    }

    static getAll() {
        var list = [];
        for(var i=0; i < 50; i++) {
            list.push(new Patient(i, `Paciente ${i}`, `Descripcion ${i}`));
        }
        return list;
    }

}

export { PatientController };
