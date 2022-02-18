import { EyeTracker } from '../helper_models/EyeTracker.js';

var tutorial_section = document.getElementById('tuorial_section');
var calibrate_eye_tracker_section = document.getElementById('calibrate_eye_tracker_section');
var game_section = document.getElementById('game_section');

var btn_skip_tutorial = document.getElementById('btn_skip_tutorial');
btn_skip_tutorial.onclick = ()=> {
    tutorial_section.classList.add('d-none');
    calibrate_eye_tracker_section.classList.remove('d-none');

    start_calibration_area();
}

async function start_calibration_area() {
    var eye_traacker = new EyeTracker();
    eye_traacker.build();
    Swal.fire({
        icon: 'info',
        title: 'Calibracion EyeTracker',
        text: 'Preciona 5 veces cada circulo hasta que se vuelva de color amarillo'
    });
    var calibration_area = await eye_traacker.calibration_area((start_calulate_process)=> {
        Swal.fire({
            icon: 'info',
            title: 'Calibracion EyeTracker',
            text: 'No dejes de ver el circulo del centro y no muevas el raton'
        }).then(()=>{
            start_calulate_process((precision)=> {
                console.log(precision);
                start_game();
            })
        })
    });
    calibrate_eye_tracker_section.appendChild(calibration_area);
}

function start_game() {
    calibrate_eye_tracker_section.remove();
    game_section.classList.remove('d-none');
}
