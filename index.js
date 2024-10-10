localStorage.clear();
const handleLoading = (loading) => {
    if (loading) document.querySelector('.loading').classList.remove('hide');
    else document.querySelector('.loading').classList.add('hide');
}

const getNumber = (item) => Number(localStorage.getItem(item));

const skipTo = (goTo, specific) => {
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
        const page = getNumber('page');
        const total_page = getNumber('total_page');

        hideButtons(page == 1, [first, second]);
        hideButtons(page == total_page, [third, fourth]);
        fracao.querySelector('.page').value = page;
        fracao.querySelector('.total').textContent = total_page;
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

const applyHachura = (pos, altura) => {
    const hachura = document.querySelector('.hachura');
    const posicaoInicial = getNumber(['posicao_inicial', altura ? 'y' : 'x' ].join('_'));
    const tamanho = (posicaoInicial - pos) * -1;

    if (!(tamanho <= 0)) {
        if (altura) hachura.style.height = tamanho + 'px';
        else hachura.style.width = tamanho + 'px';
        return;
    }

    const tamanhoInvertido = tamanho * -1; 
    const novaPosicao = posicaoInicial - tamanhoInvertido;
    const novoTamanho = posicaoInicial - novaPosicao;

    if (altura) {
        hachura.style.top = novaPosicao + 'px';
        hachura.style.height = novoTamanho + 'px';
    } else {
        hachura.style.left = novaPosicao + 'px';
        hachura.style.width = novoTamanho + 'px';
    }
}

document.addEventListener('mousedown', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    const element = document.createElement('DIV');
    element.classList.add('hachura');
    element.style.left = e.pageX + "px";
    element.style.top = e.pageY + "px";

    document.body.append(element);
    localStorage.setItem('posicao_inicial_x', e.pageX);
    localStorage.setItem('posicao_inicial_y', e.pageY);
    localStorage.setItem('desenhando', 1);
});

document.addEventListener('mouseup', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    if (!getNumber('desenhando')) return;
    localStorage.setItem('desenhando', 0);
});

document.addEventListener('mousemove', e => {
    if (!getNumber('modo_de_desenho_ativo')) return;
    if (!getNumber('desenhando')) return;
    applyHachura(e.pageX);
    applyHachura(e.pageY, true);
});

let total_page = getNumber('total_page');
let page = getNumber('page');

if (!page) {
    page = 1;
    localStorage.setItem('page', page);
}

getContent(page);
