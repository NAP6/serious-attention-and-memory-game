import { TMTController } from '../../controller/TMTController.js';
import { set_on_game_start, eye_tracker } from '../game_start.js';

var active_points = [];
var points_container = document.getElementById('points_container');
var game_image = document.getElementById('game_image');
var correct_next_pos = 0;
var index_level = -1;

var search_params_string = window.location.search;
var search_params = new URLSearchParams(search_params_string);
var id = search_params.get('game_id');
var tmt = TMTController.getById(id);
set_on_game_start(next_level);

function next_level() {
    index_level++;
    correct_next_pos = 0;
    if(index_level>=tmt.levels.length)
        finish_game();
    else {
        Swal.fire(
          `Nivel ${index_level+1}`,
          'Preciona Ok para inicar',
          'info'
        ).then(()=>{
            charge_level(tmt.levels[index_level]);
        });
    }
}

function finish_game() {
        Swal.fire(
          `Terminaste`,
          'En hora buena, has terminado todos los niveles, porfavor envianos los datos',
          'info'
        ).then(()=>{
            console.log('enviar datos')
            active_points.every((itm)=> {itm.remove(); return true;});
            active_points = [];
        });
}

function charge_level(level) {
    if(level){
        game_image.src = level.image;
        var executed = false;
        function load_points() {
            if(game_image.src && game_image.src != '') {
                active_points.every((itm)=> {itm.remove(); return true;});
                active_points = [];
                if(game_image.width != 0 && game_image.height !=0 && !executed) {
                    executed = true;
                    for(let point of level.points) {
                        print_point(point);
                    }
                } else if(!executed) {
                    setTimeout(load_points,200);
                }
            }
        }
        load_points();
    } else {
        game_image.classList.add('d-none');
        game_image.src = '';
        label_upload_image.value = '';
        active_points.every((itm)=> {itm.remove(); return true;});
        active_points = [];
    }
}

function print_point(point=null) {
    var circle = document.createElement('div');
    circle.classList.add('points');

    points_container.appendChild(circle);
    active_points.push(circle);
    var pos = point.recalculate_inner_position(
        game_image.offsetLeft,
        game_image.offsetTop,
        game_image.width,
        game_image.height
    );
    circle.style.top = `${pos.y}px`;
    circle.style.left = `${pos.x}px`;
    circle.style.width = pos.diameter + 'px';
    circle.style.height = pos.diameter + 'px';
    var index = active_points.length - 1;
    circle.onclick = ()=> {
        answer(point, circle, index);
    };

    return point;
}

function answer(point, element, pos) {
    if(pos == correct_next_pos) {
        correct_point(point, element);
        correct_next_pos++;
    } else {
        error_point(point, element)
    }
    if(correct_next_pos == active_points.length) {
        next_level();
    }
    record_event();
}

function correct_point(point, element) {
    element.classList.add('sucssess');
}

async function error_point(point, element) {
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

async function record_event() {
    var eye = await eye_tracker.get_eye_position();
    console.log(eye);
}
