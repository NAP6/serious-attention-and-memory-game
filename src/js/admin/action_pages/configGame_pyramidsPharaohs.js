import { PyramidsPharaohs, PPImage } from '../../models/PyramidsPharaohs.js';

function load_game_config_form(game, alert, notyf) {
    var config_form = document.getElementById('config_game_template')
        .content.cloneNode(true);

    var level_container = config_form.querySelector('div #level_acordion');

    var i = 0;
    var obj = new PyramidsPharaohs(game.id, game.name, game.description);


    if(game.levels.length > 0) {
        for(var i=0; i < game.levels.length; i++) {
            var level = create_level(i, game.levels[i].example, game.levels[i].answer)
            level_container.appendChild(level);
        }
    }

    var btn_new_lavel = config_form.querySelector('div #add_new_lavel');
    btn_new_lavel.onclick = ()=> {
        level_container.appendChild(create_level(i++));
    }

    return config_form;


    function create_level(index, example=[], answer=[]) {
        var new_level = obj.add_level();
        var level_item = document.getElementById('accordion_album_item_template')
            .content.cloneNode(true);
        var item_id = `level_item_container_${index}`
        level_item.querySelector('div').id = item_id;

        var title = level_item.querySelector('div').getElementsByTagName('h5')[0];
        var button = title.getElementsByTagName('button')[0];
        var content_container = level_item.querySelector('div').getElementsByTagName('div')[0];
        var delete_level = content_container.querySelector('#btn_close_level_0');

        title.id = `album_${index}_item_header`;
        content_container.id = `album_${index}_item_content`;
        content_container.setAttribute('aria-labelledby', title.id);
        button.setAttribute('data-bs-target', `#${content_container.id}`);
        button.setAttribute('aria-controls', content_container.id);
        button.innerText = `Nivel ${index + 1}`;
        delete_level.id = `btn_close_level_${index}`

        var exaple_group = level_item.getElementById('example_group_container');
        var answer_group = level_item.getElementById('answer_group_container');
        
        exaple_group.id += `_${index}`;
        answer_group.id += `_${index}`;

        for(var i=0; i< example.length; i++){
            var image_item = create_img_item(new_level, example.get(i));
            exaple_group.appendChild(image_item);
        }
        exaple_group.appendChild(create_img_item(new_level));

        for(var i=0; i< answer.length; i++){
            var image_item = create_img_item(new_level, answer.get(i), true);
            answer_group.appendChild(image_item);
        }
        answer_group.appendChild(create_img_item(new_level));
        
        delete_level.onclick = ()=> { onDeleteLevelEvent(new_level, item_id); };

        return level_item;
    }

    function create_img_item(level, image=null, answer=false) {
        var image_item = document.getElementById('album_image_template')
            .content.cloneNode(true);

        var container = image_item.querySelector('.album-container');

        if(image == null) {
            container.classList.add('add-new-image');
            container.onclick = ()=>{ onAddEvent(level, container); };
        } else if(answer){
            level.answer.push(image);
            container.classList.add('answer');
            if(image.selected)
                container.classList.add('selected');
            container.children[0].style.backgroundImage = `url(${image.image})`;
            container.onclick = ()=>{ onOptionEvent(level, image, container, true); };
        } else {
            level.example.push(image);
            container.children[0].style.backgroundImage = `url(${image.image})`;
            container.onclick = ()=>{ onDeleteEvent(level, image, container); };
        }

        return image_item;
    }

    function onAddEvent(level, element) {
        var input = document.getElementById('input_img').cloneNode(true);
        input.onchange = ()=> {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const uploaded_image = reader.result;
                element.children[0].style.backgroundImage = `url(${uploaded_image})`;
                element.classList.remove('add-new-image');
                var super_container = element.parentNode.parentNode;
                super_container.appendChild(create_img_item(level));
                if(Object.values(super_container.classList).indexOf('answer') == -1){
                    var image_added = level.example.push(uploaded_image);
                    element.onclick = ()=>{ onDeleteEvent(level, image_added, element); };
                } else {
                    var image_added = level.answer.push(uploaded_image);
                    element.classList.add('answer');
                    element.onclick = ()=>{ onOptionEvent(level, image_added, element); };
                }
            });
            reader.readAsDataURL(input.files[0]);
        };
        input.click();

    }

    function onDeleteEvent(level,  image, element, answer=false) {
        alert.fire({
          title: 'Borrar',
          text: '¿Esta seguro de que desea continuar?',
          icon: 'warning',
          confirmButtonText: 'Eliminar',
          denyButtonText: 'Cancelar',
            showDenyButton: true,
        }).then((result)=> {
            if(result.isConfirmed) {
                var pos;
                if(answer) {
                    var pos = level.answer.indexOf(image);
                    if(pos != -1)
                        level.answer.remove(pos);
                } else {
                    var pos = level.example.indexOf(image);
                    if(pos != -1)
                        level.example.remove(pos);
                }
                if(pos != -1) {
                    element.parentNode.remove();
                    notyf.success('Se ha eliminado correctamente');
                } else {
                    notyf.error('No ha podido eliminar');
                }
            } else {
                notyf.open({
                    type: 'warning',
                    message: 'El eliminado ha sido cancelado'
                });
            }
        });
    }

    function onOptionEvent(index, image, element) {
        var is_selected = Object.values(element.classList).indexOf('selected') != -1;
        alert.fire({
          title: 'Opciones',
            text: `¿Desea ${is_selected? 'Deseleccionar' : 'Seleccionar'} o eleiminar?`,
          icon: 'question',
          confirmButtonText: is_selected? 'Deseleccionar' : 'Seleccionar',
          denyButtonText: 'Eliminar',
            showDenyButton: true,
        }).then((result)=> {
            if(result.isConfirmed) {
                if(is_selected){
                    element.classList.remove('selected');
                    image.selected = false;
                } else {
                    element.classList.add('selected');
                    image.selected = true;
                }
                notyf.success('Operacion exitosa');
            } else {
                onDeleteEvent(index, image, element, true);
            }
        });
    }

    function onDeleteLevelEvent(level, element_id) {
        var index = obj.levels.indexOf(level);
        obj.remove_level(index);
        var element = document.getElementById(element_id);
        element.remove();
    }
}


export { load_game_config_form };
