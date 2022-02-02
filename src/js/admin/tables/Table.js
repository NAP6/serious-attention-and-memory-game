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
    }

    get id() {
        return this.table.id;
    }

    set id(value) {
        this.table.id = value;
    }

}

const params_start = {
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
            var tr = document.createElement('tr');

            if(params['onUpdateHandler'] || params['onDeleteHandler']) {
                var td = document.createElement('td');
                tr.appendChild(td);

                var butons = [
                    {handler: params['onUpdateHandler'], icon: 'fas fa-edit fa-xs'},
                    {handler: params['onDeleteHandler'], icon: 'fas fa-trash-alt fa-xs'}
                ];

                for(let b of butons) {
                    if(b.handler){
                        var button = document.createElement('button');
                        button.classList.add('btn', 'btn-link', 'px-1');
                        var i = document.createElement('i');
                        i.setAttribute('class', b.icon);
                        button.appendChild(i);
                        td.appendChild(button);

                        button.onclick = ()=> { b.handler(obj); };
                    }
                }
            }

            for(const key of key_list) {
                var td = document.createElement('td')
                td.innerHTML = obj[key];
                td.classList.add('align-middle')
                tr.appendChild(td);
            }

            if(params['extraButtonHandler']) {
                var td = document.createElement('td');
                var button = document.createElement('button');
                button.classList.add('btn', 'btn-outline-dark', 'w-100');
                td.appendChild(button);
                tr.appendChild(td);

                button.innerHTML = params['extraButtonLabel'];
                button.onclick = ()=> { params['extraButtonHandler'](obj); };
            }

            body.appendChild(tr);
        }

        return body;
    }

export { Table };
