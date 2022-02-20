class LogController {
    static login(email, password) {
        var is_valid = ((email == 'admin@ejemplo.com' || email == 'patient@ejemplo.com') && password == '123');
        var res;
        if(is_valid) {
            res = {
                status: 'ok',
                is_valid: is_valid,
                user: email == 'admin@ejemplo.com'? 'administrator': 'patient',
                message: ''
            }
        } else {
            res = {
                status: 'error',
                is_valid: is_valid,
                user: '',
                message: 'Usuario no Encontrado'
            }
        }
        return res;
    }

    static logout() {
        return true;
    }

    static search_email(email) {
        if(email == 'correo@ejemplo.com') {
            return true;
        }
        return false;
    }

    static value = true;
    static register(email, password) {
        this.value = !this.value;
        if(this.value) {
            return 1;
        } else {
            return false;
        }
    }

    static delete(id) {
        return true;
    }
}

export { LogController };
