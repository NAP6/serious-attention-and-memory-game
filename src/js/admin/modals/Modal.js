
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

        this.modal = $(modal);
        this.body = $(modal_body);
        this.footer = $(modal_footer);
        this._title = $(h5);
        this._close_button = $(yButoon);
        this._conten_footer = $(contetn_footer);

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
        this.modal.attr('id', value);
    }

    get id() {
        return this.modal.attr('id');
    }

    set title(value) {
        this._title.text(value);
    }

    get title() {
        return this._title.text();
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }

    toggle() {
        this.modal.toggle();
    }

    appendTo(node) {
        this.modal.appendTo(node);
    }

    add_onClick_toggle(node) {
        node.setAttribute('data-bs-toggle', 'modal')
        node.setAttribute('data-bs-target', `#${this.id}`)
    }

    set_bodyContent(node) {
        this.body.html(node);
    }

    set_footerContent(node) {
        this._conten_footer.html(node);
    }

    hide_closeButton() {
        this._close_button.addClass('d-none');
    }

    show_closeButton() {
        this._close_button.removeClass('d-none');
    }

    hide_footer() {
        this.footer.addClass('d-none');
    }

    show_foother() {
        this.removeClass('d-none');
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
    onClick_toggle: null
}

export { Modal };
