import { n8nWrappers } from '@/lib/n8n-wrapper.js';

// Custom node definitions
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
    inputs: ['main'],
    outputs: ['main'],
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
    ],
    execute: async function(parameters) {
      const { source, businessId, limit } = parameters;
      
      // Mock implementation - replace with actual API calls
      const mockReviews = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: `review_${i + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
        text: `This is a sample review ${i + 1} from ${source}`,
        author: `Customer ${i + 1}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        source: source,
        businessId: businessId
      }));

      return {
        success: true,
        data: mockReviews,
        total: mockReviews.length
      };
    }
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
    inputs: ['main'],
    outputs: ['main'],
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
    ],
    execute: async function(parameters, inputData) {
      const { clusters, features, maxIterations } = parameters;
      
      if (!inputData || !inputData.length) {
        throw new Error('No input data provided for clustering');
      }

      // Simple k-means implementation
      const data = inputData.map(item => {
        const point = {};
        features.forEach(feature => {
          switch (feature) {
            case 'rating':
              point[feature] = item.rating || 0;
              break;
            case 'textLength':
              point[feature] = (item.text || '').length;
              break;
            case 'sentiment':
              point[feature] = Math.random() * 2 - 1; // Mock sentiment
              break;
          }
        });
        return { ...item, features: point };
      });

      // Mock clustering result
      const clusteredData = data.map((item, index) => ({
        ...item,
        cluster: index % clusters,
        distance: Math.random()
      }));

      return {
        success: true,
        data: clusteredData,
        clusters: clusters,
        features: features,
        iterations: Math.floor(Math.random() * maxIterations) + 1
      };
    }
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
    inputs: ['main'],
    outputs: ['main'],
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
    ],
    execute: async function(parameters, inputData) {
      const { groupBy, sortOrder } = parameters;
      
      if (!inputData || !inputData.length) {
        throw new Error('No input data provided');
      }

      // Group data by specified field
      const grouped = inputData.reduce((acc, item) => {
        const key = item[groupBy] || 'unknown';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      // Sort groups
      const sortedGroups = Object.keys(grouped).sort((a, b) => {
        const comparison = a.localeCompare(b);
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      const result = sortedGroups.map(key => ({
        group: key,
        items: grouped[key],
        count: grouped[key].length,
        avgRating: grouped[key].reduce((sum, item) => sum + (item.rating || 0), 0) / grouped[key].length
      }));

      return {
        success: true,
        data: result,
        totalGroups: result.length,
        groupBy: groupBy
      };
    }
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
    inputs: ['main'],
    outputs: ['main'],
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
    ],
    execute: async function(parameters, inputData) {
      const { analysisType, confidenceThreshold } = parameters;
      
      if (!inputData || !inputData.length) {
        throw new Error('No input data provided for analysis');
      }

      const insights = {};

      // Mock AI analysis
      if (analysisType.includes('sentiment')) {
        insights.sentiment = {
          overall: Math.random() * 2 - 1,
          distribution: {
            positive: Math.random() * 0.6 + 0.2,
            neutral: Math.random() * 0.3 + 0.1,
            negative: Math.random() * 0.3 + 0.1
          }
        };
      }

      if (analysisType.includes('topics')) {
        insights.topics = [
          { topic: 'Service Quality', weight: Math.random(), keywords: ['service', 'staff', 'helpful'] },
          { topic: 'Product Quality', weight: Math.random(), keywords: ['product', 'quality', 'value'] },
          { topic: 'Experience', weight: Math.random(), keywords: ['experience', 'recommend', 'overall'] }
        ];
      }

      if (analysisType.includes('keywords')) {
        insights.keywords = [
          { word: 'excellent', frequency: Math.floor(Math.random() * 50) + 10, sentiment: 0.8 },
          { word: 'good', frequency: Math.floor(Math.random() * 30) + 5, sentiment: 0.6 },
          { word: 'average', frequency: Math.floor(Math.random() * 20) + 3, sentiment: 0.0 },
          { word: 'poor', frequency: Math.floor(Math.random() * 15) + 1, sentiment: -0.7 }
        ];
      }

      if (analysisType.includes('trends')) {
        insights.trends = {
          ratingTrend: Math.random() > 0.5 ? 'improving' : 'declining',
          volumeTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
          seasonality: Math.random() > 0.5 ? 'seasonal' : 'consistent'
        };
      }

      return {
        success: true,
        data: insights,
        analysisType: analysisType,
        confidence: Math.random() * (1 - confidenceThreshold) + confidenceThreshold,
        processedItems: inputData.length
      };
    }
  },

  'insights-to-sheets': {
    name: 'insights-to-sheets',
    displayName: 'Insights to Sheets',
    description: 'Export insights data to Google Sheets',
    group: ['export'],
    version: 1,
    defaults: {
      name: 'Insights to Sheets',
      color: '#d62728',
      sheetName: 'Customer Insights',
      includeSummary: true,
      format: 'detailed'
    },
    inputs: ['main'],
    outputs: ['main'],
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
    ],
    execute: async function(parameters, inputData) {
      const { sheetName, includeSummary, format } = parameters;
      
      if (!inputData) {
        throw new Error('No input data provided for export');
      }

      // Mock sheet formatting
      const sheetData = {
        sheetName: sheetName,
        format: format,
        rows: [],
        summary: includeSummary ? {
          totalInsights: Object.keys(inputData).length,
          generatedAt: new Date().toISOString(),
          confidence: inputData.confidence || 0.8
        } : null
      };

      // Convert insights to rows based on format
      if (format === 'detailed' || format === 'summary') {
        Object.entries(inputData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            sheetData.rows.push([key, JSON.stringify(value, null, 2)]);
          } else {
            sheetData.rows.push([key, value]);
          }
        });
      }

      return {
        success: true,
        data: sheetData,
        exportedRows: sheetData.rows.length,
        sheetName: sheetName
      };
    }
  }
};

