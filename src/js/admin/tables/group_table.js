import { Table } from './Table.js';
import { start_DataTable } from './DataTable_helper.js';
import { GroupController } from '../../controller/GroupContoller.js';

var data = GroupController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];

var table = new Table(data,{
    names: nameLabels,
    onUpdateHandler: (obj)=> { console.log('modificar: ', obj) },
    onDeleteHandler: (obj)=> { console.log('eliminar: ', obj) }
});
var container = document.getElementById('dataTable_group_contaier');
container.innerHTML="";
container.appendChild(table.table);

table.id = "table_groups";
start_DataTable(table.id);
