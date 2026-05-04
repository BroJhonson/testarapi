async function sendRequest() {
    const url = document.getElementById('url').value;
    const method = document.getElementById('method').value;
    const bodyContent = document.getElementById('request-body').value;
    
    const responseArea = document.getElementById('response-area');
    const loader = document.getElementById('loader');
    const responseBody = document.getElementById('response-body');
    const statusContainer = document.getElementById('status-container');
    const responseTime = document.getElementById('response-time');
    const responseSize = document.getElementById('response-size');

    if (!url) {
        alert("Por favor, insira uma URL.");
        return;
    }

    // Show loader
    responseArea.style.display = 'none';
    loader.style.display = 'flex';

    // Collect headers
    const headers = {};
    document.querySelectorAll('#headers-list .key-value-row').forEach(row => {
        const key = row.querySelector('.header-key').value;
        const value = row.querySelector('.header-value').value;
        if (key) headers[key] = value;
    });

    // Collect params
    const params = new URLSearchParams();
    document.querySelectorAll('#params-list .key-value-row').forEach(row => {
        const key = row.querySelector('.param-key').value;
        const value = row.querySelector('.param-value').value;
        if (key) params.append(key, value);
    });

    const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
    
    const startTime = performance.now();

    try {
        const options = {
            method: method,
            headers: headers
        };

        if (['POST', 'PUT', 'PATCH'].includes(method) && bodyContent) {
            options.body = bodyContent;
        }

        const response = await fetch(finalUrl, options);
        const endTime = performance.now();
        
        const duration = Math.round(endTime - startTime);
        responseTime.innerText = `${duration}ms`;

        statusContainer.innerText = `${response.status} ${response.statusText}`;
        statusContainer.className = `status-badge ${response.ok ? 'status-success' : 'status-error'}`;

        let data;
        const contentType = response.headers.get("content-type");
        const rawText = await response.text();
        
        responseSize.innerText = `${(rawText.length / 1024).toFixed(2)} KB`;

        try {
            if (contentType && contentType.includes("application/json")) {
                data = JSON.parse(rawText);
                responseBody.innerText = JSON.stringify(data, null, 2);
            } else {
                responseBody.innerText = rawText || "(Corpo vazio)";
            }
        } catch (e) {
            responseBody.innerText = rawText;
        }

        addToHistory(method, url);

    } catch (error) {
        const endTime = performance.now();
        responseTime.innerText = `${Math.round(endTime - startTime)}ms`;
        
        statusContainer.innerText = "Erro de Rede / CORS";
        statusContainer.className = "status-badge status-error";
        responseBody.innerText = `Falha ao conectar: ${error.message}\n\nNota: Isso pode ser devido a restrições de CORS no seu navegador. Algumas APIs não permitem acesso direto via scripts de outros domínios.`;
    } finally {
        loader.style.display = 'none';
        responseArea.style.display = 'block';
    }
}

function addToHistory(method, url) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item animate-fade';
    
    const shortUrl = url.length > 30 ? url.substring(0, 27) + '...' : url;
    
    historyItem.innerHTML = `
        <span class="method method-${method}">${method}</span>
        <span style="font-size: 0.8rem; opacity: 0.7;">${shortUrl}</span>
    `;
    
    historyItem.onclick = () => {
        document.getElementById('url').value = url;
        document.getElementById('method').value = method;
    };

    if (historyList.firstChild) {
        historyList.insertBefore(historyItem, historyList.firstChild);
    } else {
        historyList.appendChild(historyItem);
    }

    // Persist in localStorage
    const history = JSON.parse(localStorage.getItem('api_history') || '[]');
    history.unshift({ method, url, timestamp: new Date().getTime() });
    localStorage.setItem('api_history', JSON.stringify(history.slice(0, 20)));
}

// Load history on start
window.onload = () => {
    const history = JSON.parse(localStorage.getItem('api_history') || '[]');
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const shortUrl = item.url.length > 30 ? item.url.substring(0, 27) + '...' : item.url;
        historyItem.innerHTML = `
            <span class="method method-${item.method}">${item.method}</span>
            <span style="font-size: 0.8rem; opacity: 0.7;">${shortUrl}</span>
        `;
        historyItem.onclick = () => {
            document.getElementById('url').value = item.url;
            document.getElementById('method').value = item.method;
        };
        historyList.appendChild(historyItem);
    });
};
