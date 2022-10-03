import { MatchCrontroller } from '../../controller/MatchController.js';
import { PyramidsPharaohsController } from '../../controller/PyramidsPharaohsController.js';
import { Match } from '../../../../Match.js';
import { set_on_game_start, eye_tracker } from '../game_start.js';

var index_level = -1;
var eye_tracking_interval_id;
var interval_milisecons_to_capture_eye_position = 500;
var number_of_correct_answers = 0;
var number_of_answer_found = 0;
var active_points = [];
var exaple_group = document.getElementById('example_group_container');
var answer_group = document.getElementById('answer_group_container');

var search_params_string = window.location.search;
var search_params = new URLSearchParams(search_params_string);
var id = search_params.get('game_id');
var pap = await PyramidsPharaohsController.getById(id);
var this_match = new Match(null, pap, pap.group);
this_match = await MatchCrontroller.create_header(this_match);
set_on_game_start(game_start);

function game_start(eye_tracker_precision) {
    next_level();
    this_match.eye_tracker_precision_estimate = eye_tracker_precision;
}

function next_level() {
    if(index_level + 1 >= pap.levels.length) {
        this_match.finish_level(index_level);
        finish_game();
    } else {
        index_level++;
        Swal.fire(
          `Nivel ${index_level+1}`,
          'Preciona Ok para inicar',
          'info'
        ).then(()=>{
            number_of_answer_found = 0;
            number_of_correct_answers = 0;
            charge_level(pap.levels[index_level], index_level);
            if(index_level == 0) {
                this_match.start();
                eye_tracking_interval_id = setInterval(record_eye_tracking, interval_milisecons_to_capture_eye_position);
            } else
                this_match.finish_level(index_level - 1);
            this_match.start_level(index_level)
        });
    }
}

function finish_game() {
    this_match.finish();
    clearInterval(eye_tracking_interval_id);
    document.getElementById('album_container').remove();
    Swal.fire(
      `Terminaste`,
      'En hora buena, has terminado todos los niveles, porfavor envianos los datos',
      'info'
    ).then(async ()=>{
        document.getElementById('sending_match').classList.remove('d-none');
        await MatchCrontroller.update_body(this_match);
        window.location.href = `${window.location.origin}/patient`;
    });
}

async function answer(point, element, index_point, level_index, is_example, is_correct_answer) {
    if(is_example) {
        await error_point(point, element, index_point, level_index, 'pp_example');
    } else {
        if(is_correct_answer) {
            await correct_point(point, element, index_point, level_index, 'pp_answer');
            number_of_answer_found++;
        } else {
            await error_point(point, element, index_point, level_index, 'pp_answer');
        }
    }
    if(number_of_correct_answers == number_of_answer_found) {
        next_level();
    }
}

async function correct_point(point, element, index_point, level_index, group_name) {
    await record_event(point, element, true, index_point, level_index, group_name);
    element.classList.add('sucssess');
}

async function error_point(point, element, index_point, level_index, group_name) {
    await record_event(point, element, false, index_point, level_index, group_name);
    var time = 100;
    element.classList.add('error');
    await delay(time);
    element.classList.remove('error');
    await delay(time);
    element.classList.add('error');
    await delay(time);
    element.classList.remove('error');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function record_event(point, element, is_correct, index_point, level_index, group_name) {
    var eye = await eye_tracker.get_eye_position();
    const event = this_match.register_event(
        level_index,
        group_name,
        index_point, 
        element.offsetTop,
        element.offsetLeft,
        element.offsetWidth,
        element.offsetHeight,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        is_correct,
        eye.x,
        eye.y
    );
    MatchCrontroller.save_event(this_match, event);
}

async function record_eye_tracking() {
    var eye = await eye_tracker.get_eye_position();
    const point = this_match.register_eye_position(eye.x, eye.y);
    MatchCrontroller.save_ET_point(this_match, point);
}

function charge_level(level, level_index) {
    if(level){
        number_of_correct_answers = level.pp_answer.filter((img)=>{ return img.selected }).length;
        active_points.every((itm)=> {itm.remove(); return true;});
        active_points = [];
        for(let image of level.pp_example) {
            var elem = chage_image(image, level_index, true);
            exaple_group.appendChild(elem);
            active_points.push(elem);
        }
        for(let image of level.pp_answer) {
            var elem = chage_image(image, level_index, false);
            answer_group.appendChild(elem);
            active_points.push(elem);
        }
    }
}

function chage_image(image='', level_index, is_example) {
    var image_item = document.getElementById('album_image_template')
        .content.cloneNode(true);
    var container = image_item.querySelector('.album-container');
    container.classList.add('patient_game');
    container.children[0].style.backgroundImage = `url(${image.image})`;
    var index_image;
    var is_correct_answer = false;
    if(is_example) {
        container.classList.add('example');
        index_image = pap.levels[level_index].pp_example.indexOf(image);
    } else {
        is_correct_answer = image.selected;
        container.classList.add('answer');
        index_image = pap.levels[level_index].pp_answer.indexOf(image);
    }
    container.onclick = ()=>{ answer(image, container, index_image, level_index, is_example, is_correct_answer); };

    return image_item.querySelector('div');
}
