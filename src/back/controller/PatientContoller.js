import { Patient } from "../../models/Patient.js";
import { Group } from "../../models/Group.js";
import { TMTController } from "./TMTController.js";
import { PyramidsPharaohsController } from "./PyramidsPharaohsController.js";

class PatientController {
    static async getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new Patient('0104438643', "Fabian Nicolas Alvarez Palacios", 24, 'Masculino', 'Estudios universitarios', 'Cuenca', 'Ecuador');
        return group;
    }

    static toClass(obj) {
        var patient = new Patient('', obj.name, obj.age, obj.gender, obj.schooling, obj.residence, obj.country_of_study, obj.image);
        return patient;
    }

    static async get_active_patient(req, res) {
        var patient = new Patient(1, 'Nicolas', 24, 'Masculino', 'Tercer Nivel', 'Cuenca', 'Ecuador', null);
        res.json(patient);
    }

    static async getAll(req, res) {
        var list = [];
        for(var i=0; i < 50; i++) {
            list.push(new Patient(i, `Paciente ${i}`, Math.floor(Math.random() * 11) + 60, ['Masculino', 'Femenino'][(Math.random()>=0.5)? 1 : 0], `Escolaridad ${i}`, `Cuenca`, `Ecuador`));
        }
        res.json(list);
    }

    static async get_list_of_groups(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);
        var group_list = [];
        for(var i = 0; i < 3; i++) {
            group_list.push(new Group(i, 'Grupo '+i, 'Descripcion'));
        }
        res.json(group_list);
    }

    static async update(req, res) {
        var patient = req.body.patient;
        console.log(patient);
        res.json({is_updated: true});
    }

    static async delete(req, res) {
        console.log('Entra en delete')
        var patient = req.body.patient;
        console.log(patient);
        res.json({is_deleted: true});
    }

    static async insert(req, res) {
        var patient = req.body.patient;
        var user_id = req.body.user_id;
        var group_code = req.body.group_code;
        console.log(patient);
        console.log(user_id);
        console.log(group_code);

        res.json({is_inserted: true});
    }

    static async get_pending_games(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);
        var games = [];

        games.push(await TMTController.getById(1));
        games.push(await PyramidsPharaohsController.getById(1));

        res.json(games);
    }

    static async add_to_group(req, res) {
        var group_id = req.body.group_id;
        console.log(group_id);
        res.json({is_added: true});
    }
}

export { PatientController };
