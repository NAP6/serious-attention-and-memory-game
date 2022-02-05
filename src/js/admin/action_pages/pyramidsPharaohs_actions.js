import { PyramidsPharaohsController } from '../../controller/PyramidsPharaohsController.js';
import { start_table_admin_page } from '../start_table_admin_page.js';
import { Modal } from '../../helper_models/Modal.js';

var config_form = document.getElementById('config_game_template')
    .content.cloneNode(true).querySelector('div');
var data = PyramidsPharaohsController.getAll();
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
    pap.form.reset();
    pap.form.fill(obj);
    pap.form.get_input('id').disabled = true;
    pap.modal.title = 'Modificar Juego';
    pap.modal.set_footerContent(pap.btn.update);
    pap.modal.changeSize(Modal.LARGE_SIZE);
    pap.modal.set_bodyContent(pap.form.form);
    pap.modal.toggle();
};

var on_updateButton = (obj, tr)=> {
    var obj = pap.form.getObject();
    pap.modal.hide();
    PyramidsPharaohsController.update(obj)
    pap.table.update(tr, obj);
};

// Create
var open_create_modal = () => { 
    pap.form.reset();
    pap.form.enableAll();
    pap.modal.set_footerContent(pap.btn.create)
    pap.modal.title = 'Crear Juego';
    pap.modal.changeSize(Modal.LARGE_SIZE);
    pap.modal.set_bodyContent(pap.form.form);
};

var on_create_button = ()=> {
    var is_valid = pap.form.valid_required_are_filled();
    if(is_valid) {
        var obj = pap.form.getObject();
        pap.modal.hide();
        PyramidsPharaohsController.insert(obj)
        pap.table.add(obj);
    }
};

// Delete
var onDeleteHandler = (obj, tr)=> {
    pap.alert.fire({
      title: 'Borrar',
      text: '¿Esta seguro de que desea continuar?',
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
        showDenyButton: true,
    }).then((result)=> {
        if(result.isConfirmed) {
            var is_deleted = PyramidsPharaohsController.delete(obj);
            if(is_deleted) {
                pap.table.remove(tr);
                pap.notyf.success('Se ha eliminado correctamente');
            } else
                pap.notyf.error('No se ha podido eliminar');
        } else {
            pap.notyf.open({
                type: 'warning',
                message: 'El eliminado ha sido cancelado'
            });
        }
    })
};

// Open Config Game Modal
var open_config_game_modal = (obj, tr) => { 
    pap.modal.title = `Configuracion del Juego ${obj.name}`;
    pap.modal.set_bodyContent(load_game_config_form(obj));
    pap.modal.set_footerContent(document.createElement('div'));
    pap.modal.changeSize(Modal.FULL_SCREEN_SIZE);
    pap.modal.show();
};

var load_game_config_form =(obj)=> {
    // Charge info if it have
    return config_form;
};

var pap = start_table_admin_page({
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
    titleExtraButton: 'Configurar',
});
