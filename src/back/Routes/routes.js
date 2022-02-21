import express from "express";

function Router(__dir_front) {
    var router = express.Router();

    get('/', '/home.html');
    get('/login', '/login.html');
    get('/register', '/register.html');
    get('/admin', '/admin_portal/dashboard.html', true);
    get('/patient', '/patient_portal/dashboard.html', true);

    return router;

    function get( req_route, file_name, need_logged=false){
        router.get(req_route,(req,res)=> {
            if(need_logged && !req.session.active_user)
                res.redirect('/login')
            else if(need_logged && req.session.active_user) {
                if(
                    (req_route.includes('admin') && req.session.user_type == 'administrator') ||
                    (req_route.includes('patient') && req.session.user_type == 'patient')
                )
                    res.sendFile(__dir_front + file_name);
                else
                    res.redirect(`/${req.session.user_type=='patient'? 'patient':'admin'}`);
            } else
                res.sendFile(__dir_front + file_name);
        });
    }
}



export { Router };
