class HachuraClass {
    constructor() {
        this.data = {
            id: null,
            x: null,
            y: null,
            altura: null,
            largura: null,
            page_id: null
        }
    }

    get = (request) => {
        let hachuras = JSON.parse(localStorage.getItem('hachuras'));

        if (request?.id) [hachuras] = hachuras.filter(hachura => request.id == hachura.id);
        if (request?.page_id) hachuras = hachuras.filter(hachura => hachura.page_id == request.page_id);
        if (request?.except_id) hachuras = hachuras.filter(hachura => hachura.id != request.except_id);

        return hachuras;
    }

    create = (request) => {
        this.data = {
            ...request,
            id: new Date().getTime()
        };

        const hachuras = JSON.parse(localStorage.getItem('hachuras'));

        hachuras.push(this.data);

        localStorage.setItem('hachuras', JSON.stringify(hachuras));
        return this.data;
    }

    createElement = (hachura) => {
        const element = document.createElement('DIV');
        element.classList.add('hachura');
        element.dataset.id = hachura.id;
        element.style.left = hachura.x + "px";
        element.style.top = hachura.y + "px";
        element.style.width = hachura.largura + "px";
        element.style.height = hachura.altura + "px";
        element.onclick = () => {
            this.destroy(hachura.id);
            this.destroyElement(hachura.id);
        }
    
        document.body.append(element);
    }

    update = (request) => {
        let hachuras = this.get();
        hachuras = hachuras.map(hachura => hachura.id == request.id ? request : hachura);
        localStorage.setItem('hachuras', JSON.stringify(hachuras)); 
    }

    updateElement = (request) => {
        const hachura = this.get({ id: request.hachura_id });
        const element = document.querySelector(`.hachura[data-id="${hachura.id}"]`);

        const posicaoInicial = getNumber(request.atualizaAltura ? 'y' : 'x');
        const tamanho = (posicaoInicial - request.pos) * -1;
    
        if (!(tamanho <= 0)) {
            if (request.atualizaAltura) {
                element.style.height = tamanho + 'px';
                hachura.altura = tamanho;
            }
            else {
                element.style.width = tamanho + 'px';
                hachura.largura = tamanho;
            }

            return hachura;
        }
    
        const tamanhoInvertido = tamanho * -1; 
        const novaPosicao = posicaoInicial - tamanhoInvertido;
        const novoTamanho = posicaoInicial - novaPosicao;
    
        if (request.atualizaAltura) {
            element.style.top = novaPosicao + 'px';
            element.style.height = novoTamanho + 'px';
            hachura.y = novaPosicao;
            hachura.altura = novoTamanho;
        } else {    
            element.style.left = novaPosicao + 'px';
            element.style.width = novoTamanho + 'px';
            hachura.x = novaPosicao;
            hachura.largura = novoTamanho;
        }
    
        return hachura;
    }

    clearElements = () => {
        const hachuras = document.querySelectorAll('.hachura');
        Array.from(hachuras).map(hachura => hachura.remove());
    }

    destroy = (id) => {
        const hachuras = this.get({ except_id: id });
        localStorage.setItem('hachuras', JSON.stringify(hachuras));
    }

    destroyElement = (id) => document.querySelector(`[data-id="${id}"]`).remove();
}
