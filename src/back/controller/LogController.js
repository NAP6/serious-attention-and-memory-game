import { AdministratorController } from "./AdministratorController.js";
import { PatientController } from "./PatientContoller.js";
import { database } from "../database/database.js";

class LogController {
    static async login(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var [rows, fields] = await database.query(`call type_of_user('${email}', '${password}')`);
        var resp;
        if(rows && rows[0][0]) {
            var user = rows[0][0].user;
            resp = {
                status: 'ok',
                is_logged: true,
                user: user.type,
                message: 'El Usuario se ha logueado con exito'
            }
            req.session.is_logged = resp.is_logged;
            req.session.user_type = resp.user;
            if(resp.user == 'Administrator') 
                req.session.active_user = await AdministratorController.getById(user.id);
            else
                req.session.active_user = await PatientController.getById(user.id);
        } else {
            resp = {
                status: 'error',
                is_logged: false,
                user: '',
                message: 'Usuario no Encontrado'
            }
        }
        res.json(resp);
    }

    static async logout(req, res) {
        req.session.is_logged = false;
        req.session.user_type = '';
        req.session.active_user = null;
        res.json({is_logout: true});
    }

    static async search_email(req, res) {
        var email = req.body.email;
        var [rows, fields] = await database.query(`call is_email_exist('${email}')`);
        if(!rows) res.json({is_email_found: false});
        else {
            var is_email_found = rows[0][0].result.is_exist == 1;
            res.json({is_email_found: is_email_found});
        }
    }

    static async register(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var type = req.body.type;
        var [rows, fields] = await database.query(`call register_user('${email}', '${password}', '${type}')`);
        if(!rows) res.json({is_registered: false});
        else{
            var inserted_id = rows[0][0].result.inserted_id;
            res.json({inserted_id: inserted_id});
        }
    }

    static async delete(req, res) {
        var id = req.body.id;
        var [rows, fields] = await database.query(`call delete_user('${id}')`);
        if(!rows) res.json({is_deleted: false});
        else {
            var is_deleted = rows[0][0].result.is_deleted;
            res.json({is_deleted: is_deleted});
        }
    }
}

export { LogController };
