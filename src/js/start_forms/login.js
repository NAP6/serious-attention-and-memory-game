import { Form } from '../helper_models/Form.js';
import { AdministratorController } from '../controller/AdministratorController.js';
import { PatientController } from '../controller/PatientContoller.js';

var container = document.getElementById('login_form_container');
var form_structure = {
    email: {
        type: 'email',
        label: 'Correo electronico',
    },
    password: {
        type: 'password',
        label: 'Contraseña',
    },
};
var form = new Form('login_form', form_structure, container);
var btn_login = document.getElementById('btn_login');

btn_login.onclick = ()=> {
    var user = form.getObject();
    var logedin = AdministratorController.login(user.email, user.password);
    if(logedin.is_valid) {
        window.location.href = `${window.location.origin}/admin_portal/dashboard.html`
    } else {
        logedin = PatientController.login(user.email, user.password);
        if(logedin.is_valid)
            alert('redirigir portal de paciente')
        else {
            form.reset();
            form.report_invalid_input('email', 'Usuario o contraseña invalidos');
        }
    }
}


