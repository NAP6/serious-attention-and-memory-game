import { GroupController } from '../../controller/GroupContoller.js';
import { start_table_admin_page } from '../start_table_admin_page.js';
import { Modal } from '../../helper_models/Modal.js';

var data = await GroupController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];
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
    // grp.form.get_input('id').disabled = true;
    grp.modal.title = 'Modificar Grupo';
    grp.modal.set_bodyContent(grp.form.form);
    grp.modal.set_footerContent(grp.btn.update);
    grp.modal.changeSize(Modal.LARGE_SIZE);
    grp.modal.show();
}

var on_updateButton = async (obj, tr)=> {
    var obj = grp.form.getObject();
    grp.modal.hide();
    await GroupController.update(obj)
    grp.table.update(tr, obj);
}

// Create
var open_create_modal = () => { 
    grp.form.reset();
    // grp.form.enableAll();
    grp.modal.set_footerContent(grp.btn.create)
    grp.modal.set_bodyContent(grp.form.form);
    grp.modal.changeSize(Modal.LARGE_SIZE);
    grp.modal.title = 'Crear Grupo';
};

var on_create_button = async ()=> {
    var is_valid = grp.form.valid_required_are_filled();
    if(is_valid) {
        var obj = grp.form.getObject();
        grp.modal.hide();
        var group_id = await GroupController.insert(obj)
        obj.id = group_id;
        grp.table.add(obj);
    }
}

// Delete
var onDeleteHandler = async (obj, tr)=> {
    grp.alert.fire({
      title: 'Borrar',
      text: '¿Esta seguro de que desea continuar?',
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
        showDenyButton: true,
    }).then(async (result)=> {
        if(result.isConfirmed) {
            var is_deleted = await GroupController.delete(obj);
            if(is_deleted) {
                grp.table.remove(tr);
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
var empty_div = document.createElement('div');
var open_invitation_modal = (obj, tr) => { 
    grp.modal.title = 'Invitación de ' + obj.name;
    grp.modal.set_bodyContent(load_invitation_modal(obj));
    grp.modal.set_footerContent(empty_div);
    grp.modal.changeSize(Modal.SMALL_SIZE);
    grp.modal.show();
};

var load_invitation_modal =(obj)=> {
    // Charge info if it have
    var config_form = document.getElementById('invitation_group_template')
        .content.cloneNode(true);
    var btn_copy = config_form.querySelector('#btn_copy');
    btn_copy.onclick = ()=> {
        navigator.clipboard.writeText(`
Bienbenido al proyecto 'Patito'
Has sido invitado a participar del gurpo
de investigacion '${obj.name}'.
Para leer la descripcion del grupo y
unirte para colaborar en ese, accede al
siguiente enlace:
${window.location.origin}/invitation?groupCode=${obj.name}-${obj.id}
        `);
        grp.notyf.success('La invitacion ha sido copiada en el portapapeles.');
    };
    return config_form;
};

var grp = start_table_admin_page({
    form_structure: form_structure,
    on_addButton: open_create_modal,
    on_createButton: on_create_button,
    data: data,
    tableNameLabels: nameLabels,
    onUpdateHandler: open_update_modal,
    onDeleteHandler: onDeleteHandler,
    on_updateButton: on_updateButton,
    onExtraButton: open_invitation_modal,
    labelExtraButton: 'Link de Invitación',
    titleExtraButton: 'Invitar'
});
