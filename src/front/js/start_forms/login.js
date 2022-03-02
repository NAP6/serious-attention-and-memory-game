import { Form } from '../helper_models/Form.js';
import { LogController } from '../controller/LogController.js';

document.getElementById('btn_new_account').href += window.location.search;
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

btn_login.onclick = async ()=> {
    var user = form.getObject();
    var logedin = await LogController.login(user.email, user.password);

    if(form.valid_required_are_filled) {
        if(logedin.is_logged) {
            if(logedin.user == 'administrator') {
                window.location.href = `${window.location.origin}/admin${window.location.search}`;
            } else {
                window.location.href = `${window.location.origin}/patient${window.location.search}`;
            }
        } else {
            form.report_invalid_input('email', 'Usuario o contraseña invalidos');
        }
    }
}


