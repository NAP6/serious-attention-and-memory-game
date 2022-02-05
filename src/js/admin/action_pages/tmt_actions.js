import { TMTController } from '../../controller/TMTController.js';
import { start_table_admin_page } from '../start_table_admin_page.js';
import { Modal } from '../../helper_models/Modal.js';

var data = TMTController.getAll();
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
    tmt.form.reset();
    tmt.form.fill(obj);
    tmt.form.get_input('id').disabled = true;
    tmt.modal.title = 'Modificar Juego';
    tmt.modal.set_footerContent(tmt.btn.update);
    tmt.modal.changeSize(Modal.LARGE_SIZE);
    tmt.modal.set_bodyContent(tmt.form.form);
    tmt.modal.toggle();
}

var on_updateButton = (obj, tr)=> {
    var obj = tmt.form.getObject();
    tmt.modal.hide();
    TMTController.update(obj)
    tmt.table.update(tr, obj);
}

// Create
var open_create_modal = () => { 
    tmt.form.reset();
    tmt.form.enableAll();
    tmt.modal.set_footerContent(tmt.btn.create)
    tmt.modal.title = 'Crear Juego';
    tmt.modal.changeSize(Modal.LARGE_SIZE);
    tmt.modal.set_bodyContent(tmt.form.form);
};

var on_create_button = ()=> {
    var is_valid = tmt.form.valid_required_are_filled();
    if(is_valid) {
        var obj = tmt.form.getObject();
        tmt.modal.hide();
        TMTController.insert(obj)
        tmt.table.add(obj);
    }
}

// Delete
var onDeleteHandler = (obj, tr)=> {
    tmt.alert.fire({
      title: 'Borrar',
      text: '¿Esta seguro de que desea continuar?',
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
        showDenyButton: true,
    }).then((result)=> {
        if(result.isConfirmed) {
            var is_deleted = TMTController.delete(obj);
            if(is_deleted) {
                tmt.table.remove(tr);
                tmt.notyf.success('Se ha eliminado correctamente');
            } else
                tmt.notyf.error('No se ha podido eliminar');
        } else {
            tmt.notyf.open({
                type: 'warning',
                message: 'El eliminado ha sido cancelado'
            });
        }
    })
}

// Open Config Game Modal
var open_config_game_modal = (obj, tr) => { 
    tmt.modal.title = `Configuracion del Juego ${obj.name}`;
    tmt.modal.set_bodyContent(document.createElement('div'));
    tmt.modal.set_footerContent(document.createElement('div'));
    tmt.modal.changeSize(Modal.FULL_SCREEN_SIZE);
    tmt.modal.show();
};

var tmt = start_table_admin_page({
    form_structure: form_structure,
    on_addButton: open_create_modal,
    on_createButton: on_create_button,
    data: data,
    tableNameLabels: nameLabels,
    onUpdateHandler: open_update_modal,
    onDeleteHandler: onDeleteHandler,
    on_updateButton: on_updateButton,
    onExtraButton: open_config_game_modal,
    labelExtraButton: 'Configurar Juego',
    titleExtraButton: 'Configurar'
});
