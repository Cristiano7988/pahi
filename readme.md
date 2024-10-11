### Requisito 1:

# a) Botão para ativar o modo desenho

Para criação desse botão eu fiz uso do toggle class para ativar ou desativar o modo desenho. Eu registro a informação na localStorage para que assim possa validar no evento que escuta os clickes se o usuário poderá ou não criar as hachuras.

# b) Mudança de cor do botão

O botão muda de cor de acordo com a classe que ele recebe.

# c) Multiplas hachuras

O usuário pode salvar várias hachuras por página. Aqui eu utilizei uma arquitetura que remete ao modelo MVC. A Classe Hachura é utilizada para manipular os elementos salvos na localStorage e os elementos da DOM. Nesse modelo a relação entre hachuras e páginas começa a ficar semelhante a uma arquitetura de banco de dados relacional (O próximo passo a partir daqui talvez seria criar uma classe para as páginas).

### Requisito 2:

A exclusão das hachuras acontecem com auxilio da classe Hachura, utilizando o método destroy.

### Requisito 3:

Não foi aplicado para preservar as hachuras junto com a imagem ao dar o zoom na página.

### Requisito 4:

A navegação faz uso da localstorage para salvar as páginas.