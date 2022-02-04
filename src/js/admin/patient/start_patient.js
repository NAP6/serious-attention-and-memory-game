import { Modal } from "../../helper_models/Modal.js";
import { Form } from "../../helper_models/Form.js";
import { Table } from '../../helper_models/Table.js';
import { start_DataTable } from '../../helper_models/DataTable_helper.js';

function start_group(param) {
    // Get elements from Dom
    var modal_section = document.getElementById('modal_section');
    var btn_add = document.getElementById('btn-addGroup');
    var container = document.getElementById('dataTable_contaier');

    // Update Modal Buttons
    var btn_update = document.createElement('button');
    btn_update.classList.add('btn', 'btn-dark');
    btn_update.innerText = 'Modificar';

    // Create Object of Models
    var modal = new Modal('my_modal', {
        title: 'Modificar Paciente',
        onClick_toggle: btn_add,
        appendTo: modal_section,
    });

    var form = new Form('my_form', param.form_structure, modal.body);

    var table = new Table(param.data,{
        id: 'my_table',
        names: param.tableNameLabels,
        onUpdateHandler: param.onUpdateHandler,
        onDeleteHandler: param.onDeleteHandler,
        extraButtonHandler: param.onExtraButton,
        extraButtonLabel: 'Ver Historial',
        extraButtonTitle: 'Historial'
    });

    // Add onClick events to buttons
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
            update: btn_update
        }
    }

}



export { start_group };
