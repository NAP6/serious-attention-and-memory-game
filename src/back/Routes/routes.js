import express from "express";

function Router(__dir_front) {
    var router = express.Router();

    get('/', '/home.html');
    get('/login', '/login.html');
    get('/register', '/register.html');

    // Admin Portal
    get('/admin', '/admin_portal/dashboard.html', true);
    get('/admin/groups', '/admin_portal/groups.html', true);
    get('/admin/patients', '/admin_portal/patients.html', true);
    get('/admin/tmt', '/admin_portal/TMT.html', true);
    get('/admin/pdp', '/admin_portal/pyramids_and_pharaohs.html', true);

    // Patient Portal
    get('/patient', '/patient_portal/dashboard.html', true);
    get('/patient/groups', '/patient_portal/groups.html', true);
    get('/patient/matches', '/patient_portal/matches.html', true);
    get('/patient/tmt', '/patient_portal/TMT.html', true);
    get('/patient/pdp', '/patient_portal/pyramids_and_pharaohs.html', true);

    // Redirect to correct place with invitaiton
    router.get('/invitation', (req, res)=> {
        var group_code = req.query.groupCode;
        if(req.session.user_type && req.session.user_type != '')
            res.redirect(`/${req.session.user_type=='patient'? 'patient':'admin'}?groupCode=${group_code}`);
        else
            res.redirect(`/login?groupCode=${group_code}`);
    });

    return router;

    //get router simplifyer
    function get( req_route, file_name, need_logged=false){
        router.get(req_route,(req,res)=> {
            if(need_logged && !req.session.active_user)
                res.redirect('/login')
            else if(need_logged && req.session.active_user) {
                if(
                    (req_route.includes('admin') && req.session.user_type == 'Administrator') ||
                    (req_route.includes('patient') && req.session.user_type == 'Patient')
                )
                    res.sendFile(__dir_front + file_name);
                else
                    res.redirect(`/${req.session.user_type=='Patient'? 'patient':'admin'}`);
            } else
                res.sendFile(__dir_front + file_name);
        });
    }
}



export { Router };
