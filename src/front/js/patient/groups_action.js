import { GroupController } from '../controller/GroupContoller.js';
import { Table } from '../helper_models/Table.js';

var table_container = document.getElementById('dataTable_contaier');

var groups = await GroupController.getAll();

var table = new Table(groups, {
    id: 'groups_table',
    keys: ['id', 'name', 'description'],
    names: ['ID', 'Nombre', 'Descripcion'],
});

table_container.appendChild(table.table);
