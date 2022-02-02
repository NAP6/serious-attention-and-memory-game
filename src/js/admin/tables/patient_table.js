import { Table } from './Table.js';
import { start_DataTable } from './DataTable_helper.js';
import { PatientController } from '../../controller/PatientContoller.js';

var data = PatientController.getAll();
var nameLabels = ['ID', 'Nombre', 'Descripcion'];

var table = new Table(data,{
    names: nameLabels,
    onUpdateHandler: (obj)=> { console.log('modificar: ', obj) },
    onDeleteHandler: (obj)=> { console.log('eliminar: ', obj) },
    extraButtonHandler: (obj)=> { console.log('extra: ', obj) },
    extraButtonLabel: 'Ver Historial',
    extraButtonTitle: 'Historial'
});
var container = document.getElementById('dataTable_group_contaier');
container.innerHTML="";
container.appendChild(table.table);

table.id = 'table_patients';
start_DataTable(table.id);
