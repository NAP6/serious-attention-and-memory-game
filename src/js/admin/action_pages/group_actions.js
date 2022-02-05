import { GroupController } from '../../controller/GroupContoller.js';
import { start_table_admin_page } from '../start_table_admin_page.js';

var data = GroupController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];
var form_structure = {
    id: {
        type: 'number',
        label: 'ID',
        position_class: ['col-12', 'col-md-6'],
        //disabled: true
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
    grp.modal.title = 'Modificar Grupo';
    grp.modal.set_footerContent(grp.btn.update);
    grp.modal.toggle();
}

var on_updateButton = ()=> {
    var obj = grp.form.getObject();
    grp.modal.hide();
    GroupController.update(obj)
}

// Create
var open_create_modal = () => { 
    grp.form.reset();
    grp.form.enableAll();
    grp.modal.set_footerContent(grp.btn.create)
    grp.modal.title = 'Crear Grupo';
};

var on_create_button = ()=> {
    var is_valid = grp.form.valid_required_are_filled();
    if(is_valid) {
        var obj = grp.form.getObject();
        grp.modal.hide();
        GroupController.insert(obj)
        grp.table.apendObject(obj);
    }
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
            var is_deleted = GroupController.delete(obj);
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

var grp = start_table_admin_page({
    form_structure: form_structure,
    on_addButton: open_create_modal,
    on_createButton: on_create_button,
    data: data,
    tableNameLabels: nameLabels,
    onUpdateHandler: open_update_modal,
    onDeleteHandler: onDeleteHandler,
    on_updateButton: on_updateButton
});
