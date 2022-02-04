import { Table } from './Table.js';
import { start_DataTable } from './DataTable_helper.js';
import { GroupController } from '../../controller/GroupContoller.js';
import { modal, form } from '../modals/group_modals.js';

var data = GroupController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];

var table = new Table(data,{
    names: nameLabels,
    onUpdateHandler: onUpdateHandler,
    onDeleteHandler: (obj)=> { console.log('eliminar: ', obj) }
});

var container = document.getElementById('dataTable_group_contaier');
container.innerHTML="";
container.appendChild(table.table);

table.id = "table_groups";
start_DataTable(table.id);

var btn_modificar = document.createElement('button');
btn_modificar.classList.add('btn', 'btn-dark');
btn_modificar.innerText = 'Modificar';

function onUpdateHandler(obj) {
    form.reset();
    form.fill(obj);
    form.get_input('id').disabled = true;
    modal.title = 'Modificar Grupo';
    modal.set_footerContent(btn_modificar);
    modal.toggle();
}

btn_modificar.onclick = ()=> {
    var obj = form.getObject();
    modal.hide();
    console.log(obj);
}
