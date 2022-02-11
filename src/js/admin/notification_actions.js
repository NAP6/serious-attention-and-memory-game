import { Notifications } from '../helper_models/Notifications.js';

var notification_center = new Notifications(['nav-link']);
var menu_section = document.getElementById('alert_menu_zone');
menu_section.appendChild(notification_center.alert_zone);







var messages = [
    {
        date: 'Enero 12, 2022',
        message: "El paciente Pepe completo el juego TMT en el Grupo 'Grupo 1'"
    },
    {
        date: 'Enero 12, 2022',
        message: "El admisistrador Juan solicito unirse al Grupo 'Grupo 1'"
    },
    {
        date: 'Enero 12, 2022',
        message: "El paciente Pedro solicito unirse al Grupo 'Grupo 1'"
    }
]

var example_handler = (obj, status)=> {
    console.log(`La respuesta a la notificacon es ${status}`);
    console.log(obj);
}
notification_center.new_notification(messages[0], null, null, ['fas', 'fa-file-alt']);
notification_center.new_notification(messages[1], example_handler, example_handler, ['fas', 'fa-user-lock']);
notification_center.new_notification(messages[2], example_handler, example_handler, ['fas', 'fa-user-injured']);
