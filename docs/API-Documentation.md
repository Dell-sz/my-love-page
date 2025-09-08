# API Documentation - My Love Page

Gerado automaticamente em 09/07/2025 10:17:20

## Endpoints

### Health Check
- **Endpoint:** GET /api/health
- **DescriÃ§Ã£o:** Verifica se a API estÃ¡ funcionando
- **Exemplo de Response:**
{
    "success":  true,
    "message":  "API is running"
}

### AutenticaÃ§Ã£o

#### Registro
- **Endpoint:** POST /api/auth/register
- **DescriÃ§Ã£o:** Registra um novo usuÃ¡rio
- **Exemplo de Request:**
`json
{
  "name": "Teste",
  "email": "teste@teste.com",
  "password": "123456"
}
`
- **Exemplo de Response:**
{
    "success":  true,
    "data":  {
                 "user":  {
                              "id":  "68bd85de3ff0fc7692810db8",
                              "name":  "Teste3",
                              "email":  "teste3@teste.com"
                          },
                 "token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YmQ4NWRlM2ZmMGZjNzY5MjgxMGRiOCIsImlhdCI6MTc1NzI1MTAzOCwiZXhwIjoxNzU3ODU1ODM4fQ.CF6oo5W6RqTgzHNcm1b7mPuuzlbhJVgycGZR13ltHiw"
             }
}

#### Login
- **Endpoint:** POST /api/auth/login
- **DescriÃ§Ã£o:** Faz login e retorna token JWT
- **Exemplo de Request:**
`json
{
  "email": "teste@teste.com",
  "password": "123456"
}
`
- **Exemplo de Response:**
{
    "success":  true,
    "data":  {
                 "user":  {
                              "id":  "68bd85de3ff0fc7692810db8",
                              "name":  "Teste3",
                              "email":  "teste3@teste.com"
                          },
                 "token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YmQ4NWRlM2ZmMGZjNzY5MjgxMGRiOCIsImlhdCI6MTc1NzI1MTAzOCwiZXhwIjoxNzU3ODU1ODM4fQ.CF6oo5W6RqTgzHNcm1b7mPuuzlbhJVgycGZR13ltHiw"
             }
}

### MemÃ³rias

#### Criar MemÃ³ria
- **Endpoint:** POST /api/memories
- **DescriÃ§Ã£o:** Cria uma nova memÃ³ria (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Request:**
`json
{
  "title": "Minha memÃ³ria",
  "description": "DescriÃ§Ã£o da memÃ³ria"
}
`
- **Exemplo de Response:**


#### Listar MemÃ³rias
- **Endpoint:** GET /api/memories
- **DescriÃ§Ã£o:** Lista todas as memÃ³rias do usuÃ¡rio (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Response:**


#### Atualizar MemÃ³ria
- **Endpoint:** PUT /api/memories/{id}
- **DescriÃ§Ã£o:** Atualiza uma memÃ³ria existente (requer token JWT)
- **Headers:** Authorization: Bearer {token}
- **Exemplo de Request:**
`json
{
  "title": "TÃ­tulo atualizado",
  "description": "DescriÃ§Ã£o atualizada"
}
`

#### Deletar MemÃ³ria
- **Endpoint:** DELETE /api/memories/{id}
- **DescriÃ§Ã£o:** Deleta uma memÃ³ria (requer token JWT)
- **Headers:** Authorization: Bearer {token}

## CÃ³digos de Erro

- **400 Bad Request:** Dados invÃ¡lidos (ex.: tÃ­tulo vazio)
- **401 Unauthorized:** Token ausente, invÃ¡lido ou expirado
- **404 Not Found:** Recurso nÃ£o encontrado
- **500 Internal Server Error:** Erro interno do servidor

## Notas

- Todos os endpoints de memÃ³ria requerem autenticaÃ§Ã£o via JWT no header Authorization
- O token JWT tem expiraÃ§Ã£o, faÃ§a login novamente se necessÃ¡rio
- Testes executados com usuÃ¡rios: teste1@teste.com, teste2@teste.com, teste3@teste.com
