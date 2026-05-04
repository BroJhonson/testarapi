# Universal API Client

Este é um script Python genérico para realizar requisições HTTP (GET, POST, PUT, DELETE, etc.) para qualquer API. Ele pode ser usado tanto via linha de comando (CLI) quanto importado como módulo em outros scripts Python.

## Pré-requisitos

Certifique-se de ter o Python instalado e a biblioteca `requests`.

```bash
pip install requests
```

## 1. Uso via Linha de Comando (Terminal)

O script aceita os seguintes argumentos principais:
- **`method`**: Método HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`, `HEAD`).
- **`url`**: URL completa da API.
- **`-p` ou `--params`**: Parâmetros de consulta (Query String) no formato `chave=valor`. Separados por espaço.
- **`-H` ou `--headers`**: Cabeçalhos da requisição (Headers) no formato `chave=valor`. Separados por espaço.
- **`-d` ou `--data`**: Dados do corpo da requisição em formato JSON (string).

### Exemplos Práticos:

**Exemplo 1: GET simples (Buscando um post)**
```bash
python universal_api_client.py GET "https://jsonplaceholder.typicode.com/posts/1"
```

**Exemplo 2: GET com parâmetros na URL**
Buscando comentários do post de ID 1 (Resultará em `?postId=1`).
```bash
python universal_api_client.py GET "https://jsonplaceholder.typicode.com/comments" -p "postId=1"
```

**Exemplo 3: Passando múltiplos parâmetros**
```bash
python universal_api_client.py GET "https://api.exemplo.com/dados" -p "pagina=1" "limite=50" "status=ativo"
```

**Exemplo 4: GET com envio de Headers (Chave de API)**
Como no caso do Portal da Transparência:
```bash
python universal_api_client.py GET "https://api.portaldatransparencia.gov.br/api-de-dados/licitacoes" -H "chave-api-dados=SUA_CHAVE_AQUI" -p "dataInicial=01/01/2024" "dataFinal=31/01/2024" "pagina=1"
```

**Exemplo 5: POST com envio de JSON (Body)**
```bash
python universal_api_client.py POST "https://jsonplaceholder.typicode.com/posts" -H "Content-Type=application/json" -d "{\"title\":\"Meu Titulo\", \"body\":\"Conteudo\", \"userId\":1}"
```

---

## 2. Uso Importando no seu Código Python

Você pode reutilizar a classe `UniversalAPIClient` em outros arquivos do seu projeto.

```python
from universal_api_client import UniversalAPIClient

# 1. Inicializa o cliente (você pode passar headers padrão aqui, opcionalmente)
cliente = UniversalAPIClient(default_headers={"User-Agent": "MeuApp/1.0"})

# 2. Fazendo a requisição
try:
    resposta = cliente.make_request(
        method="GET",
        url="https://api.portaldatransparencia.gov.br/api-de-dados/notas-fiscais",
        headers={"chave-api-dados": "SUA_CHAVE_AQUI"},
        params={"pagina": 1, "codigoOrgao": 25000},
        timeout=30 # Tempo limite de espera em segundos
    )

    # 3. Tratando o resultado
    print(f"Status Code: {resposta.status_code}")
    
    # Pegando a resposta como JSON (dicionário python)
    dados = resposta.json()
    print(dados)

except Exception as e:
    print(f"Erro ao acessar API: {e}")
```

## Dicas e Resolução de Problemas
- **Erro de Timeout (`Read timed out`)**: Ocorre quando o servidor demora mais do que o tempo limite definido (o padrão é 30 segundos) para responder. Servidores públicos, como o Portal da Transparência, às vezes ficam congestionados. Nesses casos, tente fazer a requisição de novo mais tarde.
- **Status 400 (Bad Request)**: Normalmente significa que a API exige algum parâmetro obrigatório que você não enviou, ou o enviou em um formato inválido. Leia sempre a documentação da API alvo.
- **Status 401 ou 403**: Problemas de autenticação. Sua chave API pode estar errada, vencida, ou não foi passada corretamente nos Headers (`-H`).
