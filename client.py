import requests
import json
import argparse
from typing import Dict, Any, Optional

class UniversalAPIClient:
    def __init__(self, default_headers: Optional[Dict[str, str]] = None):
        """
        Inicializa o cliente API. Pode receber cabeçalhos padrão.
        """
        self.session = requests.Session()
        if default_headers:
            self.session.headers.update(default_headers)

    def make_request(
        self,
        method: str,
        url: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Any] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout: int = 30
    ) -> requests.Response:
        """
        Faz uma requisição HTTP para a URL especificada.
        """
        method = method.upper()
        
        # Se os dados forem um dicionário, enviamos como JSON por padrão
        json_data = None
        if data is not None and isinstance(data, dict):
            json_data = data
            data = None # Limpa data para usar json_data
            
        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=json_data,
                data=data,
                headers=headers,
                timeout=timeout
            )
            # Não vamos levantar exceção automaticamente para permitir ver os erros 4xx e 5xx
            # response.raise_for_status() 
            return response
            
        except requests.exceptions.RequestException as e:
            print(f"Erro na requisição: {e}")
            raise

def parse_dict_args(arg_list):
    """Converte uma lista de strings 'chave=valor' em um dicionário"""
    if not arg_list:
        return None
    
    result = {}
    for item in arg_list:
        if '=' in item:
            key, value = item.split('=', 1)
            result[key] = value
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cliente Universal de API (via linha de comando)")
    parser.add_argument("method", choices=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], help="Método HTTP (ex: GET, POST)")
    parser.add_argument("url", help="URL completa da API")
    parser.add_argument("-p", "--params", nargs='*', help="Parâmetros de query no formato chave=valor")
    parser.add_argument("-H", "--headers", nargs='*', help="Cabeçalhos no formato Chave=Valor (ex: Authorization=\"Bearer token\")")
    parser.add_argument("-d", "--data", help="Dados do corpo da requisição em formato JSON (ex: '{\"nome\":\"teste\"}')")
    
    args = parser.parse_args()
    
    # Processa argumentos de linha de comando
    params = parse_dict_args(args.params)
    headers = parse_dict_args(args.headers)
    
    data = None
    if args.data:
        try:
            # Tenta interpretar como JSON
            data = json.loads(args.data)
        except json.JSONDecodeError:
            print("Aviso: Falha ao decodificar dados como JSON. O conteúdo será enviado como texto puro.")
            data = args.data
            
    client = UniversalAPIClient()
    
    print(f"Executando {args.method} em {args.url}...")
    print(f"Parâmetros: {params}")
    print(f"Cabeçalhos: {headers}")
    print(f"Dados: {data}")
    print(f"Corpo completo da url montada: {args.url}?{params}")
    try:
        response = client.make_request(
            method=args.method,
            url=args.url,
            params=params,
            data=data,
            headers=headers
        )
        
        print(f"\n--- RESUMO DA RESPOSTA ---")
        print(f"Status Code: {response.status_code}")
        
        print("\n--- CABEÇALHOS DA RESPOSTA ---")
        for k, v in response.headers.items():
            print(f"{k}: {v}")
            
        print("\n--- CORPO DA RESPOSTA ---")
        try:
            # Tenta exibir a resposta formatada como JSON
            parsed_json = response.json()
            print(json.dumps(parsed_json, indent=2, ensure_ascii=False))
        except ValueError:
            # Se não for JSON, exibe o texto normal
            if response.text:
                print(response.text)
            else:
                print("(Resposta sem corpo)")
            
    except Exception as e:
        print(f"\nFalha na execução do script: {e}")
