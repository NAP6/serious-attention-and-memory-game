import { TMT, TMTPoint } from '../../models/TMT.js';

function load_game_config_form(game, alert, notyf, onSave) {
    var config_form = document.getElementById('config_game_template')
        .content.cloneNode(true);
    var select_levels = config_form.querySelector('#select_tmt_level');
    var btn_add = config_form.querySelector('#btn_plus');
    var btn_minus = config_form.querySelector('#btn_minus');
    var points_container = config_form.querySelector('#points_container');
    var edit_image = config_form.querySelector('#editin_image');
    var btn_upload_image = config_form.querySelector('#upload_image');
    var label_upload_image = config_form.querySelector('#upload_image_label');
    var point_size = config_form.querySelector('#point_size');
    var btn_delete = config_form.querySelector('#btn_delete_level');

    var i = 0;
    var obj = new TMT(game.id, game.name, game.description, game.group, game.maximum_attempsts);
    var active_points = [];
    var NOT_LEVEL_SELECTED = -6;

    if(game.levels.length > 0) {
        for(i =0; i < game.levels.length; i++){
            var points_copy = [];
            for(var p of game.levels[i].points){
                points_copy.push(new TMTPoint(p.diameter, p.left, p.top, p.ax_left, p.ax_top, p.ax_width, p.ax_heigth));
            }
            create_level(i, game.levels[i].image, points_copy);
        }
    }
    
    var btn_new_lavel = config_form.querySelector('div #add_new_lavel');
    btn_new_lavel.onclick = ()=> {
        create_level(i++);
    }


    var btn_save = document.createElement('button');
    btn_save.classList.add('btn', 'btn-dark');
    btn_save.innerText = 'Guardar Cambios';
    btn_save.onclick = ()=> {
        onSave(obj);
    };

    select_levels.onchange = change_level_event;
    btn_add.onclick = btn_add_point;
    btn_minus.onclick = btn_remove_points;
    btn_upload_image.onclick= charge_image;
    window.onresize = resize;
    point_size.onchange = resize_points;
    btn_delete.onclick = delete_level;

    return {
        body: config_form,
        footer: btn_save
    };

    function create_level(index, image=null, points=[]) {
        var new_level = obj.add_level(image, points);
        charge_level(new_level);
        var option = document.createElement('option');
        option.value = index;
        option.innerText = `Nivel ${index}`;
        select_levels.appendChild(option);
        select_levels.value = index;
    }

    function charge_level(level) {
        if(level){
            edit_image.src = level.image;
            if(level.image && level.image != '')
                edit_image.classList.remove('d-none');
            else
                edit_image.classList.add('d-none');
            label_upload_image.value = level.label_image;
            var executed = false;
            function load_points() {
                if(edit_image.src && edit_image.src != '') {
                    active_points.every((itm)=> {itm.remove(); return true;});
                    active_points = [];
                    if(edit_image.width != 0 && edit_image.height !=0 && !executed) {
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
            edit_image.classList.add('d-none');
            edit_image.src = '';
            label_upload_image.value = '';
            active_points.every((itm)=> {itm.remove(); return true;});
            active_points = [];
        }
    }

    function btn_add_point() {
        if(select_levels.value != NOT_LEVEL_SELECTED && 
            Object.values(edit_image.classList).indexOf('d-none') == -1
        ) {
            var point = print_point()
            obj.levels[select_levels.value].points.push(point);
        } else if(select_levels.value == NOT_LEVEL_SELECTED)
            notyf.error('No existe un nivel seleccionado');
        else
            notyf.error('Debe agregar primero una imagen');
    }

    function print_point(point=null) {
        var circle = document.createElement('div');
        circle.classList.add('points');
        if(!point) {
           var x_position = edit_image.offsetLeft;
           var y_position = edit_image.offsetTop;
           var x_image = edit_image.offsetLeft;
           var y_image = edit_image.offsetTop;
           var w_image = edit_image.width;
           var h_image = edit_image.height;
            var diameter = point_size.value? point_size.value : 50;
           var point = new TMTPoint(diameter, x_position, y_position, x_image, y_image, w_image, h_image);
        }

        point_size.value = point.diameter;
        points_container.appendChild(circle);
        active_points.push(circle);
        var pos = point.recalculate_inner_position(
            edit_image.offsetLeft,
            edit_image.offsetTop,
            edit_image.width,
            edit_image.height
        );
        circle.style.top = `${pos.y}px`;
        circle.style.left = `${pos.x}px`;
        circle.style.width = pos.diameter + 'px';
        circle.style.height = pos.diameter + 'px';
        circle.innerText = active_points.length;


        circle.onmousedown = (event)=> {
            var shift_x = circle.offsetLeft;
            var shift_y = circle.offsetTop;
            var actual_diameter = point_size.value;

            move_at(event.pageX, event.pageY);

            function move_at(pageX, pageY) {
                var pos_x = pageX - event.clientX + shift_x;
                var pos_y = pageY - event.clientY + shift_y;
                circle.style.left = pos_x + 'px';
                circle.style.top = pos_y + 'px';
                point.setPosition(actual_diameter, pos_x, pos_y, edit_image.offsetLeft, edit_image.offsetTop, edit_image.width, edit_image.height);
            }

            function on_mouse_move(event) {
                move_at(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', on_mouse_move);

            circle.onmouseup = ()=> {
                document.removeEventListener('mousemove', on_mouse_move);
                circle.onmouseup = null;
            }
        };
        circle.ondragstart = ()=> {return false;};
        return point;
    }

    function btn_remove_points() {
        if(active_points.length > 0) {
            var circle = active_points.pop();
            circle.remove();
            obj.levels[select_levels.value].points.pop();
        }
    }

    function change_level_event () {
        edit_image.src = '';
        charge_level(obj.levels[select_levels.value])
    }

    function charge_image() {
        var input = document.getElementById('input_img').cloneNode(true);
        input.onchange = ()=> {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const uploaded_image = reader.result;
                obj.levels[select_levels.value].image = uploaded_image;
                obj.levels[select_levels.value].label_image = input.files[0].name;
                charge_level(obj.levels[select_levels.value]);
            });
            reader.readAsDataURL(input.files[0]);
            label_upload_image.value = input.files[0].name;
        };
        if(select_levels.value != NOT_LEVEL_SELECTED)
            input.click();
        else 
            notyf.error('No existe un nivel seleccionado');
    }

    function resize() {
        var new_diameter = point_size.value;
        for(var i =0; i < active_points.length; i++){
            var pos = obj.levels[select_levels.value].points[i].
                recalculate_inner_position(
                    edit_image.offsetLeft,
                    edit_image.offsetTop,
                    edit_image.width,
                    edit_image.height
            );
            active_points[i].style.left = pos.x + 'px';
            active_points[i].style.top = pos.y + 'px';
            active_points[i].style.width = pos.diameter + 'px';
            active_points[i].style.height = pos.diameter + 'px';
            new_diameter = pos.diameter;
        }
        point_size.value = new_diameter;
    }

    function resize_points() {
        var diameter = point_size.value;
        for(var i =0; i < active_points.length; i++){
            obj.levels[select_levels.value].points[i].diameter = parseInt(diameter);
            active_points[i].style.width = diameter + 'px';
            active_points[i].style.height = diameter + 'px';
        }
    }

    function delete_level() {
        var level_to_delete = select_levels.value;
        console.log('eliminar nivel')
        if(level_to_delete != -6) {
            var options = select_levels.querySelectorAll('option');
            Array.from(options).every((option)=> {
                console.log(option.innerText, option.value)
                if(option.value == level_to_delete) {
                    option.remove();
                    obj.remove_level(level_to_delete);
                    charge_level();
                    i--;
                } else if(parseInt(option.value) > parseInt(level_to_delete)) {
                    option.value = parseInt(option.value) - 1;
                    option.innerText = 'Nivel ' + option.value;
                }
                return true;
            });
        } else {
            notyf.error('No se ha seleccionado un nivel para eliminar');
        }
    }
}

export { load_game_config_form };
