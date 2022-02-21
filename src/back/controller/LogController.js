import { AdministratorController } from "./AdministratorController.js";
import { PatientController } from "./PatientContoller.js";

class LogController {
    static login(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var admin = 'admin@ejemplo.com';
        var patient = 'patient@ejemplo.com';
        var is_logged = ((email == admin || email == patient) && password == '123');
        var resp;
        if(is_logged) {
            resp = {
                status: 'ok',
                is_logged: is_logged,
                user: email == admin? 'administrator': 'patient',
                message: 'El Usuario se ha logueado con exito'
            }
            req.session.is_logged = resp.is_logged;
            req.session.user_type = resp.user;
            if(resp.user == 'administrator') 
                req.session.active_user = AdministratorController.getById(1);
            else
                req.session.active_user = PatientController.getById(1);
            
        } else {
            resp = {
                status: 'error',
                is_logged: is_logged,
                user: '',
                message: 'Usuario no Encontrado'
            }
        }
        res.json(resp);
    }

    static logout(req, res) {
        req.session.is_logged = false;
        req.session.user_type = '';
        req.session.active_user = null;
        res.json({is_logout: true});
    }

    static search_email(req, res) {
        var email = req.body.email;
        if(email && (email == 'admin@ejemplo.com' || email == 'patient@ejemplo.com')) {
            res.json({is_email_found: true});
        } else {
            res.json({is_email_found: false});
        }
    }

    static register(req, res) {
        var email = req.body.email;
        var password = req.body.password;
            res.json({inserted_id: 1});
    }

    static delete(req, res) {
        var id = req.body.id;
        res.json({is_deleted: true});
    }
}

export { LogController };
