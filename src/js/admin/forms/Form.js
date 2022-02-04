class Form {

    constructor(form_id, params={}, appendTo=null, missing_input_messenge = 'Por favor llena este campo') {
        var keys = Object.keys(params);

        var form = document.createElement('div');
        form.classList.add('form-container', 'row', 'needs-validation');
        form.id = form_id;

        this.inputs = {};
        var elements_to_add = Array(keys.length).fill(null);
        for(let k of keys) {
            var element_aux = null;
            var type = params[k]['type'];
            var label = params[k]['label'];
            var placeholder = params[k]['placeholder'];
            var required = params[k]['required'];
            var name = params[k]['name'];
            var options = params[k]['options'];
            var position_class = params[k]['position_class'];
            var position = params[k]['position'];
            var value = params[k]['value'];
            var disabled = params[k]['disabled'];
            var checked = params[k]['checked'];
            element_aux = create_input(
                k,
                form_id, 
                type? type : 'text', 
                placeholder? placeholder : '', 
                label? label : k,
                (required != null)? required : true,
                name? name : k,
                options? options : null,
                position_class? position_class : [],
                value? value : null,
                disabled? disabled : false,
                checked? checked : false
            );
            if(!position)
                position = elements_to_add.indexOf(null);
            var index_aux = elements_to_add.indexOf(null, position);
            if(index_aux == position)
                elements_to_add.splice(position, 1, element_aux.node);
            else if(index_aux != -1){
                elements_to_add.splice(index_aux, 1, elements_to_add[position]);
                elements_to_add.splice(position, 1, element_aux.node);
            } else {
                elements_to_add.splice(1, index_aux);
                elements_to_add.push(element_aux.node);
            }
            this.inputs[k] = element_aux.input;
        }

        for(let elem of elements_to_add) {
            if(elem)
                form.appendChild(elem);
        }

        this.form = form;
        this.missing_input_messenge = missing_input_messenge;

        if(appendTo) this.appendTo(appendTo);
    }

    fill(object) {
        var keys = Object.keys(object);
        for(let k of keys)
            this.inputs[k].value = object[k];
    }

    getObject() {
        var object = {};
        var keys = Object.keys(this.inputs);
        for (let k of keys)
            object[k] = this.inputs[k].value;
        return object;
    }

    reset() {
        for(let i of Object.values(this.inputs))
            i.value = '';
        this.form.classList.remove('was-validated');
    }

    disableAll() {
        for(let i of Object.values(this.inputs))
            i.disabled = true;
    }

    enableAll() {
        for(let i of Object.values(this.inputs))
            i.disabled = false;
    }

    valid_required_are_filled() {
        var is_correct = true;
        var firs_detected = null;
        for(let input of Object.values(this.inputs)) {
            if(input.required && input.validity.valueMissing) {
                input.setCustomValidity(this.missing_input_messenge);
                firs_detected = firs_detected? firs_detected : input;
                is_correct = false;
            } else {
                input.setCustomValidity('');
            }
        }

        if(firs_detected) firs_detected.reportValidity();
        this.form.classList.add('was-validated');
        return is_correct;
    }
    
    report_invalid_input(key, messenge) {
        var input = this.inputs[key];
        input.setCustomValidity(messenge);
        input.reportValidity();
    }

    get_input_content(key) {
        return this.inputs[key].value;
    }

    get_input(key) {
        return this.inputs[key];
    }

    appendTo(nodo) {
        nodo.appendChild(this.form);
    }
}

function create_input(
    key,
    form_id,
    type='text',
    placeholder='',
    label_text='',
    required=true,
    name='',
    options=null,
    position_class=[],
    value=null,
    disabled=false,
    checked=false
) {

    var position_div = document.createElement('div');
    var div = document.createElement('div');
    for(let pClass of position_class) {
        position_div.classList.add(pClass);
    }

    var input = null;
    if(type == 'select' || type == 'textarea')
        input = document.createElement(type);
    else {
        input = document.createElement('input');
        input.type = type;
    }
    input.name = (name && name != '')? name : key;
    input.id = `${key}_of_${form_id}`;
    input.required = required;
    input.disabled = disabled;
    if(value) input.value = value;

    var label = document.createElement('label');
    label.setAttribute('for', input.id);
    if(label_text != '' && label_text != null)
        label.innerText = label_text;
    else
        label.innerText = key;

    if(placeholder != '' && placeholder != null)
        input.placeholder = placeholder;
    else
        input.placeholder = label.innerText;

    div.appendChild(input);
    div.appendChild(label);
    position_div.appendChild(div);

    if(type == 'radio' || type == 'checkbox') {
        div.classList.add('form-check', 'mb-3');
        input.classList.add('form-check-input');
        label.classList.add('form-check-label');
        input.checked = checked;
    } else if (type == 'select') {
        div.classList.add('form-floating', 'mb-3');
        input.classList.add('form-select');
        if(options) {
            for(let key of Object.keys(options)) {
                var option = document.createElement('option');
                option.value = options[key].value;
                option.innerText = options[key].text;
                input.appendChild(option);
            }
        }
    } else {
        div.classList.add('form-floating', 'mb-3');
        input.classList.add('form-control');
    }


    return {
        node: position_div,
        input: input
    };
}

export { Form };
