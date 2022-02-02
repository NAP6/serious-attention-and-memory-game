
class Modal {

    constructor() {

        var modal = document.createElement('div');
        modal.classList.add('modal');
        modal.setAttribute('tabindex', '-1')

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
        h5.innerHTML = 'Titulo'
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
        var yButoon = document.createElement('button');
        yButoon.type = 'button';
        yButoon.classList.add('btn', 'btn-secondary');
        yButoon.setAttribute('data-bs-dismiss', 'modal');
        yButoon.innerHTML = 'Cerrar';
        modal_footer.appendChild(yButoon);


        xButoon.addEventListener('click', ()=> this.hide());
        yButoon.addEventListener('click', ()=> this.hide());


        this.modal = $(modal);
        this.title = $(h5);
        this.body = $(modal_body);

    }

    set id(value) {
        this.modal.attr('id', value);
    }

    get id() {
        return this.modal.attr('id');
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
}

export { Modal };
