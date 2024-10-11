const Hachura = new HachuraClass();

localStorage.removeItem('modo_de_desenho_ativo');

const handleLoading = (loading) => {
    if (loading) document.querySelector('.loading').classList.remove('hide');
    else document.querySelector('.loading').classList.add('hide');
}

const getNumber = (item) => Number(localStorage.getItem(item));

const skipTo = (goTo, specific) => {
    Hachura.clearElements();
    const page = getNumber('page');
    const primeiraPagina = 1;
    const ultimaPagina = getNumber('total_page');
    let newPage = specific ? goTo : page + goTo;

    if (newPage >= ultimaPagina) newPage = ultimaPagina;
    if (newPage <= primeiraPagina) newPage = primeiraPagina;

    localStorage.setItem('page', newPage );
    getContent(newPage);
}

const hideButtons = (condition, elements) => elements
    .map(element => condition
        ? element.classList.add('hide')
        : element.classList.remove('hide'));

const getContent = (page) => {
    handleLoading(true)

    const formData = new FormData();
    formData.append('page', page);

    fetch("https://api-hachuraservi1.websiteseguro.com/api/document", {
        method: "post",
        body: formData,
        headers: {  
            "Authorization": "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
        } 
    })
    .then(response => {
        if (!response.ok) throw new Error('Não foi possível realizar a requisição');

        const infoLiberadaPeloBE = 1493;
        const total_page = response.headers.get('total_page') ?? infoLiberadaPeloBE;
        localStorage.setItem('total_page', total_page);

        return response.json();
    })
    .then(response => {
        handleLoading();

        const element = document.querySelector('img');
        element.src = response.image;

        const [first, second, fracao, third, fourth] = document.querySelector('.nav').children
        const page_id = getNumber('page');
        const total_page = getNumber('total_page');

        hideButtons(page_id == 1, [first, second]);
        hideButtons(page_id == total_page, [third, fourth]);
        fracao.querySelector('.page').value = page_id;
        fracao.querySelector('.total').textContent = total_page;
        
        const hachuras = Hachura.get({ page_id });
        hachuras.map(hachura => Hachura.createElement(hachura));
    })
    .catch(console.log);
}

const startToDraw = (target) => {
    const { firstChild }  = target;
    const estavaAtivo = target.classList.contains("active");
    firstChild.textContent = estavaAtivo ? "Ativar" : "Desativar";
    localStorage.setItem('modo_de_desenho_ativo', estavaAtivo ? 0 : 1);
    target.classList.toggle("active");
}

const drawHachura = (pos, atualizaAltura) => {
    const payload = {
        hachura_id: getNumber('hachura_id'),
        atualizaAltura,
        pos
    }

    const hachura = Hachura.updateElement(payload);
    Hachura.update(hachura);
}

document.querySelector('.container-img').addEventListener('mousedown', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    const payload = { x: e.pageX, y: e.pageY, largura: 0, altura: 0, page_id: getNumber('page') };

    const hachura = Hachura.create(payload);
    Hachura.createElement(hachura);

    localStorage.setItem('x', e.pageX);
    localStorage.setItem('y', e.pageY);
    localStorage.setItem('hachura_id', hachura.id);
});

document.addEventListener('mouseup', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    if (!getNumber('hachura_id')) return;
    localStorage.setItem('hachura_id', 0);
});

document.querySelector('img').addEventListener('mousemove', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    if (!getNumber('hachura_id')) return;
    drawHachura(e.pageX);
    drawHachura(e.pageY, true);
});

if (!localStorage.getItem('hachuras')) localStorage.setItem('hachuras', JSON.stringify([])); 

let total_page = getNumber('total_page');
let page_id = getNumber('page');

hachuras = Hachura.get({ page_id });
hachuras.map(hachura => Hachura.createElement(hachura));

if (!page_id) {
    page_id = 1;
    localStorage.setItem('page', page_id);
}

getContent(page_id);
