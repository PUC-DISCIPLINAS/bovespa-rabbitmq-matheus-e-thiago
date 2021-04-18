# bovespa-rabbitmq

* [Matheus Felipe Ferreira Martins](https://github.com/MatheusFFM), matheus.martins.1215641@sga.pucminas.br
* [Thiago Jorge Queiroz Silva](https://github.com/ThiagoQueirozSilva), thiago.queiroz@sga.pucminas.br

---

_Curso de Engenharia de Software, Unidade Praça da Liberdade_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

_**Resumo**. Middlewares orientados a mensagens (MOM – Message Oriented Middlewares) são sistemas que permitem o envio de mensagens entre entidades de um sistema distribuído, esse trabalho utiliza dessa comunicação indireta por meio da tecnologia do RabbitMQ para desenvolver um sistema que simule uma bolsa de valores._

---

**1. Projeto da Solução**

    1.1. Requisitos funcionais

| No.           | Descrição                       | Prioridade |
| ------------- |:-------------------------------:| ----------:|
| {número       | Descrição resumida do requisito | {Alta      |
| sequencial    |                                 |  média     |
| identificador |                                 |  ou baixa  | 

    1.2. Tecnologias

Esse projeto possui uma simples api que utiliza a linguagem typescript, realizando uma conexão com o sistema de fila de mensagem e a amarração ao _topic exchange_ que segue a seguinte lógica:

![RabbitMQ Topic Exchange](img/RabbitMQ-Topics.png "RabbitMQ Topic Exchange")

Esse é o exemplo oficial, retirado do [tutorial do RabbitMQ de _topic exchange_](https://www.rabbitmq.com/tutorials/tutorial-five-python.html), basicamente, utilizando esse modelo teremos um _topic exchange_ que realiza um roteamento de mensagens de acordo com seu tópico, por exemplo, na imagem acima, o cliente 1 (C1) conectado a fila 1 (Q1) irá receber todas mensagens com o tópico _orange_, já o cliente 2 (C2) conectado a fila 2 (Q2), tem interesse em ouvir mensagens sobre _rabbit_ e _lazy_.

Isso permite a seleção de tópicos que o cliente deseja ouvir, fazendo com que sua conexão é configurada para receber apenas mensagens enviadas com esse tópico. A API é fornecida por meio do Express.js, um framework para o Node.js para a construção de aplicações web e  APIs.

O serviço de RabbitMQ está hospedado no CloudAMPQ uma aplicação de RabbitMQ _as a service_, que permite a monitoração e configuração de componentes do RabbitMQ.

A interface com o usuário utiliza das bibliotecas ReactJS e StyledComponents para a produção e estilização de componentes, juntamente com o framework NextJS para auxiliar no sistema de roteamento e o Axios, um cliente baseado em promessas HTTP para realizar a conexão com a REST API desenvolvida.

**2. Execução**
	
**3. Modelagem de dados**

Apresente o modelo de dados. Defina o dicionário de dados com os respectivos formatos e significados.

    3.1. Diagrama de Entidade-Relacionamento

Apresente a estrutura das tabelas de banco de dados no modelo Diagrama de Entidade-Relacionamento.

**4. Sistema desenvolvido**

Faça aqui uma breve descrição do software e coloque as principais telas com uma explicação de como usar cada uma.

**5. Conclusão**

