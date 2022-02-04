import { PatientController } from '../../controller/PatientContoller.js';
import { start_group } from './start_patient.js';
import { Modal } from '../../helper_models/Modal.js';

var data = PatientController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];
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
    description: {
        type: 'textarea',
        label: 'Descripcion',
        required: false
    }
};


// Update
var open_update_modal = (obj)=> {
    grp.form.reset();
    grp.form.fill(obj);
    grp.form.get_input('id').disabled = true;
    grp.modal.changeSize(Modal.LARGE_SIZE);
    grp.modal.set_bodyContent(grp.form.form);
    grp.modal.title = 'Modificar Paciente';
    grp.modal.set_footerContent(grp.btn.update);
    grp.modal.toggle();
}

var on_updateButton = ()=> {
    var obj = grp.form.getObject();
    grp.modal.hide();
    PatientController.update(obj)
}

// Delete
var onDeleteHandler = (obj, tr)=> {
    grp.alert.fire({
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
                tr.remove();
                grp.notyf.success('Se ha eliminado correctamente');
            } else
                grp.notyf.error('No se ha podido eliminar');
        } else {
            grp.notyf.open({
                type: 'warning',
                message: 'El eliminado ha sido cancelado'
            });
        }
    })
}

// Open History modal
var open_history_modal = () => { 
    grp.modal.title = 'Historia del paciente';
    grp.modal.set_bodyContent(document.createElement('div'));
    grp.modal.set_footerContent(document.createElement('div'));
    grp.modal.changeSize(Modal.FULL_SCREEN_SIZE);
    grp.modal.show();
};

var grp = start_group({
    form_structure: form_structure,
    onExtraButton: open_history_modal,
    data: data,
    tableNameLabels: nameLabels,
    onUpdateHandler: open_update_modal,
    onDeleteHandler: onDeleteHandler,
    on_updateButton: on_updateButton
});
