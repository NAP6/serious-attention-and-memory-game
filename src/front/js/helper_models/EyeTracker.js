class EyeTracker {
    constructor(show_vision_point=false, show_camera=false) {
        try {
            webgazer
        } catch (e) {
            throw "WebGazer was not found:\n\n" +
            `Try to add '<script src="https://webgazer.cs.brown.edu/webgazer.js?" type="text/javascript" >'.\n` +
            "Or visit https://webgazer.cs.brown.edu for more information.";
        }

        this.is_builded = false;
        this.show_vision_point = show_vision_point;
        this.show_camera = show_camera;
    }

    async build() {
        webgazer.params.showVideoPreview = true;
        await webgazer.setRegression('ridge')
            // .setGazeListener(function(data, clock) {
            // //console.log(data);
            // //console.log(clock);
            // })
        .begin();

        webgazer.showVideoPreview(this.show_camera)
            .showPredictionPoints(this.show_vision_point)
            .applyKalmanFilter(true);
        this.is_builded = true;
    }

    async get_eye_position() {
        if(!this.is_builded)
            throw 'EyeTracker is not build';
        var prediction = await webgazer.getCurrentPrediction();
        if (prediction) {
            var x = prediction.x;
            var y = prediction.y;
            return {x: x, y:y};
        } else
            return this.get_eye_position();
    }

    async calibration_area(calculate_presition_handler) {
        if(!this.is_builded){
            await this.build();
        }
        var div = document.createElement('div');
        div.classList.add('eye_tracker_calibration_container');
        var canvas = document.createElement('canvas');
        canvas.id = 'plotting_canvas';
        canvas.style = "cursor:crosshair; width: 100vw; height: 100vh; position: fixed;";
        div.appendChild(canvas);
        var styles = [
            `top: 2vh; left: ${this.show_camera? '340px':'2vw'};`,
            "top: 2vh; left: 50vw;",
            "top: 2vh; right: 2vw;",
            "top: 50vh; left: 2vw;",
            "top: 50vh; left: 50vw; display: none;",
            "top: 50vh; right: 2vw;",
            "bottom: 2vh; left: 2vw;",
            "bottom: 2vh; left: 50vw",
            "bottom: 2vh; right: 2vw;",
        ];
        var calibration_points = {};
        var point_calibrate = 0;
        for(var i = 1; i <= 9; i++) {
            var input = document.createElement('input');
            input.type = 'button';
            input.classList.add('Calibration');
            input.id = `Pt${i}`;
            input.style = styles[i-1];
            calibration_points[input.id] = 0;
            input.onclick = (e)=> {
                var element = e.srcElement;
                calibration_points[element.id]++;
                if(calibration_points[element.id] == 5) {
                    element.style.backgroundColor = "yellow";
                    element.disabled = true;
                    point_calibrate++;
                } else if(calibration_points[element.id] < 5) {
                    var new_opacity = 0.2 * calibration_points[element.id] + 0.2;
                    element.style.opacity = `${new_opacity}`;
                }

                if(point_calibrate == 8) {
                    document.getElementById('Pt5').style.display = "";
                }

                if(point_calibrate >= 9) {
                    var inputs = document.getElementsByClassName('Calibration');
                    for(var ele of Array.from(inputs)) {
                        ele.style.display = "none";
                    };
                    document.getElementById('Pt5').style.display = "";

                    if(calculate_presition_handler) {
                        calculate_presition_handler(start_calulate_process);
                    } else {
                        alert('No muevas el raton y permanece viendo al circulo del centro');
                        start_calulate_process((precision_measurement)=>{
                            alert(`La prediction es de ${precision_measurement}`);
                        });
                    }
                }

            };
            div.appendChild(input);
        }
        return div;
    }
}

function start_calulate_process(finish_handler) {
    var canvas = document.getElementById("plotting_canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    store_points_variable();
    setTimeout(()=> {
        stop_storing_points_variable();
        var past50 = webgazer.getStoredPoints();
        var precision_measurement = calculatePrecision(past50);
        finish_handler(precision_measurement);
    }, 5000);
}


/*
* Sets store_points to true, so all the occuring prediction
* points are stored
*/
function store_points_variable(){
  webgazer.params.storingPoints = true;
}

/*
* Sets store_points to false, so prediction points aren't
* stored any more
*/
function stop_storing_points_variable(){
  webgazer.params.storingPoints = false;
}

/*
 * This function calculates a measurement for how precise 
 * the eye tracker currently is which is displayed to the user
 */
function calculatePrecision(past50Array) {
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  // Retrieve the last 50 gaze prediction points
  var x50 = past50Array[0];
  var y50 = past50Array[1];

  // Calculate the position of the point the user is staring at
  var staringPointX = windowWidth / 2;
  var staringPointY = windowHeight / 2;

  var precisionPercentages = new Array(50);
  calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
  var precision = calculateAverage(precisionPercentages);

  // Return the precision measurement as a rounded percentage
  return Math.round(precision);
};

/*
 * Calculate percentage accuracy for each prediction based on distance of
 * the prediction point from the centre point (uses the window height as
 * lower threshold 0%)
 */
function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
  for (var x = 0; x < 50; x++) {
    // Calculate distance between each prediction and staring point
    var xDiff = staringPointX - x50[x];
    var yDiff = staringPointY - y50[x];
    var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

    // Calculate precision percentage
    var halfWindowHeight = windowHeight / 2;
    var precision = 0;
    if (distance <= halfWindowHeight && distance > -1) {
      precision = 100 - (distance / halfWindowHeight * 100);
    } else if (distance > halfWindowHeight) {
      precision = 0;
    } else if (distance > -1) {
      precision = 100;
    }

    // Store the precision
    precisionPercentages[x] = precision;
  }
}

/*
 * Calculates the average of all precision percentages calculated
 */
function calculateAverage(precisionPercentages) {
  var precision = 0;
  for (var x = 0; x < 50; x++) {
    precision += precisionPercentages[x];
  }
  precision = precision / 50;
  return precision;
}

export { EyeTracker };
