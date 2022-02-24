import { post_api } from "../helper_models/post_api.js";

class LogController {
    static async login(email, password) {
        var data = {email: email, password: password};
        var res = await post_api(`${window.location.origin}/api/login`, data);
        console.log(res);
        return res;
    }

    static async logout() {
        var data = {logout: true};
        var res = await post_api(`${window.location.origin}/api/logout`, data);
        return res.is_logout;
    }

    static async search_email(email) {
        var data = {email: email};
        var res = await post_api(`${window.location.origin}/api/search_email`, data);
        return res.is_email_found;
    }

    static value = true;
    static async register(email, password, user_type) {
        var data = {email: email, password: password, type: user_type};
        var res = await post_api(`${window.location.origin}/api/register`, data);
        return res.inserted_id;
    }

    static async delete(id) {
        var data = {id: id};
        var res = await post_api(`${window.location.origin}/api/delete`, data);
        return res.is_deleted;
    }
}

export { LogController };
