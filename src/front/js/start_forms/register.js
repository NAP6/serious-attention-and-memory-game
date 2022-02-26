import { Form } from '../helper_models/Form.js';
import { LogController } from '../controller/LogController.js';
import { AdministratorController } from '../controller/AdministratorController.js';
import { PatientController } from '../controller/PatientContoller.js';

document.getElementById('btn_have_account').href += window.location.search;
var container = document.getElementById('register_form_container');
var btn_select_admin = document.getElementById('btn_select_admin');
var btn_select_patient = document.getElementById('btn_select_patient');
var btn_register = document.getElementById('btn_register');
var profile_image = document.getElementById('profile_image');
var profile_image_input = document.getElementById('profile_image_input');
var form;
var loaded_image = "";
var user_is_admin = null;

var form_admin_structure = {
    name: {
        type: 'text',
        label: 'Nombres',
    },
    email: {
        type: 'email',
        label: 'Correo electronico',
    },
    password: {
        type: 'password',
        label: 'Contraseña',
    },
    confirm_password: {
        type: 'password',
        label: 'Confirmar Contraseña',
    },
};

var form_patient_structure = {
    group: {
        type: 'text',
        label: 'Codigo de Grupo'
    },
    passport: {
        type: 'text',
        label: 'Cedula / Pasaporte',
        position_class: ['col-12', 'col-md-6'],
    },
    name: {
        label: 'Nombre',
        position_class: ['col-12', 'col-md-6']
    },
    age: {
        type: 'number',
        label: 'Edad',
        position_class: ['col-12', 'col-md-6']
    },
    schooling: {
        label: 'Escolaridad',
        position_class: ['col-12', 'col-md-6']
    },
    residence: {
        label: 'Residencia',
        position_class: ['col-12', 'col-md-6']
    },
    country_of_study: {
        label: 'País de estudio',
        position_class: ['col-12', 'col-md-6']
    },
    gender: {
        type: 'select',
        label: 'Genero',
        position_class: ['col-12', 'col-md-6'],
        options: {
            masculino: {
                value: 'Masculino',
                text: 'Masculino'
            },
            femenino: {
                value: 'Femenino',
                text: 'Femenino'
            }
        },
    },
    email: {
        type: 'email',
        label: 'Correo Electronico',
        position_class: ['col-12', 'col-md-6'],
    },
    password: {
        type: 'password',
        label: 'Contraseña',
    },
    confirm_password: {
        type: 'password',
        label: 'Confirmar Contraseña',
    },
};

btn_select_admin.onclick = ()=> {
    user_is_admin = true;
    form = new Form('register_form', form_admin_structure, container);
    show_form_content();
}

btn_select_patient.onclick = ()=> {
    user_is_admin = false;
    form = new Form('register_form', form_patient_structure, container);
    show_form_content();
    var query = window.location.search;
    var params = new URLSearchParams(query);
    if(params.get('groupCode')){
        var input = form.get_input('group');
        input.value = params.get('groupCode');
        input.disabled = true;
    }
}

btn_register.onclick = async ()=> {
    if(user_is_admin != null) {
        var is_valid = form.valid_required_are_filled();
        if(is_valid) {
            var obj = form.getObject();
            if(obj.password == obj.confirm_password) {
                if(await LogController.search_email(obj.email)) {
                    form.report_invalid_input('email', 'El correo ya esta en uso');
                } else {
                    var id = await LogController.register(obj.email, obj.password, (user_is_admin) ? 'Administrator' : 'Patient');
                    if(id) {
                        obj.image = loaded_image;
                        if(user_is_admin) {
                            var admin = await AdministratorController.toClass(obj);
                            var is_registed = await AdministratorController.insert(admin, id);
                            if(is_registed) {
                                await LogController.login(obj.email, obj.password)
                                window.location.href = `${window.location.origin}/admin${window.location.search}`;
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Algo salio mal no se pudo completar el registro'
                                })
                                await LogController.delete(id);
                            }
                        } else {
                            var patient = await PatientController.toClass(obj);
                            var is_registed = await PatientController.insert(patient, id, obj.group);
                            if(is_registed) {
                                await LogController.login(obj.email, obj.password)
                                window.location.href = `${window.location.origin}/patient`;
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Algo salio mal no se pudo completar el registro'
                                })
                                await LogController.delete(id);
                            }
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal no se pudo completar el registro'
                        })
                    }
                }
            } else {
                form.report_invalid_input('confirm_password', 'Las contraseñas no coinciden');
            }
        }
    }
}

profile_image.onclick = ()=> {
    var input = profile_image_input.cloneNode(true);
    input.onchange = ()=> {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const uploaded_image = reader.result;
            profile_image.src = uploaded_image;
            loaded_image = uploaded_image;
        });
        reader.readAsDataURL(input.files[0]);
    };
    input.click();
}

function show_form_content() {
    btn_register.classList.remove('d-none');
    container.classList.remove('d-none');
    document.getElementById('register_type_container').classList.add('d-none');
}
