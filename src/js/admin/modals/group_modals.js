import { Modal } from "./Modal.js";
import { Form } from "../forms/Form.js";

var modal_section = document.getElementById('modal_section');
var add_button = document.getElementById('btn-addGroup');

var modal = new Modal('add_modal', {
    title: 'Nuevo Grupo',
    onClick_toggle: add_button,
    appendTo: modal_section,
});

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

var form = new Form('group_form', form_structure, modal.body);

var btn_create = document.createElement('button');
btn_create.classList.add('btn', 'btn-dark');
btn_create.innerText = 'Crear';
modal.set_footerContent(btn_create);

add_button.onclick = () => { 
    form.reset();
    form.enableAll();
    modal.set_footerContent(btn_create)
    modal.title = 'Crear Grupo';
};

btn_create.onclick = ()=> {
    var is_valid = form.valid_required_are_filled();
    if(is_valid) {
        var content = form.getObject();
        modal.hide();
        console.log(content);
    }
}


export { modal, form };