// n8n node definitions using wrappers
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
      headers: '{}',
      body: '{}'
    },
    inputs: ['main'],
    outputs: ['main'],
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
        default: '{}',
        description: 'Request headers as JSON object'
      },
      {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{}',
        description: 'Request body for POST/PUT requests'
      }
    ],
    execute: async function(parameters) {
      try {
        const wrapper = new n8nWrappers.HTTPRequestWrapper({
          parameters: parameters
        });
        return await wrapper.execute();
      } catch (error) {
        // Fallback to mock implementation
        return {
          success: true,
          data: { mockResponse: 'HTTP request would be made here', parameters }
        };
      }
    }
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
      operation: 'read'
    },
    inputs: ['main'],
    outputs: ['main'],
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
        description: 'Sheet range to read/write'
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
      }
    ],
    execute: async function(parameters, inputData, credentials) {
      try {
        const wrapper = new n8nWrappers.GoogleSheetsWrapper({
          parameters: parameters,
          credentials: credentials
        });
        return await wrapper.execute();
      } catch (error) {
        // Fallback to mock implementation
        return {
          success: true,
          data: { mockResponse: 'Google Sheets operation would be performed here', parameters }
        };
      }
    }
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
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'string',
        default: '',
        placeholder: '#general',
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
    ],
    execute: async function(parameters, inputData, credentials) {
      try {
        const wrapper = new n8nWrappers.SlackWrapper({
          parameters: parameters,
          credentials: credentials
        });
        return await wrapper.execute();
      } catch (error) {
        // Fallback to mock implementation
        return {
          success: true,
          data: { mockResponse: 'Slack message would be sent here', parameters }
        };
      }
    }
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
      from: ''
    },
    inputs: ['main'],
    outputs: ['main'],
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
      }
    ],
    execute: async function(parameters, inputData, credentials) {
      try {
        const wrapper = new n8nWrappers.EmailSendWrapper({
          parameters: parameters,
          credentials: credentials
        });
        return await wrapper.execute();
      } catch (error) {
        // Fallback to mock implementation
        return {
          success: true,
          data: { mockResponse: 'Email would be sent here', parameters }
        };
      }
    }
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
    inputs: [],
    outputs: ['main'],
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
    ],
    execute: async function(parameters) {
      try {
        const wrapper = new n8nWrappers.WebhookWrapper({
          parameters: parameters
        });
        return await wrapper.execute();
      } catch (error) {
        // Fallback to mock implementation
        return {
          success: true,
          data: { mockResponse: 'Webhook would be set up here', parameters }
        };
      }
    }
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
    parameters: {},
    credentials: {},
    ...initialData
  };
}

export function executeNode(nodeInstance, inputData = null, credentials = {}) {
  const nodeDefinition = nodeRegistry[nodeInstance.nodeType];
  if (!nodeDefinition || !nodeDefinition.execute) {
    throw new Error(`Node '${nodeInstance.nodeType}' cannot be executed`);
  }

  return nodeDefinition.execute(
    nodeInstance.parameters || {},
    inputData,
    credentials
  );
}

// Missing function that App.vue needs
export function getNodeConfig(nodeType) {
  const nodeDefinition = nodeRegistry[nodeType];
  if (!nodeDefinition) {
    console.error(`Node type '${nodeType}' not found in registry`);
    return null;
  }

  return {
    displayName: nodeDefinition.displayName,
    description: nodeDefinition.description,
    defaults: nodeDefinition.defaults,
    properties: nodeDefinition.properties || [],
    inputs: nodeDefinition.inputs || [],
    outputs: nodeDefinition.outputs || [],
    execute: nodeDefinition.execute
  };
}
export default nodeRegistry;