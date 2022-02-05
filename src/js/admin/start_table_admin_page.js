import { Modal } from "./../helper_models/Modal.js";
import { Form } from "./../helper_models/Form.js";
import { Table } from './../helper_models/Table.js';
import { start_DataTable } from './../helper_models/DataTable_helper.js';

function start_table_admin_page(param) {
    // Get elements from Dom
    var modal_section = document.getElementById('modal_section');
    var btn_add = document.getElementById('btn_add');
    var container = document.getElementById('dataTable_contaier');

    // Create Modal Buttons
    var btn_create = document.createElement('button');
    btn_create.classList.add('btn', 'btn-dark');
    btn_create.innerText = 'Crear';

    var btn_update = document.createElement('button');
    btn_update.classList.add('btn', 'btn-dark');
    btn_update.innerText = 'Modificar';

    // Create Object of Models
    var modal = new Modal('modal_group', {
        title: 'Nuevo Grupo',
        onClick_toggle: btn_add,
        appendTo: modal_section,
    });

    var form = new Form('group_form', param.form_structure, modal.body);

    var table = new Table(param.data,{
        id: 'table_groups',
        names: param.tableNameLabels,
        onUpdateHandler: param.onUpdateHandler,
        onDeleteHandler: param.onDeleteHandler,
        extraButtonHandler: param.onExtraButton,
        extraButtonLabel: param.labelExtraButton,
        extraButtonTitle: param.titleExtraButton
    });

    // Add onClick events to buttons
    btn_add.onclick = param.on_addButton;
    btn_create.onclick = param.on_createButton;
    btn_update.onclick = param.on_updateButton;


    // Start DataTable
    container.innerHTML="";
    container.appendChild(table.table);
    start_DataTable(table.id);


    // Create Alert Objects
    var alert = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-outline-dark mx-2',
            denyButton: 'btn btn-dark mx-2'
        },
        buttonsStyling: false
    });


    var notyf = new Notyf({
        position: {
            x:'right',
            y: 'top'
        },
        types: [
            {
                type: 'warning',
                background: '#F5B759',
                icon: {
                    className: 'fas fa-exclamation-triangle',
                    tagName: 'span',
                    color: '#fff'
                },
            }
        ]
    });

    return {
        form: form,
        modal: modal,
        table: table,
        alert: alert,
        notyf: notyf,
        btn: {
            add: btn_add,
            create: btn_create,
            update: btn_update
        }
    }

}



export { start_table_admin_page };
