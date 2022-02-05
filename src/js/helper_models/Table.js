import { start_DataTable } from './DataTable_helper.js';

class Table {

    constructor(object_list=[], params=params_start) {
        this.table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');

        for(let k of Object.keys(params)) {
            params_start[k] = params[k];
        }
        params=params_start;

        if(object_list.length > 0 && params['keys'].length == 0)
            params['keys'] = Object.keys(object_list[0]);

        if(params['names'].length == 0) 
            params['names'] = params['keys'];

        _build_header_and_footer(params['names'], thead, tfoot, params);

        _build_body(object_list, params['keys'], tbody, params)

        this.table.appendChild(thead);
        this.table.appendChild(tbody);
        this.table.appendChild(tfoot);

        this.table.classList.add('table', 'table-striped', 'w-100');

        this.id = params.id;

        this._creation_params = params;
        this._body = tbody;

        start_DataTable(this.id, (dt)=> {
            this._dt = dt;
        });
    }

    get id() {
        return this.table.id;
    }

    set id(value) {
        this.table.id = value;
    }

    add(obj) {
        var tr = _create_row(obj,
            this._creation_params['keys'],
            this._creation_params['onUpdateHandler'], 
            this._creation_params['onDeleteHandler'], 
            this._creation_params['extraButtonHandler'],
            this._creation_params['extraButtonLabel']
        );

        this._dt.row.add(tr).draw();
    }

    remove(tr) {
        this._dt.row(tr).remove().draw();
    }

    update(tr, obj) {
        this._dt.row(tr).remove().draw();
        var tr = _create_row(obj,
            this._creation_params['keys'],
            this._creation_params['onUpdateHandler'], 
            this._creation_params['onDeleteHandler'], 
            this._creation_params['extraButtonHandler'],
            this._creation_params['extraButtonLabel']
        );
        this._dt.row.add(tr).draw();
    }

}

const params_start = {
    id: 'my_table',
    names: [],
    keys:[],
    onDeleteHandler: null,
    onUpdateHandler: null,
    extraButtonTitle: "",
    extraButtonLabel: "Ejecutar",
    extraButtonHandler: null
};


function _build_header_and_footer(names, header, footer, params) {
    var tr = document.createElement('tr');

    if(params['onUpdateHandler'] || params['onDeleteHandler']) {
        var th = document.createElement('th');
        th.style = "max-width: 25px;"
        tr.appendChild(th);
    }

    for(const n of names){
        var th = document.createElement('th');
        th.innerHTML = n;
        tr.appendChild(th);
    }

    if(params['extraButtonHandler']) {
        var th = document.createElement('th');
        th.innerHTML = params['extraButtonTitle'];
        tr.appendChild(th);
    }

    var tr2 = tr.cloneNode(true);

    header.appendChild(tr);
    footer.appendChild(tr2);

    return {header: header, footer: footer};
}

function _build_body(object_list, key_list, body, params) {
    for(const obj of object_list){
        var tr = _create_row(obj, key_list,
            params['onUpdateHandler'], 
            params['onDeleteHandler'], 
            params['extraButtonHandler'], 
            params['extraButtonLabel']
    );
        body.appendChild(tr);
    }

    return body;
}

function _create_row(obj, key_list, h_update=null, h_delete=null, h_extra=null, l_extra='') {
    var tr = document.createElement('tr');
    tr.id =`row-${obj.id}`;

    var td = _create_delete_update_buttons(obj, tr, h_update, h_delete);
    if(td) {
        tr.appendChild(td);
    }

    for(const key of key_list) {
        var td = document.createElement('td')
        td.innerHTML = obj[key];
        td.classList.add('align-middle')
        tr.appendChild(td);
    }

    var td = _create_extra_button(obj, tr, h_extra, l_extra);
    if(td) {
        tr.appendChild(td);
    }

    return tr;
}

function _create_extra_button(obj, tr, h_extra, l_extra) {
    if(h_extra) {
        var td = document.createElement('td');
        var button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-dark', 'w-100');
        td.appendChild(button);

        button.innerHTML = l_extra;
        button.onclick = ()=> { h_extra(obj, tr); };
        return td;
    }
    return false;
}

function _create_delete_update_buttons(obj, tr, h_update, h_delete) {
    if(h_update || h_delete) {
        var td = document.createElement('td');
        var butons = [
            {handler: h_update, icon: 'fas fa-edit fa-xs'},
            {handler: h_delete, icon: 'fas fa-trash-alt fa-xs'}
        ];

        for(let b of butons) {
            if(b.handler){
                var button = document.createElement('button');
                button.classList.add('btn', 'btn-link', 'px-1');
                var i = document.createElement('i');
                i.setAttribute('class', b.icon);
                button.appendChild(i);
                td.appendChild(button);

                button.onclick = ()=> { b.handler(obj, tr); };
            }
        }

        return td;
    }
    return false;
}

export { Table };
