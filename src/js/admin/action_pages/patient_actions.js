import { PatientController } from '../../controller/PatientContoller.js';
import { start_table_admin_page } from '../start_table_admin_page.js';
import { Modal } from '../../helper_models/Modal.js';
import { start_history_page } from './history_patients.js';

var data = PatientController.getAll();
var nameLabels = ['ID', 'Nombre', 'Edad', 'Genero', 'Escolaridad', 'Residencia', 'País de esudio'];
var form_structure = {
    id: {
        type: 'number',
        label: 'ID',
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
    gender: {
        type: 'select',
        label: 'Genero',
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
        position: 7
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
    }
};


// Update
var open_update_modal = (obj)=> {
    pat.form.reset();
    pat.form.fill(obj);
    pat.form.get_input('id').disabled = true;
    pat.modal.changeSize(Modal.LARGE_SIZE);
    pat.modal.set_bodyContent(pat.form.form);
    pat.modal.title = 'Modificar Paciente';
    pat.modal.set_footerContent(pat.btn.update);
    pat.modal.toggle();
}

var on_updateButton = (obj, tr)=> {
    var obj = pat.form.getObject();
    pat.modal.hide();
    PatientController.update(obj)
    pat.table.update(tr, obj)
}

// Delete
var onDeleteHandler = (obj, tr)=> {
    pat.alert.fire({
      title: 'Borrar',
      text: '¿Esta seguro de que desea continuar?',
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
        showDenyButton: true,
    }).then((result)=> {
        if(result.isConfirmed) {
            var is_deleted = PatientController.delete(obj);
            if(is_deleted) {
                pat.table.remove(tr);
                pat.notyf.success('Se ha eliminado correctamente');
            } else
                pat.notyf.error('No se ha podido eliminar');
        } else {
            pat.notyf.open({
                type: 'warning',
                message: 'El eliminado ha sido cancelado'
            });
        }
    })
}

// Open History modal
var empty_div = document.createElement('div');
var open_history_modal = (obj, tr) => { 
    pat.modal.title = 'Historia del paciente';
    pat.modal.set_bodyContent(start_history_page(obj, pat.notyf));
    pat.modal.set_footerContent(empty_div);
    pat.modal.changeSize(Modal.FULL_SCREEN_SIZE);
    pat.modal.show();
};

var pat = start_table_admin_page({
    form_structure: form_structure,
    onExtraButton: open_history_modal,
    data: data,
    tableNameLabels: nameLabels,
    onUpdateHandler: open_update_modal,
    onDeleteHandler: onDeleteHandler,
    on_updateButton: on_updateButton,
    labelExtraButton: 'Ver Historial',
    titleExtraButton: 'Historial',
    table_keys: Object.keys(form_structure)
});
