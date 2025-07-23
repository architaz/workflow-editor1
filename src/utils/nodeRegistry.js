import { n8nWrappers } from '@/lib/n8n-wrapper.js';

// Custom workflow node definitions (metadata only)
const customNodes = {
  'get-reviews': {
    name: 'get-reviews',
    displayName: 'Get Reviews',
    description: 'Fetch customer reviews from various sources',
    group: ['data'],
    version: 1,
    defaults: {
      name: 'Get Reviews',
      color: '#1f77b4',
      source: 'google',
      businessId: '',
      limit: 50
    },
    properties: [
      {
        displayName: 'Source',
        name: 'source',
        type: 'options',
        options: [
          { name: 'Google Reviews', value: 'google' },
          { name: 'Yelp', value: 'yelp' },
          { name: 'Amazon', value: 'amazon' },
          { name: 'TripAdvisor', value: 'tripadvisor' }
        ],
        default: 'google',
        required: true
      },
      {
        displayName: 'Business ID',
        name: 'businessId',
        type: 'string',
        default: '',
        placeholder: 'Enter business identifier',
        required: true
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Maximum number of reviews to fetch'
      }
    ]
  },

  'k-means': {
    name: 'k-means',
    displayName: 'K-Means Clustering',
    description: 'Perform K-means clustering on review data',
    group: ['analysis'],
    version: 1,
    defaults: {
      name: 'K-Means',
      color: '#2ca02c',
      clusters: 3,
      features: ['rating', 'textLength'],
      maxIterations: 100
    },
    properties: [
      {
        displayName: 'Number of Clusters',
        name: 'clusters',
        type: 'number',
        default: 3,
        description: 'Number of clusters to create'
      },
      {
        displayName: 'Features',
        name: 'features',
        type: 'multiOptions',
        options: [
          { name: 'Rating', value: 'rating' },
          { name: 'Text Length', value: 'textLength' },
          { name: 'Sentiment Score', value: 'sentiment' }
        ],
        default: ['rating', 'textLength'],
        required: true
      },
      {
        displayName: 'Max Iterations',
        name: 'maxIterations',
        type: 'number',
        default: 100,
        description: 'Maximum number of iterations'
      }
    ]
  },

  'clusters-to-list': {
    name: 'clusters-to-list',
    displayName: 'Clusters to List',
    description: 'Convert clustering results to organized lists',
    group: ['transform'],
    version: 1,
    defaults: {
      name: 'Clusters to List',
      color: '#ff7f0e',
      groupBy: 'cluster',
      sortOrder: 'asc'
    },
    properties: [
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'options',
        options: [
          { name: 'Cluster ID', value: 'cluster' },
          { name: 'Rating', value: 'rating' },
          { name: 'Source', value: 'source' }
        ],
        default: 'cluster',
        required: true
      },
      {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'options',
        options: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' }
        ],
        default: 'asc'
      }
    ]
  },

  'customer-insights': {
    name: 'customer-insights',
    displayName: 'Customer Insights',
    description: 'Generate AI-powered customer insights from review data',
    group: ['ai'],
    version: 1,
    defaults: {
      name: 'Customer Insights',
      color: '#9467bd',
      analysisType: ['sentiment', 'topics'],
      confidenceThreshold: 0.7
    },
    properties: [
      {
        displayName: 'Analysis Type',
        name: 'analysisType',
        type: 'multiOptions',
        options: [
          { name: 'Sentiment Analysis', value: 'sentiment' },
          { name: 'Topic Modeling', value: 'topics' },
          { name: 'Keyword Extraction', value: 'keywords' },
          { name: 'Trend Analysis', value: 'trends' }
        ],
        default: ['sentiment', 'topics'],
        required: true
      },
      {
        displayName: 'Confidence Threshold',
        name: 'confidenceThreshold',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 1,
          numberStepSize: 0.1
        },
        default: 0.7,
        description: 'Minimum confidence score for insights'
      }
    ]
  },

  'insights-to-sheets': {
    name: 'insights-to-sheets',
    displayName: 'Export to Sheets',
    description: 'Export insights data to Google Sheets',
    group: ['export'],
    version: 1,
    defaults: {
      name: 'Export to Sheets',
      color: '#d62728',
      sheetName: 'Customer Insights',
      includeSummary: true,
      format: 'detailed'
    },
    properties: [
      {
        displayName: 'Sheet Name',
        name: 'sheetName',
        type: 'string',
        default: 'Customer Insights',
        required: true
      },
      {
        displayName: 'Include Summary',
        name: 'includeSummary',
        type: 'boolean',
        default: true,
        description: 'Include a summary section in the sheet'
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'Detailed', value: 'detailed' },
          { name: 'Summary Only', value: 'summary' },
          { name: 'Raw Data', value: 'raw' }
        ],
        default: 'detailed'
      }
    ]
  }
};

