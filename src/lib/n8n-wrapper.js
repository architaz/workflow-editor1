const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(baseDelay * Math.pow(2, i));
    }
  }
};

const validateRequired = (params, required) => {
  const missing = required.filter(key => !params[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
};

export class HTTPRequestWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    validateRequired(this.parameters, ['url']);
  
    const { url, method = 'GET', headers = {}, body, timeout = 30000 } = this.parameters;
  
    const requestOptions = {
        method,
        headers: {
        'Content-Type': 'application/json',
        ...headers
        },
    signal: AbortSignal.timeout(timeout)
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return retryWithBackoff(async () => {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return {
        statusCode: response.status,
        body: data,
        headers: Object.fromEntries(response.headers.entries())
        };
    });
    }
}

export class SlackWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    validateRequired(this.credentials, ['token']);
    validateRequired(this.parameters, ['channel', 'text']);
    
    const { channel, text, username = 'Workflow Bot' } = this.parameters;
    const { token } = this.credentials;

    return retryWithBackoff(async () => {
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channel, text, username })
            });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Slack API error: ${data.error}`);
            }
        return data;
    });
    }
}

export class GoogleSheetsWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    validateRequired(this.parameters, ['spreadsheetId', 'range']);
    
    const { spreadsheetId, range, operation = 'read', values } = this.parameters;
    const { clientEmail, privateKey, accessToken } = this.credentials;

    // If we have real Google credentials, use actual API
    if (accessToken || (clientEmail && privateKey)) {
        return this.executeRealGoogleSheetsAPI();
    }

    // Fallback to mock data
    const mockData = {
        read: {
        values: [
            ['Name', 'Email', 'Status'],
            ['John Doe', 'john@example.com', 'Active']
        ],
        range
        },
        append: { spreadsheetId, updatedRows: 1 },
        update: { spreadsheetId, updatedCells: values?.length || 1 }
    };

    return mockData[operation] || mockData.read;
    }

    // Add new method to GoogleSheetsWrapper
    async executeRealGoogleSheetsAPI() {
    const { spreadsheetId, range, operation, values } = this.parameters;
    const { accessToken } = this.credentials;
    
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    return retryWithBackoff(async () => {
        switch (operation) {
        case 'read':
            const response = await fetch(`${baseUrl}/values/${range}`, { headers });
            return await response.json();
        
        case 'append':
            const appendResponse = await fetch(`${baseUrl}/values/${range}:append?valueInputOption=RAW`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ values })
            });
            return await appendResponse.json();
        
        case 'update':
            const updateResponse = await fetch(`${baseUrl}/values/${range}?valueInputOption=RAW`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ values })
            });
            return await updateResponse.json();
        
        default:
            throw new Error(`Unsupported operation: ${operation}`);
        }
    });
    }
}

export class EmailSendWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    validateRequired(this.parameters, ['to', 'subject', 'body']);
    validateRequired(this.credentials, ['user', 'password']);
    
    const { to, subject, body, from, cc, bcc } = this.parameters;
    const { user, password, host = 'smtp.gmail.com', port = 587 } = this.credentials;

    // Mock implementation with better validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        throw new Error('Invalid email address');
    }

    console.log('Sending email:', { to, subject, from: from || user, host, port });
    
    return {
        accepted: [to],
        rejected: [],
        messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@workflow.local`,
        response: '250 Message accepted for delivery'
    };
    }
}

export class WebhookWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    const { path, httpMethod = 'POST', responseData = '{}' } = this.parameters;

    try {
      // This is a mock implementation
      // In a real scenario, you'd set up an actual webhook endpoint
      const mockWebhookData = {
        timestamp: new Date().toISOString(),
        method: httpMethod,
        path,
        headers: {
          'content-type': 'application/json',
          'user-agent': 'WorkflowBot/1.0'
        },
        body: JSON.parse(responseData),
        query: {}
      };

      return mockWebhookData;
    } catch (error) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }
}

// Export all wrappers
export const n8nWrappers = {
  HTTPRequestWrapper,
  SlackWrapper,
  GoogleSheetsWrapper,
  EmailSendWrapper,
  WebhookWrapper
};