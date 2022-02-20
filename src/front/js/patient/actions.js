import { start_sidebar } from '../helper_models/sidebar.js';
import { PatientController } from '../controller/PatientContoller.js';

start_sidebar();

var patient = PatientController.get_active_patient();
document.getElementById('patient_profile_name').innerText = patient.name;
if(patient.image)
    document.getElementById('patient_profile_image').setAttribute("src", patient.image);

//join to new group
var query = window.location.search;
var params = new URLSearchParams(query);
var gorupCode = params.get('groupCode');
if(gorupCode) {
    Swal.fire({
        icon: 'question',
        title: 'Unirse a grupo',
        text: `Has sido invitado al grupo "${gorupCode}", deseas unirte?`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        backdrop: `
            rgba(0,0,123,0.4)
            url("https://www.gifsanimados.org/data/media/187/dinosaurio-imagen-animada-0109.gif")
            right bottom
            no-repeat
            `
    }).then((result)=> {
        var notyf = new Notyf();
        if(result.isConfirmed) {
            var is_added = PatientController.add_to_group(gorupCode.split('-')[1]);
            console.log(is_added)
            if(is_added) {
                notyf.success('Ahora perteneces al grupo');
                window.location.search = '';
            } else {
                notyf.error('Problemas al unirte al grupo');
            }
        } else {
                notyf.error('La union al grupo ha sido cancelada');
                window.location.search = '';
        }
    });
}