// n8n node definitions (metadata only)
const n8nNodes = {
  'http-request': {
    name: 'http-request',
    displayName: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    group: ['communication'],
    version: 1,
    defaults: {
      name: 'HTTP Request',
      color: '#4f46e5',
      url: '',
      method: 'GET',
      headers: {},
      body: {},
      timeout: 30000
    },
    properties: [
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://api.example.com/data',
        required: true
      },
      {
        displayName: 'Method',
        name: 'method',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' }
        ],
        default: 'GET'
      },
      {
        displayName: 'Headers',
        name: 'headers',
        type: 'json',
        default: {},
        description: 'Request headers as JSON object'
      },
      {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: {},
        description: 'Request body for POST/PUT requests'
      },
      {
        displayName: 'Timeout (ms)',
        name: 'timeout',
        type: 'number',
        default: 30000,
        description: 'Request timeout in milliseconds'
      }
    ]
  },

  'google-sheets': {
    name: 'google-sheets',
    displayName: 'Google Sheets',
    description: 'Read from and write to Google Sheets',
    group: ['productivity'],
    version: 1,
    defaults: {
      name: 'Google Sheets',
      color: '#34a853',
      spreadsheetId: '',
      range: 'A1:Z1000',
      operation: 'read',
      values: []
    },
    properties: [
      {
        displayName: 'Spreadsheet ID',
        name: 'spreadsheetId',
        type: 'string',
        default: '',
        placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        required: true
      },
      {
        displayName: 'Range',
        name: 'range',
        type: 'string',
        default: 'A1:Z1000',
        description: 'Sheet range to read/write (e.g., A1:C10)'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Read', value: 'read' },
          { name: 'Append', value: 'append' },
          { name: 'Update', value: 'update' }
        ],
        default: 'read'
      },
      {
        displayName: 'Values',
        name: 'values',
        type: 'json',
        default: [],
        description: 'Data to write (for append/update operations)'
      }
    ]
  },

  'slack': {
    name: 'slack',
    displayName: 'Slack',
    description: 'Send messages to Slack channels',
    group: ['communication'],
    version: 1,
    defaults: {
      name: 'Slack',
      color: '#4a154b',
      channel: '',
      text: '',
      username: 'Workflow Bot'
    },
    properties: [
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'string',
        default: '',
        placeholder: '#general or @username',
        required: true
      },
      {
        displayName: 'Message',
        name: 'text',
        type: 'string',
        default: '',
        placeholder: 'Hello from the workflow!',
        required: true
      },
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        default: 'Workflow Bot',
        description: 'Username to display as sender'
      }
    ]
  },

  'email-send': {
    name: 'email-send',
    displayName: 'Email Send',
    description: 'Send emails via SMTP',
    group: ['communication'],
    version: 1,
    defaults: {
      name: 'Email Send',
      color: '#ea4335',
      to: '',
      subject: '',
      body: '',
      from: '',
      cc: '',
      bcc: ''
    },
    properties: [
      {
        displayName: 'To',
        name: 'to',
        type: 'string',
        default: '',
        placeholder: 'recipient@example.com',
        required: true
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        placeholder: 'Email subject',
        required: true
      },
      {
        displayName: 'Body',
        name: 'body',
        type: 'string',
        default: '',
        placeholder: 'Email body content',
        required: true
      },
      {
        displayName: 'From',
        name: 'from',
        type: 'string',
        default: '',
        placeholder: 'sender@example.com'
      },
      {
        displayName: 'CC',
        name: 'cc',
        type: 'string',
        default: '',
        placeholder: 'cc@example.com'
      },
      {
        displayName: 'BCC',
        name: 'bcc',
        type: 'string',
        default: '',
        placeholder: 'bcc@example.com'
      }
    ]
  },

  'webhook': {
    name: 'webhook',
    displayName: 'Webhook',
    description: 'Receive data via webhook',
    group: ['trigger'],
    version: 1,
    defaults: {
      name: 'Webhook',
      color: '#ff6b6b',
      path: '/webhook',
      httpMethod: 'POST',
      responseData: '{"status": "received"}'
    },
    properties: [
      {
        displayName: 'Webhook Path',
        name: 'path',
        type: 'string',
        default: '/webhook',
        placeholder: '/my-webhook',
        required: true
      },
      {
        displayName: 'HTTP Method',
        name: 'httpMethod',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' }
        ],
        default: 'POST'
      },
      {
        displayName: 'Response Data',
        name: 'responseData',
        type: 'json',
        default: '{"status": "received"}',
        description: 'Data to return in webhook response'
      }
    ]
  }
};

// Complete node registry
export const nodeRegistry = {
  ...customNodes,
  ...n8nNodes
};

// Utility functions
export function getAllNodeTypes() {
  return Object.keys(nodeRegistry);
}

export function getNodeByType(nodeType) {
  return nodeRegistry[nodeType];
}

export function getNodesByGroup(group) {
  return Object.values(nodeRegistry).filter(node => 
    node.group && node.group.includes(group)
  );
}

export function getAvailableGroups() {
  const groups = new Set();
  Object.values(nodeRegistry).forEach(node => {
    if (node.group) {
      node.group.forEach(g => groups.add(g));
    }
  });
  return Array.from(groups);
}

