import { PatientController } from "../controller/PatientContoller.js";
import { Table } from "../helper_models/Table.js";
import { TMT } from "../../../TMT.js";
import { PyramidsPharaohs } from "../../../PyramidsPharaohs.js";

var no_game_container = document.getElementById('no_games');
var game_list_container = document.getElementById('game_list');

var active_patient = await PatientController.get_active_patient();
var games_list = await PatientController.get_pending_games(active_patient.id);

if(games_list && games_list.length > 0) {
    game_list_container.classList.remove('d-none');
    no_game_container.classList.add('d-none');
    var table = new Table(games_list, {
        id: 'games_table',
        names: ['ID', 'Nombre', 'Grupo'],
        keys: ['id', 'name', 'group'],
        extraButtonTitle: 'Jugar',
        extraButtonLabel: "Jugar",
        extraButtonHandler:play_game
    });

    game_list_container.querySelector('#dataTable_contaier').appendChild(table.table);
} else {
    game_list_container.classList.add('d-none');
    no_game_container.classList.remove('d-none');
}

function play_game(game) {
    if(game instanceof TMT) {
        window.location.href = `${window.location.origin}/patient/tmt?game_id=${game.id}`;
    }
    else if(game instanceof PyramidsPharaohs) {
        window.location.href = `${window.location.origin}/patient/pdp?game_id=${game.id}`;
    }
}
