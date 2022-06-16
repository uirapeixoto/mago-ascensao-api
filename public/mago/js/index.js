const endpoint = 'http://localhost:3000/usuario';
const issueGetRequest = () => {
    // get data from the server:
    console.log('GET request:', endpoint);
    fetch(endpoint)
        .then(response => response.json())
        .then(displayData)
        .then(attachEventHandlers);
};

const issuePutRequest = (id, data, responseHandler) => {
    // update data on the server:
    const url = endpoint + '/' + id;
    console.log('PUT request:', url, data);
    fetch(url, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseHandler);
};

const issueDeleteRequest = (id, responseHandler) => {
    // delete data on the server:
    const url = endpoint + '/' + id;
    console.log('DELETE request:', url);
    fetch(url, { method: 'delete' })
        .then(responseHandler);
};

const issuePostRequest = (data, responseHandler) => {
   // create data on the server:
   console.log('POST request:', endpoint, data);
   fetch(endpoint, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(responseHandler);
};

const handleUpdate = (ev) => {
    const id = ev.target.getAttribute('data-id');
    const container = ev.target.parentElement.parentElement;
    const data = {
        'Nome': container.querySelector('#nome').value,
        'DataCriacao': container.querySelector('#dataCriacao').value,
        'DataAlteracao': container.querySelector('#dataAltecao').value,
    };
    const callback = (item) => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    };
    issuePutRequest(id, data, callback)
};

const handleCreate = () => {
    const container = document.querySelector('.add-new-panel');
    const data = {
        'Nome': container.querySelector('#nome').value,
        'DataCriacao': container.querySelector('#dataCriacao').value,
        'DataAlteracao': container.querySelector('#dataAltecao').value,
    };
    issuePostRequest(data, issueGetRequest);
    document.querySelector('.add-new-panel').classList.remove('active');
};

const handleDelete = (ev) => {
    const id = ev.target.id;
    const areYouSure = confirm('Are you sure that you want to delete item #' + id + '?')
    if (!areYouSure) {
        return;
    }
    issueDeleteRequest(id, issueGetRequest);
};

const attachEventHandlers = () => {
    for (elem of document.querySelectorAll('.delete')) {
        elem.onclick = handleDelete;
    }
    for (elem of document.querySelectorAll('.edit')) {
        elem.onclick = showEditForm;
    }
    document.querySelector('#add-new').onclick = () => {
        const container = document.querySelector('.add-new-panel');
        container.querySelector('.nome').value = '';
        container.querySelector('.dataAlteracao').value = '';
        container.classList.add('active');
    };
    document.querySelector('.close').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.add-new-panel .cancel').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.update.save').onclick = handleCreate;
    
};

const attachFormEventHandlers = (item, container) => {
    container.querySelector('.update').onclick = handleUpdate;
    container.querySelector('.cancel').onclick = () => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    }
};

const showEditForm = (ev) => {
    const id = ev.target.id;
    const url = endpoint + '/' + id;
    const cardElement = ev.target.parentElement.parentElement;
    fetch(url)
        .then(response => response.json())
        .then(item => {
            displayForm(item, cardElement);
            attachFormEventHandlers(item, cardElement);
        });
    return false;
};

const displayForm = (item, container) => {
    container.innerHTML = `
        <div style="margin-top:7px;">
            <label>id:</label><span>${item.id}</span><br>
            <label>Nome:</label>
            <input type="text" id="Nome" value="${item.Nome}"><br>
            
            <label>DataCriação:</label>
            <input type="text" id="dataCriacao" value="${item.DataCriacao}"><br>
            
            <label>Data de Alteração:</label>
            <input type="text" id="dataAlteracao" value="${item.DataAlteracao}"><br>
            
            <label></label>
            <button type="button" data-id="${item.id}" class="update button-primary">Update</button>
            <button type="button" class="cancel">Cancel</button>
        </div>
    `;
};

const getItemHTML = (item) => {
    return `<div>
        <div class="controls">
            <i class="fas fa-edit edit" id="${item.id}"></i>
            <i class="fas fa-trash delete" id="${item.id}"></i>
        </div>
        <label>id:</label><span>${item.Id}</span><br>
        <label>Nome:</label><span><strong>${item.Nome}</strong></span><br>
        <label>DataCriacao:</label><span>${item.DataCriacao}</span><br>
        <label>DataAlteracao:</label><span>${item.DataCriacao}</span><br>
        <label>avatar:</label><img src="${item.avatar}" />
    </div>`;
};

const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `
        <div class="card-wrapper">${itemHTML}</div>
    `;
};

const displayData = (data) => {
    console.log(data)
    const container = document.querySelector("#container");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
};

issueGetRequest();