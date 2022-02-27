import { PyramidsPharaohsController } from '../../controller/PyramidsPharaohsController.js';
import { AdministratorController } from '../../controller/AdministratorController.js';
import { start_table_admin_page } from '../start_table_admin_page.js';
import { Modal } from '../../helper_models/Modal.js';
import { load_game_config_form } from './configGame_pyramidsPharaohs.js';

var data = await PyramidsPharaohsController.getAll();
var active_patient = await AdministratorController.get_active_adminitrator();
var group_list = await AdministratorController.get_groups_of(active_patient.id);
var options_group = group_list.map((g)=> {
    var option = {
        value: g.id,
        text: g.name
    }
    return option;
})
var nameLabels = ['ID', 'Nombre', 'Grupo', 'Intentos', 'Descripcion'];
var form_structure = {
    id: {
        type: 'number',
        label: 'ID',
        position_class: ['col-12', 'col-md-6'],
        disabled: true,
        required: false
    },
    name: {
        label: 'Nombre',
        position_class: ['col-12', 'col-md-6']
    },
    group: {
        type: 'select',
        label: 'Grupo',
        options: options_group
    },
    maximum_attempsts: {
        type: 'number',
        label: 'Numero maximo de intentos'
    },
    description: {
        type: 'textarea',
        label: 'Descripcion',
        required: false
    },
};


// Update
var open_update_modal = (obj, tr)=> {
    pap.form.reset();
    pap.form.fill(obj);
    // pap.form.get_input('id').disabled = true;
    pap.modal.title = 'Modificar Juego';
    pap.modal.set_footerContent(pap.btn.update);
    pap.modal.changeSize(Modal.LARGE_SIZE);
    pap.modal.set_bodyContent(pap.form.form);
    pap.modal.toggle();
    pap.btn.update.onclick = ()=> { on_updateButton(obj, tr); };
};

var on_updateButton = async (obj_old, tr)=> {
    var obj = pap.form.getObject();
    obj_old.name = obj.name;
    obj_old.group = obj.group;
    obj_old.maximum_attempts = obj.maximum_attempts;
    obj_old.description = obj.description;
    console.log(obj_old);
    var new_obj = await PyramidsPharaohsController.toClass(obj_old);
    console.log(new_obj);
    pap.modal.hide();
    await PyramidsPharaohsController.update(new_obj);
    pap.table.update(tr, new_obj);
};

// Create
var open_create_modal = () => { 
    pap.form.reset();
    // pap.form.enableAll();
    pap.modal.set_footerContent(pap.btn.create)
    pap.modal.title = 'Crear Juego';
    pap.modal.changeSize(Modal.LARGE_SIZE);
    pap.modal.set_bodyContent(pap.form.form);
};

var on_create_button = async ()=> {
    var is_valid = pap.form.valid_required_are_filled();
    if(is_valid) {
        var obj = pap.form.getObject();
        pap.modal.hide();
        var classObj = await PyramidsPharaohsController.toClass(obj);
        await PyramidsPharaohsController.insert(classObj);
        pap.table.add(classObj);
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
    }).then(async (result)=> {
        if(result.isConfirmed) {
            var is_deleted = await PyramidsPharaohsController.delete(obj);
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
    });
};

// Open Config Game Modal
var open_config_game_modal = (obj, tr) => { 
    var save = (new_obj)=> { on_save_config_game_modal(new_obj, tr); };
    var config = load_game_config_form(obj, pap.alert, pap.notyf, save);
    pap.modal.title = `Configuracion del Juego ${obj.name}`;
    pap.modal.set_bodyContent(config.body);
    pap.modal.set_footerContent(config.footer);
    pap.modal.changeSize(Modal.FULL_SCREEN_SIZE);
    pap.modal.show();
};

var on_save_config_game_modal = async (obj, tr)=> {
    await PyramidsPharaohsController.update(obj)
    pap.table.update(tr, obj);
    pap.modal.hide();
}

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
    table_keys: Object.keys(form_structure)
});
