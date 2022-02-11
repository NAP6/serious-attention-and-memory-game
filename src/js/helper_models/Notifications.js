class Notifications {
    #notification_center;
    #badge;

    constructor(extra_class=[]) {
        var area = _create_notification_area('alert_dropdown', extra_class);
        this.alert_zone = area.container;
        this.#notification_center = area.notification_pane;
        this.#badge = area.badge;
        this.#badge.innerText = '0';
    }

    new_notification(obj, ok_handler=null, no_handler=null, icon_class=[]) {
        var on_destroy = ()=>{
            this.#badge.innerText = '' + (parseInt(this.#badge.innerText) - 1);
        }
        var notification = create_notification(obj, ok_handler, no_handler, on_destroy, icon_class);
        this.#notification_center.appendChild(notification);
        this.#badge.innerText = '' + (1 + parseInt(this.#badge.innerText));
    }
}

function _create_notification_area(id_alert_button='alert_dropdown', extra_class_bell_buton=[]) {
    var super_container = document.createElement('div');
    var bell_buton = document.createElement('a');
    var bell_icon = document.createElement('i');
    var badge = document.createElement('span');

    super_container.appendChild(bell_buton);
    bell_buton.appendChild(bell_icon);
    bell_buton.appendChild(badge);

    for(var n_class of extra_class_bell_buton)
        bell_buton.classList.add(n_class);
    bell_buton.classList.add('dropdown-toggle');
    bell_buton.id = id_alert_button;
    bell_buton.href = "#";
    bell_buton.setAttribute('role', 'button');
    bell_buton.setAttribute('data-bs-toggle', 'dropdown');
    bell_buton.setAttribute('aria-expanded', false);

    bell_icon.classList.add('fas', 'fa-bell');

    badge.classList.add('badge', 'bg-danger', 'rounded-pill', 'badge-counter');

    var list_notification_container = document.createElement('div');
    var header = document.createElement('h6');

    super_container.appendChild(list_notification_container);
    list_notification_container.appendChild(header);

    list_notification_container.classList.add('dropdown-list', 'dropdown-menu', 'dropdown-menu-end', 'shadow', 'animated--grow-in');
    list_notification_container.setAttribute('aria-labelledby', id_alert_button);

    header.classList.add('dropdown-header');
    header.innerText = 'Centro de Notificaciones';

    return {
        container: super_container,
        notification_pane: list_notification_container,
        badge: badge
    }

}

function create_notification(obj, ok_handler=null, no_handler=null, on_destroy, icon_class=[]) {
    var alert_container = document.createElement('a');
    var icon_section = document.createElement('div');
    var icon_container = document.createElement('div');
    var icon = document.createElement('i');

    alert_container.appendChild(icon_section);
    icon_section.appendChild(icon_container);
    icon_container.appendChild(icon);

    alert_container.classList.add('dropdown-item', 'd-flex', 'align-items-center');
    alert_container.href = '#';

    icon_section.classList.add('me-3');

    icon_container.classList.add('icon-circle', 'bg-primary');

    for(var n_class of icon_class)
        icon.classList.add(n_class);
    icon.classList.add('text-white');

    var message_container = document.createElement('div');
    var date = document.createElement('div');
    var message_span = document.createElement('span');
    var buttons_section = document.createElement('div');

    alert_container.appendChild(message_container);
    message_container.appendChild(date);
    message_container.appendChild(message_span);
    message_container.appendChild(buttons_section);

    date.classList.add('small', 'text-gray-500');
    date.innerText = obj.date;

    message_span.classList.add('font-weight-bold')
    message_span.innerText = obj.message

    buttons_section.classList.add('float-end', 'mt-3');

    var ok_button = document.createElement('button');
    var icon_ok = document.createElement('i');

    buttons_section.appendChild(ok_button);
    ok_button.appendChild(icon_ok);

    ok_button.classList.add('btn', 'btn-dark', 'btn-sm', 'mx-1');

    icon_ok.classList.add('fas', 'fa-check');

    if(ok_handler) {
        ok_button.onclick = ()=> {
            ok_handler(obj, 'ok');
            alert_container.remove();
            on_destroy();
        }
    } else {
        ok_button.onclick = ()=> {
            alert_container.remove();
            on_destroy();
        }
    }

    if(no_handler) {
        var no_button = document.createElement('button');
        var icon_no = document.createElement('i');

        buttons_section.appendChild(no_button);
        no_button.appendChild(icon_no);

        no_button.classList.add('btn', 'btn-outline-dark', 'btn-sm', 'mx-1');

        icon_no.classList.add('fas', 'fa-times');

        no_button.onclick = ()=> {
            no_handler(obj, 'no');
            alert_container.remove();
            on_destroy();
        }
    }

    return alert_container;
}

export { Notifications };
