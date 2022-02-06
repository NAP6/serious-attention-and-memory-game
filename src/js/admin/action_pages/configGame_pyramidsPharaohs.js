function load_game_config_form(ogj, alert, notyf) {
    var config_form = document.getElementById('config_game_template')
        .content.cloneNode(true);

    var level_container = config_form.querySelector('div #level_acordion');

    var i;
    for(i=1; i <= 2; i++){
        var level = create_level(i, 
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-doc-brown.jpg'), 
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-marty-mcfly.jpg')
                    );
        level_container.appendChild(level);
    }

    var btn_new_lavel = config_form.querySelector('div #add_new_lavel');
    btn_new_lavel.onclick = ()=> {
        level_container.appendChild(create_level(i++));
    }

    return config_form;


    function create_level(index, example=[], answer=[]) {
        var level_item = document.getElementById('accordion_album_item_template')
            .content.cloneNode(true);

        var title = level_item.querySelector('div').getElementsByTagName('h5')[0];
        var button = title.getElementsByTagName('button')[0];
        var content_container = level_item.querySelector('div').getElementsByTagName('div')[0];

        title.id = `album_${index}_item_header`;
        content_container.id = `album_${index}_item_content`;
        content_container.setAttribute('aria-labelledby', title.id);
        button.setAttribute('data-bs-target', `#${content_container.id}`);
        button.setAttribute('aria-controls', content_container.id);
        button.innerText = `Nivel ${index}`;

        var exaple_group = level_item.getElementById('example_group_container');
        var answer_group = level_item.getElementById('answer_group_container');
        
        exaple_group.id += `_${index}`;
        answer_group.id += `_${index}`;

        for(let img of example){
            var image_item = create_img_item(img);
            exaple_group.appendChild(image_item);
        }
        exaple_group.appendChild(create_img_item());

        for(let img of answer){
            var image_item = create_img_item(img, true);
            answer_group.appendChild(image_item);
        }
        answer_group.appendChild(create_img_item());

        return level_item;
    }

    function create_img_item(image=null, answer=false) {
        var image_item = document.getElementById('album_image_template')
            .content.cloneNode(true);

        var container = image_item.querySelector('.album-container');

        if(image == null) {
            container.classList.add('add-new-image');
            container.onclick = ()=>{ onAddEvent(container); };
        } else if(answer){
            container.classList.add('answer');
            container.children[0].style.backgroundImage = `url(${image})`;
            container.onclick = ()=>{ onOptionEvent(container); };
        } else {
            container.children[0].style.backgroundImage = `url(${image})`;
            container.onclick = ()=>{ onDeleteEvent(container); };
        }

        return image_item;
    }

    function onAddEvent(element) {
        var input = document.getElementById('input_img').cloneNode(true);
        input.onchange = ()=> {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const uploaded_image = reader.result;
                element.children[0].style.backgroundImage = `url(${uploaded_image})`;
                element.classList.remove('add-new-image');
                var super_container = element.parentNode.parentNode;
                super_container.appendChild(create_img_item());
                if(Object.values(super_container.classList).indexOf('answer') == -1){
                    element.onclick = ()=>{ onDeleteEvent(element); };
                } else {
                    element.classList.add('answer');
                    element.onclick = ()=>{ onOptionEvent(element); };
                }
            });
            reader.readAsDataURL(input.files[0]);
        };
        input.click();

    }

    function onDeleteEvent(element) {
        alert.fire({
          title: 'Borrar',
          text: '¿Esta seguro de que desea continuar?',
          icon: 'warning',
          confirmButtonText: 'Eliminar',
          denyButtonText: 'Cancelar',
            showDenyButton: true,
        }).then((result)=> {
            if(result.isConfirmed) {
                element.parentNode.remove();
                notyf.success('Se ha eliminado correctamente');
            } else {
                notyf.open({
                    type: 'warning',
                    message: 'El eliminado ha sido cancelado'
                });
            }
        });
    }

    function onOptionEvent(element) {
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
                if(is_selected)
                    element.classList.remove('selected');
                else
                    element.classList.add('selected');
                notyf.success('Operacion exitosa');
            } else {
                onDeleteEvent(element);
            }
        });
    }
}


export { load_game_config_form };
