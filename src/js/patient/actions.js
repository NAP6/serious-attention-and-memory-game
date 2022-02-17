import { start_sidebar } from '../helper_models/sidebar.js';
import { PatientController } from '../controller/PatientContoller.js';

start_sidebar();

var patient = PatientController.get_active_patient();
document.getElementById('patient_profile_name').innerText = patient.name;
if(patient.image)
    document.getElementById('patient_profile_image').setAttribute("src", patient.image);
