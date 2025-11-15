# Teddy URL Shortener — API de Encurtamento de URLs (NestJS + Multi-Tenant)

Este projeto é um **encurtador de URLs completo**, construído com **NestJS**, **TypeORM**, **PostgreSQL** e suporte a **multi-tenant**.  
Ele inclui autenticação JWT, operações de CRUD para links encurtados, contagem de cliques, redirecionamento automático, validações robustas, documentação Swagger e suporte para Docker.

## Funcionalidades

### Autenticação e Usuários
- Registro com e-mail, senha e **associação a um tenant**
- Login com JWT
- Suporte a múltiplos tenants
- Proteção de rotas

### Encurtamento de URLs
- Geração de código único
- Registro do tenant e do usuário
- Soft delete
- Listagem paginada

### Redirecionamento Automático
`GET /:code` — redireciona para a URL original e contabiliza clique.

### Recuperação de Senha
- Token de 6 dígitos enviado por e-mail
- Reset de senha seguro

### Testes
- Unitários e E2E com Jest / Supertest

### Swagger
`http://localhost:3000/api`

### Docker
Suporte completo para docker-compose.

---

# Como Rodar

## 1. Clonar
```sh
git clone https://github.com/GenPXM/TeddyOpen.git
cd teddy-api
```

## 2. Criar .env , tem uma .example.env para seguir o padrão.
```env
APP_PORT=3000
APP_BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=url_shortener
JWT_SECRET=secret
JWT_EXPIRES_IN=86400

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=email@gmail.com
MAIL_PASS=senha
MAIL_FROM="Teddy <email@gmail.com>"
MAIL_SECURE=false
```

## 3. Docker
```sh
docker-compose up -d
```
*para ter um banco de dados visual acesse:

```sh
docker compose -f adminer.yml up -d
```
e faça o login de acordo com as suas credencias do banco de dados 
do .env
entre na url pelo navegador http://localhost:8080/?pgsql=postgres

Sistema	= PostgreSQL
Servidor= postgres
Usuário	= seu_usuario
Senha	= sua_senha
Base de dados = url_shortener


## 4. Instalar dependências
```sh
npm install
```

## 5. Rodar migrations
```sh
npm run migration:run
```

## 6. Iniciar
```sh
npm run start
```

---

# Endpoints Principais

## Auth
POST `/auth/register`  
POST `/auth/login` 
POST `/auth/forgot-password`  
POST `/auth/reset-password`  

*Na redefinição de senha tem que configurar as credenciais de email na .env caso for 
usar esse endpoint para testar.
Exemplo de email de redefinição recebido:

<Você solicitou a redefinição de senha no tenant Teddy 360.

Seu token de redefinição é:

M9MNCb

Esse token é válido por alguns minutos.

Se você não solicitou essa redefinição, apenas ignore este email.>

## Tenants
POST `/tenants`

## Shortener
POST `/shorten`  
GET `/:code` -> este endpoint tem que ser acessado diretamente copiando a url 
gerada pelo encurtador e colocando a url no navegador, pois se for diretamente pelo 
Swagger dara erro de CORS pois os redirect é bloqueado devido as configurações do site 
de origem de não aceitar localhost diretamente.  

## Meus Links (JWT), precisa autenticar com o token gerado depois de efetuar o login
GET `/me/links`  
PATCH `/me/links/:id`  
DELETE `/me/links/:id`


---

# Testes
```sh
npm test
npm run test:e2e
```

---

# Swagger
`http://localhost:3000/api`

---

# Pontos de Melhoria (Escalabilidade)
- Implementar cache Redis para redirecionamentos
- Configurar API Gateway (Kong ou KrakeD)
- Criar monorepo separando Auth e Shortener
- Instrumentação real com Sentry/Datadog
- Publicar helm charts para Kubernetes
- Implementar fila de envio de e-mail (BullMQ)
- Registrar métricas Prometheus
- Aplicar circuit breaker e retry patterns

---

MIT License