export function createNodeInstance(nodeType, initialData = {}) {
  const nodeDefinition = nodeRegistry[nodeType];
  if (!nodeDefinition) {
    throw new Error(`Node type '${nodeType}' not found in registry`);
  }

  return {
    id: `${nodeType}_${Date.now()}`,
    type: nodeType,
    name: nodeDefinition.defaults.name,
    nodeType: nodeType,
    definition: nodeDefinition,
    properties: nodeDefinition.properties || [],
    parameters: { ...nodeDefinition.defaults },
    credentials: {},
    ...initialData
  };
}

// Simplified execution - delegates to either custom logic or n8n wrappers
export async function executeNode(nodeInstance, inputData = null, credentials = {}) {
  const nodeType = nodeInstance.nodeType;
  const parameters = nodeInstance.parameters || {};
  
  // n8n nodes - use wrappers
  const n8nNodeTypes = ['http-request', 'google-sheets', 'slack', 'email-send', 'webhook'];
  
  if (n8nNodeTypes.includes(nodeType)) {
    try {
      // const { n8nWrappers } = await import('@/lib/n8n-wrapper.js')
      const wrapperMap = {
        'http-request': n8nWrappers.HTTPRequestWrapper,
        'google-sheets': n8nWrappers.GoogleSheetsWrapper,
        'slack': n8nWrappers.SlackWrapper,
        'email-send': n8nWrappers.EmailSendWrapper,
        'webhook': n8nWrappers.WebhookWrapper
      };
      
      const WrapperClass = wrapperMap[nodeType];
      if (!WrapperClass) {
        throw new Error(`No wrapper found for ${nodeType}`);
      }
      
      const wrapper = new WrapperClass({
        parameters,
        credentials
      });
      
      return await wrapper.execute();
    } catch (error) {
      console.error(`Error executing ${nodeType}:`, error);
      // Return mock result on error
      return {
        success: false,
        error: error.message,
        mockResult: `${nodeType} would execute with parameters: ${JSON.stringify(parameters)}`
      };
    }
  }
  
  // Custom nodes - mock execution for now
  return executeCustomNode(nodeType, parameters, inputData);
}

// Mock execution for custom workflow nodes
function executeCustomNode(nodeType, parameters, inputData) {
  const mockResults = {
    'get-reviews': {
      success: true,
      data: Array.from({ length: parameters.limit || 10 }, (_, i) => ({
        id: `review_${i + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
        text: `Sample review ${i + 1} from ${parameters.source || 'google'}`,
        author: `Customer ${i + 1}`,
        date: new Date().toISOString(),
        source: parameters.source || 'google'
      })),
      total: parameters.limit || 10
    },
    
    'k-means': {
      success: true,
      data: inputData?.map((item, index) => ({
        ...item,
        cluster: index % (parameters.clusters || 3),
        distance: Math.random()
      })) || [],
      clusters: parameters.clusters || 3,
      iterations: Math.floor(Math.random() * (parameters.maxIterations || 100))
    },
    
    'clusters-to-list': {
      success: true,
      data: inputData ? Object.values(
        inputData.reduce((acc, item) => {
          const key = item[parameters.groupBy] || 'unknown';
          if (!acc[key]) acc[key] = { group: key, items: [], count: 0 };
          acc[key].items.push(item);
          acc[key].count++;
          return acc;
        }, {})
      ) : [],
      groupBy: parameters.groupBy || 'cluster'
    },
    
    'customer-insights': {
      success: true,
      data: {
        sentiment: { overall: Math.random() * 2 - 1 },
        topics: ['Service Quality', 'Product Quality', 'Experience'],
        keywords: ['excellent', 'good', 'average', 'poor'],
        confidence: parameters.confidenceThreshold || 0.7
      },
      processedItems: inputData?.length || 0
    },
    
    'insights-to-sheets': {
      success: true,
      data: {
        sheetName: parameters.sheetName || 'Customer Insights',
        rowsExported: inputData ? Object.keys(inputData).length : 0,
        format: parameters.format || 'detailed'
      },
      exportedAt: new Date().toISOString()
    }
  };
  
  return mockResults[nodeType] || {
    success: true,
    message: `Mock execution of ${nodeType}`,
    parameters
  };
}

// Main function that App.vue uses
export function getNodeConfig(nodeType) {
  const nodeDefinition = nodeRegistry[nodeType];
  if (!nodeDefinition) {
    console.error(`Node type '${nodeType}' not found in registry`);
    return {
      displayName: nodeType,
      description: 'Unknown node type',
      defaults: { name: nodeType },
      properties: []
    };
  }

  return {
    displayName: nodeDefinition.displayName,
    description: nodeDefinition.description,
    defaults: nodeDefinition.defaults,
    properties: nodeDefinition.properties || [],
    group: nodeDefinition.group || [],
    version: nodeDefinition.version || 1
  };
}

export default nodeRegistry;
// export { executeNode }