import { start_sidebar } from '../helper_models/sidebar.js';
import { AdministratorController } from '../controller/AdministratorController.js';

start_sidebar();

//change admin profile info on top bar
var admin = AdministratorController.get_active_adminitrator();
document.getElementById('admin_profile_name').innerText = admin.name;
if(admin.image)
    document.getElementById('admin_profile_image').setAttribute("src", admin.image);

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
            var is_added = AdministratorController.add_to_group(gorupCode.split('-')[1]);
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
