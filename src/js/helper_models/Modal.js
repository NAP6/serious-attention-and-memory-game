
class Modal {

    constructor(modal_id, params=params_start) {

        for(let k of Object.keys(params)) {
            params_start[k] = params[k];
        }

        var modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('data-bs-backdrop', 'static');
        modal.setAttribute('data-bs-keyboard', 'false');
        modal.setAttribute('aria-hidden', 'true');
        modal.id = modal_id;

        var modal_dialog = document.createElement('div');
        modal_dialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-dialog-scrollable', 'modal-lg');
        modal.appendChild(modal_dialog);

        var modal_content = document.createElement('div');
        modal_content.classList.add('modal-content');
        modal_dialog.appendChild(modal_content);

        var modal_header = document.createElement('div');
        modal_header.classList.add('modal-header');
        modal_content.appendChild(modal_header);
        var h5 = document.createElement('h5');
        h5.classList.add('modal-title');
        h5.innerHTML = params_start['title'];
        modal_header.appendChild(h5);
        var xButoon = document.createElement('button');
        xButoon.type = 'button';
        xButoon.classList.add('btn-close');
        xButoon.setAttribute('data-bs-dismiss', 'modal');
        xButoon.setAttribute('aria-label', 'Close');
        modal_header.appendChild(xButoon);


        var modal_body = document.createElement('div');
        modal_body.classList.add('modal-body')
        modal_content.appendChild(modal_body);

        var modal_footer = document.createElement('div')
        modal_footer.classList.add('modal-footer');
        modal_content.appendChild(modal_footer);
        var contetn_footer = document.createElement('div');
        var yButoon = document.createElement('button');
        yButoon.type = 'button';
        yButoon.classList.add('btn', 'btn-secondary');
        yButoon.setAttribute('data-bs-dismiss', 'modal');
        yButoon.innerHTML = params_start['closeButton_label'];
        modal_footer.appendChild(contetn_footer)
        modal_footer.appendChild(yButoon);

        xButoon.onclick = params_start['onCloseButtonDo'];
        yButoon.onclick = params_start['onCloseButtonDo'];

        this.modal = modal;
        this.header = modal_header;
        this.body = modal_body;
        this.footer = modal_footer;
        this._title = h5;
        this._close_button = yButoon;
        this._conten_footer = contetn_footer;
        this._actual_size_class = 'modal-lg';
        this._bootstrap = new bootstrap.Modal(this.modal, { keyboard: false });

        if(params_start['body_content'])
            this.set_bodyContent(params_start['body_content']);

        if(params_start['extraFooter_content'])
            this.set_footerContent(params_start['extraFooter_content']);

        if(!params_start['closeButton_visible']) 
            this.hide_closeButton();

        if(!params_start['footer_visible'])
            this.hide_footer();

        if(params_start['onClick_toggle'])
            this.add_onClick_toggle(params_start['onClick_toggle']);

        if(params_start['appendTo'])
            this.appendTo(params_start['appendTo']);

    }

    set id(value) {
        this.modal.id = value;
    }

    get id() {
        return this.modal.id;
    }

    set title(value) {
        this._title.innerText = value;
    }

    get title() {
        return this._title.innerText;
    }

    static get FULL_SCREEN_SIZE() {
        return 'modal-fullscreen';
    }

    static get EXTRA_LARGE_SIZE() {
        return 'modal-xl';
    }

    static get LARGE_SIZE() {
        return 'modal-lg';
    }

    static get NORMAL_SIZE() {
        return '';
    }

    static get SMALL_SIZE() {
        return 'modal-sm';
    }

    toggle() {
        this._bootstrap.toggle();
    }

    hide() {
        this._bootstrap.hide();
    }

    show() {
        this._bootstrap.show();
    }

    appendTo(node) {
        node.appendChild(this.modal);
    }

    add_onClick_toggle(node) {
        node.setAttribute('data-bs-toggle', 'modal')
        node.setAttribute('data-bs-target', `#${this.id}`)
    }

    set_bodyContent(node) {
        this.body.innerHTML='';
        this.body.appendChild(node);
    }

    set_footerContent(node) {
        this._conten_footer.innerHTML='';
        this._conten_footer.appendChild(node);
    }

    hide_closeButton() {
        this._close_button.classList.add('d-none');
    }

    show_closeButton() {
        this._close_button.classList.remove('d-none');
    }

    hide_footer() {
        this.footer.classList.add('d-none');
    }

    show_footer() {
        this.footer.classList.remove('d-none');
    }

    hide_header() {
        this.header.classList.add('d-none');
    }

    show_header() {
        this.header.classList.remove('d-none');
    }

    changeSize(value) {
        var elem = this.modal.getElementsByClassName('modal-dialog')[0];
        if(this._actual_size_class != Modal.NORMAL_SIZE)
            elem.classList.remove(this._actual_size_class);
        if(value != Modal.NORMAL_SIZE)
            elem.classList.add(value);
        this._actual_size_class = value;
    }
}

const params_start = {
    title: "Titulo",
    closeButton_label: "Cerrar",
    closeButton_visible: true,
    extraFooter_content: null,
    body_content: null,
    footer_visible: true,
    appendTo: null,
    onClick_toggle: null,
    onCloseButtonDo: null
}

export { Modal };
