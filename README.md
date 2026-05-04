# Universal API Client & Nexus UI

Este projeto oferece uma solução completa para testar e interagir com APIs, fornecendo tanto uma ferramenta de linha de comando (CLI) poderosa quanto uma interface web (UI) moderna e inteligente chamada **Nexus**.

---

## 🚀 1. Interface Web (Nexus API)

A Nexus API é uma interface gráfica premium que permite gerenciar requisições de forma visual, com histórico persistente e design otimizado.

### Como usar pela Interface:
1. **Método e URL**: Selecione o método HTTP (GET, POST, etc.) e insira a URL da API no topo.
2. **Configuração**: Use as abas para alternar entre:
   - **Parâmetros**: Adicione chaves e valores para a query string.
   - **Headers**: Configure cabeçalhos como `Authorization` ou `Content-Type`.
   - **Corpo (JSON)**: Insira o payload para métodos como POST ou PUT.
3. **Envio**: Clique em "Enviar" para processar a requisição.
4. **Histórico**: Suas requisições ficam salvas na barra lateral esquerda para acesso rápido posterior.

### Como Inicializar Localmente:
Para rodar a interface na sua máquina, você pode usar o servidor embutido do Python:

```bash
# No diretório raiz do projeto, execute:
python -m http.server 8000
```

Após executar o comando, abra seu navegador e acesse:
👉 **http://localhost:8000**

---

## 💻 2. Uso via Linha de Comando (CLI)

Se preferir o terminal, o script `client.py` (ou `universal_api_client.py`) oferece controle total via argumentos.

### Argumentos Principais:
- **`method`**: Método HTTP (`GET`, `POST`, `PUT`, `DELETE`, etc).
- **`url`**: URL completa da API.
- **`-p` ou `--params`**: Parâmetros no formato `chave=valor`.
- **`-H` ou `--headers`**: Cabeçalhos no formato `chave=valor`.
- **`-d` ou `--data`**: Corpo da requisição em formato JSON.

### Exemplos Práticos:
```bash
# GET simples
python client.py GET "https://jsonplaceholder.typicode.com/posts/1"

# POST com JSON
python client.py POST "https://jsonplaceholder.typicode.com/posts" -H "Content-Type=application/json" -d "{\"title\":\"Teste\", \"body\":\"Conteúdo\"}"
```

---

## 🐍 3. Uso como Módulo Python

Você pode importar a classe `UniversalAPIClient` em seus próprios projetos:

```python
from client import UniversalAPIClient

cliente = UniversalAPIClient()
resposta = cliente.make_request("GET", "https://api.exemplo.com/dados")
print(resposta.json())
```

---

## 🛠️ Pré-requisitos
- **Python 3.x**
- Biblioteca **Requests**: `pip install requests`

## 💡 Dicas e Soluções
- **CORS**: Ao usar a interface web, algumas APIs podem bloquear o acesso devido a restrições de segurança do navegador. Nesses casos, prefira usar o CLI ou um proxy.
- **Timeout**: O padrão é 30 segundos. Em servidores lentos, a requisição pode falhar por tempo limite.
