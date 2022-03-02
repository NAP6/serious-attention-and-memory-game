import { PatientController } from '../controller/PatientContoller.js';
import { MatchCrontroller } from '../controller/MatchController.js';
import { Table } from '../helper_models/Table.js';

var table_container = document.getElementById('dataTable_contaier');

var active_patient = await PatientController.get_active_patient()
var matches = await MatchCrontroller.get_by_patient(active_patient.id);
matches = matches.map((m)=> {
    if(m.game_time)
        m.game_time = Number(m.game_time.toFixed(2));
    if(m.score)
        m.score = Number(m.score.toFixed(2));
    if(m.adjusted_score)
        m.adjusted_score = Number(m.adjusted_score.toFixed(2));
    return m;
});

var table = new Table(matches, {
    id: 'matches_table',
    keys: ['game', 'group', 'date', 'game_time', 'score'],
    names: ['Juego', 'Grupo', 'Fecha', 'Tiempo de Juego', 'Puntaje'],
});

table_container.appendChild(table.table);
