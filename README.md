# Autenticação Node + JWT

* Vamos criar uma **API** com Express e MongoDB;

* Onde teremos endpoints **públicos** e **privados**;

* Os privados precisam do **token** para serem acessados;

* O token é entregue **através do login** bem sucedido;

* Precisamos enviar o token pelo **header** da requisição;

* Um **middleware** valida se o token é válido ou não;

* **Não há persistência de sessão no backend**, tudo é feito pelo token;

## Dependencias

* **bcrypt**: usado para transformar os dados em um hash:

          npm install bcrypt

* **jsonwebtoken**: usado para manusear o token:
          
          npm install jsonwebtoken