import { MatchCrontroller } from '../../controller/MatchController.js';
import { PatientController } from '../../controller/PatientContoller.js';
import { Table } from '../../helper_models/Table.js';

async function start_history_page(obj, notyf) {
    var config_form = document.getElementById('config_game_template')
        .content.cloneNode(true);

    var id = config_form.querySelector('#profile_id');
    var name = config_form.querySelector('#profile_name');
    var age = config_form.querySelector('#profile_age');
    var gender = config_form.querySelector('#profile_gender');
    var schooling = config_form.querySelector('#profile_schooling');
    var residence = config_form.querySelector('#profile_residence');
    var country_of_study = config_form.querySelector('#profile_country_of_study');
    var profile_image = config_form.querySelector('#profile_image');
    var list_group = config_form.querySelector('#list_group');

    id.innerText                = obj.id;
    name.innerText              = obj.name;
    age.innerText               = obj.age;
    gender.innerText            = obj.gender;
    schooling.innerText         = obj.schooling;
    residence.innerText         = obj.residence;
    country_of_study.innerText  = obj.country_of_study;
    if(obj.image)
        profile_image.src       = obj.image;

    var group_list = await PatientController.get_list_of_groups(obj.id);
    for(var o of group_list){
        var li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerText = o.name;
        list_group.appendChild(li);
    }


    var dataTable_match_contaier = config_form.querySelector('#dataTable_match_contaier');

    var data = await MatchCrontroller.get_by_patient(obj.id);
    data = data.map((m)=> {
        if(m.game_time)
            m.game_time = Number(m.game_time.toFixed(2));
        if(m.score)
            m.score = Number(m.score.toFixed(2));
        if(m.adjusted_score)
            m.adjusted_score = Number(m.adjusted_score.toFixed(2));
        return m;
    });
    var table_match = new Table(data, {
        id: 'match_table',
        keys: ['game', 'group', 'date', 'game_time', 'score', 'adjusted_score'],
        names: ['Juego', 'Grupo', 'Fecha', 'Tiempo de Juego', 'Puntaje', 'Puntaje Ajustado'],
        extraButtonHandler: adjusted_score_handler,
        extraButtonLabel: 'Modificar',
        extraButtonTitle: 'Modificar Puntaje Ajustado'
    });

    dataTable_match_contaier.appendChild(table_match.table);

    return config_form;

    function adjusted_score_handler(obj, tr) {
        $(document).off('focusin.modal');
        Swal.fire({
            title: 'Puntaje Ajustado',
            input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            stopKeydownPropagation: false,
            customClass: {
                confirmButton: 'btn btn-dark mx-2',
                cancelButton: 'btn btn-outline-dark mx-2'
            },
            buttonsStyling: false
        })
        .then(async (result) => {
            if(result.isConfirmed) {
                var before_adjusted_score = obj.adjusted_score;
                obj.adjusted_score = Number(result.value);
                var is_updated = await MatchCrontroller.update(obj);
                if(is_updated) {
                    table_match.update(tr, obj);
                    notyf.success('El Puntaje Ajustado ha sido actualizado');
                } else {
                    obj.adjusted_score = before_adjusted_score;
                    notyf.error('No se ha podido actualizar el Puntaje Ajustado');
                }
            }
        });
    }
}

export { start_history_page };
