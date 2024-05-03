# Projeto teste para desenvolvedor Cadastra

Este é um projeto desenvolvido como teste para desenvolvedor na empresa Cadastra, em que o objetivo é desenvolver uma Página de Categoria de e-commerce listando os produtos de uma categoria(Blusas), com as funcionalidades de **filtro**, **ordenação**, **paginação** de produtos e para o **adicionar ao carrinho**, como diferencial foi desenvolvido a exibição do carrinho, que abre apenas clicando no ícone do carrinho. Também foi desenvolvida uma versão para celulares, garantindo a responsividade do layout. 

Além disso foi desenvolvida uma simples API utilizando Express.js no Node.js para **listar os produtos** e **filtros baseado nos produtos disponíveis**, além disso toda a lógica de filtro/ordenação/paginação também está sendo feita pelo Back-end.

----

### Contato

- Email: [rafa.eto@hotmail.com](mailto:rafa.eto@hotmail.com)
- Linkedin: [https://www.linkedin.com/in/rafaeltanakaeto/](https://www.linkedin.com/in/rafaeltanakaeto/)

----

## Especificações

### Ferramentas do projeto

- Html5, css3;
- Javascript/Typescript;
- Consumo de APIs.
- Git;
- Gulp;
- Sass;
- Nodejs
- Express.js

### Layout para o teste

O layout se encontra no [figma](https://www.figma.com/file/Z5RCG3Ewzwm7XIPuhMUsBZ/Desafio-Cadastra?type=design&node-id=0%3A1&mode=design&t=A0G2fRjMSrcQjchw-1).

----

### Dependências

Segue instruções para instalar dependências e rodar o projeto no front e back-end.

**Importante**: A versão do Node.js utilizada no projeto foi a 14.21.3.

- #### Front-End

  Na raíz do projeto, abra um terminal e execute o comando `npm install`

  Para buildar e inicializar o front-end, execute o comando `npm start`

- #### Back-End

  Abra um novo terminal, acesse o diretório "service" e execute o comando `npm install`

  Para buildar e rodar a API, execute o comando `npm start`

- #### A api está sendo rodada na porta 5001 do localhost, possuindo as rotas **/products** e **/filter**, onde a rota de produtos recebe todos os parâmetros para realizar a filtragem.
