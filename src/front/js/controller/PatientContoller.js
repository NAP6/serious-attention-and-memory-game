import { Patient } from "../../../Patient.js";
import { post_api } from "../helper_models/post_api.js";
import { GroupController } from "./GroupContoller.js";

class PatientController {
    static toClass(obj) {
        var patient = new Patient(obj.id, obj.name, obj.age, obj.gender, obj.schooling, obj.residence, obj.country_of_study, obj.image);
        return patient;
    }

    static async get_active_patient() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/patient/get_active_patient`, data);
        console.log(res);
        return res;
    }

    static async getAll() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/patient/getAll`, data);
        res = res.map((p) => { return PatientController.toClass(p); });
        console.log(res);
        return res;
    }

    static async get_list_of_groups(patient_id) {
        var data = {patient_id: patient_id};
        var res = await post_api(`${window.location.origin}/api/patient/get_list_of_groups`, data);
        res = res.map((g) => { return GroupController.toClass(g); });
        console.log(res);
        return res;
    }

    static async update(patient) {
        var data = {patient: patient};
        var res = await post_api(`${window.location.origin}/api/patient/update`, data);
        return res.is_updated;
    }

    static async delete(patient) {
        var data = {patient: patient};
        var res = await post_api(`${window.location.origin}/api/patient/delete`, data);
        return res.is_deleted;
    }

    static async insert(patient, user_id, group_code) {
        var data = {patient: patient, user_id: user_id, group_code: group_code};
        var res = await post_api(`${window.location.origin}/api/patient/insert`, data);
        return res.is_inserted;
    }

    static async get_pending_games(patient_id) {
        var data = {patient_id: patient_id};
        var res = await post_api(`${window.location.origin}/api/patient/get_pending_games`, data);
        console.log(res);
        return res;
    }

    static async add_to_group(group_id) {
        var data = {group_id: group_id};
        var res = await post_api(`${window.location.origin}/api/patient/add_to_group`, data);
        return res.is_added;
    }
}

export { PatientController };
