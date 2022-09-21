import { MatchCrontroller } from '../../controller/MatchController.js';
import { TMTController } from '../../controller/TMTController.js';
import { Match } from '../../../../Match.js';
import { set_on_game_start, eye_tracker } from '../game_start.js';

var active_points = [];
var points_container = document.getElementById('points_container');
var game_image = document.getElementById('game_image');
var correct_next_pos = 0;
var index_level = -1;
var eye_tracking_interval_id;
var interval_milisecons_to_capture_eye_position = 100;

var is_a_tmt_tutorial = false;

var search_params_string = window.location.search;
var search_params = new URLSearchParams(search_params_string);
var id = search_params.get('game_id');
var tmt = await TMTController.getById(id);
var this_match = new Match(null, tmt, tmt.group);
this_match = await MatchCrontroller.create_header(this_match);
var is_drawing = false;
set_on_game_start(game_start);
window.onresize = resize;

function game_start(eye_tracker_precision) {
    is_a_tmt_tutorial = false;
    next_level();
    this_match.eye_tracker_precision_estimate = eye_tracker_precision;
}

function next_level() {
    init_draw_on_canvas();
    game_image.src = "";
    game_image.classList.add('d-none');
    active_points.every((itm)=> {itm.html.remove(); return true;});
    active_points = [];
    if((index_level + 1 >= tmt.levels.length) && !is_a_tmt_tutorial) {
        try {
            this_match.finish_level(index_level);
            finish_game();
        } catch (e) {
            console.log(e);
            Swal.fire(
                `Oops`,
                'Parece que este juego no esta bien configurado, comunicate con el administrador',
                'info'
            ).then(async () => {
                window.location.href = `${window.location.origin}/patient`;
            });
        }
    } else {
        is_a_tmt_tutorial = !is_a_tmt_tutorial;
        var instructions;
        var level;
        if(is_a_tmt_tutorial) {
            index_level++;
            instructions = tmt.levels[index_level].tmt_tutorial.instructions;
            level = tmt.levels[index_level].tmt_tutorial;
        } else {
            instructions = tmt.levels[index_level].instructions;
            level = tmt.levels[index_level];
        }
        correct_next_pos = 0;
        Swal.fire(
          `Nivel ${index_level+1}`,
          instructions +
          '</br> Preciona Ok para inicar',
          'info'
        ).then(()=>{
            charge_level(level, index_level);
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

function charge_level(level, level_index) {
    if(level){
        game_image.src = level.image;
        game_image.classList.remove('d-none');
        var executed = false;
        function load_points() {
            if(game_image.src && game_image.src != '') {
                active_points.every((itm)=> {itm.html.remove(); return true;});
                active_points = [];
                if(game_image.width != 0 && game_image.height !=0 && !executed) {
                    executed = true;
                    for(let point of level.points) {
                        print_point(point, level_index);
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
        active_points.every((itm)=> {itm.html.remove(); return true;});
        active_points = [];
    }
}

function print_point(point=null, level_index) {
    var circle = document.createElement('div');
    circle.classList.add('points');

    points_container.appendChild(circle);
    active_points.push({"html":circle, "object": point});
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
    var index_point = active_points.length - 1;
    circle.addEventListener('mouseenter', ()=>{
        if (is_drawing) answer(point, circle, index_point, level_index);
    });
    circle.addEventListener('click', ()=>{
        if (is_drawing) answer(point, circle, index_point, level_index);
        else console.log('se hizo un click en el circulo, pero no esta dibujando')
    });
    //circle.onclick = ()=> {
    //    answer(point, circle, index_point, level_index);
    //};

    return point;
}

async function answer(point, element, index_point, level_index) {
    if(index_point == correct_next_pos) {
        await correct_point(point, element, index_point, level_index);
        correct_next_pos++;
    } else {
        await error_point(point, element, index_point, level_index);
        correct_next_pos += 666;
    }
    if(correct_next_pos == active_points.length) {
        next_level();
    }
}

async function correct_point(point, element, index_point, level_index) {
    await record_event(point, element, true, index_point, level_index);
    element.classList.add('sucssess');
}

async function error_point(point, element, index_point, level_index) {
    await record_event(point, element, false, index_point, level_index);
    var time = 100;
    element.classList.add('error');
    //await delay(time);
    //element.classList.remove('error');
    //await delay(time);
    //element.classList.add('error');
    //await delay(time);
    //element.classList.remove('error');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function record_event(point, element, is_correct, index_point, level_index) {
    var eye = await eye_tracker.get_eye_position();
    const event = this_match.register_event(
        level_index,
        'points',
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


function resize() {
    for(var i =0; i < active_points.length; i++){
        var pos = active_points[i].object.
            recalculate_inner_position(
                game_image.offsetLeft,
                game_image.offsetTop,
                game_image.width,
                game_image.height
        );
        active_points[i].html.style.left = pos.x + 'px';
        active_points[i].html.style.top = pos.y + 'px';
        active_points[i].html.style.width = pos.diameter + 'px';
        active_points[i].html.style.height = pos.diameter + 'px';
    }
}

function init_draw_on_canvas() {
    var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext('2d');
    let coord = {x: 0, y: 0};

    document.addEventListener('mousedown', start);
    document.addEventListener('mouseup', stop);
    window.addEventListener('resize', resize_canvas);
    resize_canvas();

    function resize_canvas() {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    function start(event) {
        document.addEventListener('mousemove', draw);
        reposition(event);
        is_drawing = true;
    }

    function reposition(event) {
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;
    }

    function stop() {
        is_drawing = false;
        document.removeEventListener('mousemove', draw);
        correct_next_pos = 0;
        Array.prototype.forEach.call(
            document.getElementsByClassName('points'), (itm)=>{
                itm.classList.remove('sucssess');
                itm.classList.remove('error');
        });
        init_draw_on_canvas();
    }

    function draw(event) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#00ff00';
        ctx.moveTo(coord.x, coord.y);
        reposition(event);  
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
    }
}