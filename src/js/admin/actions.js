import { start_sidebar } from '../helper_models/sidebar.js';
import { AdministratorController } from '../controller/AdministratorController.js';

start_sidebar();

var admin = AdministratorController.get_active_adminitrator();
document.getElementById('admin_profile_name').innerText = admin.name;
if(admin.image)
    document.getElementById('admin_profile_image').setAttribute("src", admin.image);
