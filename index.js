const handleLoading = (loading) => {
    if (loading) document.querySelector('.loading').classList.remove('hide');
    else document.querySelector('.loading').classList.add('hide');
}

const getNumber = (item) => Number(localStorage.getItem(item));

const skipTo = (direction) => {
    const page = getNumber('page');
    const primeiraPagina = 1;
    const ultimaPagina = getNumber('total_page');
    let newPage = page + direction;

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
        fracao.querySelector('.page').textContent = page;
        fracao.querySelector('.total').textContent = total_page;
    })
    .catch(console.log);
}

let total_page = getNumber('total_page');
let page = getNumber('page');

if (!page) {
    page = 1;
    localStorage.setItem('page', page);
}

getContent(page);
