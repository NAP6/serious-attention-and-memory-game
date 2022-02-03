import { Modal } from "./Modal.js";

$(document).ready( function () {
    var modal_section = document.getElementById('modal_section');
    var add_button = document.getElementById('btn-addGroup');

    var modal_add = new Modal('add_modal', {
        title: 'Nuevo Grupo',
        onClick_toggle: add_button,
        appendTo: modal_section,
        closeButton_label: 'Cancelar y salir',
        footer_visible: false
    });

    //modal_add.set_bodyContent(div);

});
