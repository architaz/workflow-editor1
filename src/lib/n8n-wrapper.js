import { NodeLibraries } from './node-libraries.js'

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
    return await NodeLibraries.httpRequest(this.parameters);
  }
}

export class SlackWrapper {
  constructor(config) {
    this.config = config;
    this.credentials = config.credentials || {};
    this.parameters = config.parameters || {};
  }

  async execute() {
    return await NodeLibraries.slack({
      ...this.parameters,
      token: this.credentials.token
    });
  }
}

export class GoogleSheetsWrapper {
  constructor(config) {
    this.config = config;
    this.parameters = config.parameters || {};
    this.credentials = config.credentials || {};
  }

  async execute() {
    return await NodeLibraries.googleSheets({
      ...this.parameters,
      credentials: this.credentials
    });
  }
}

export class EmailSendWrapper {
  constructor(config) {
    this.config = config;
    this.parameters = config.parameters || {};
    this.credentials = config.credentials || {};
  }

  async execute() {
    return await NodeLibraries.email({
      ...this.parameters,
      credentials: this.credentials
    });
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

// Export all wrappers - THIS IS IMPORTANT!
export const n8nWrappers = {
  HTTPRequestWrapper,
  SlackWrapper,
  GoogleSheetsWrapper,
  EmailSendWrapper,
  WebhookWrapper
}