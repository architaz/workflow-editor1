import { n8nWrappers } from './n8n-wrapper.js';

// Node path mapping for your n8n submodule
const NODE_PATHS = {
  'http-request': './n8n/packages/nodes-base/nodes/HttpRequest/HttpRequest.node.js',
  'slack': './n8n/packages/nodes-base/nodes/Slack/Slack.node.js', 
  'google-sheets': './n8n/packages/nodes-base/nodes/Google/Sheets/GoogleSheets.node.js',
  'email-send': './n8n/packages/nodes-base/nodes/EmailSend/EmailSend.node.js',
  'webhook': './n8n/packages/nodes-base/nodes/Webhook/Webhook.node.js'
};

// Fallback wrapper mapping
const WRAPPER_MAP = {
  'http-request': n8nWrappers.HTTPRequestWrapper,
  'slack': n8nWrappers.SlackWrapper,
  'google-sheets': n8nWrappers.GoogleSheetsWrapper,
  'email': n8nWrappers.EmailSendWrapper,
  'webhook': n8nWrappers.WebhookWrapper
};

// Enhanced node loader with fallback mechanism
export const nodeLoader = {
  async loadNode(nodeType) {
    // First try to load real n8n node
    try {
      const nodePath = NODE_PATHS[nodeType];
      if (!nodePath) {
        throw new Error(`Unknown node type: ${nodeType}`);
      }

      // Try multiple possible paths for your n8n submodule
      const possiblePaths = [
        `../lib/n8n/packages/nodes-base/nodes/${nodePath}`,
        `./lib/n8n/packages/nodes-base/nodes/${nodePath}`,
        `../../n8n/packages/nodes-base/nodes/${nodePath}`
      ];

      for (const path of possiblePaths) {
        try {
          const nodeModule = await import(path);
          console.log(`✓ Loaded real n8n node: ${nodeType} from ${path}`);
          return nodeModule.default || nodeModule;
        } catch (err) {
          continue; // Try next path
        }
      }
      
      throw new Error('No valid n8n node path found');
    } catch (error) {
      console.warn(`⚠ Real n8n node not available for ${nodeType}, using wrapper:`, error.message);
      
      // Fallback to wrapper
      const WrapperClass = WRAPPER_MAP[nodeType];
      if (!WrapperClass) {
        throw new Error(`No wrapper available for node type: ${nodeType}`);
      }
      
      return WrapperClass;
    }
  },

  // Check if real n8n nodes are available
  async checkN8nAvailability() {
    const results = {};
    for (const nodeType of Object.keys(NODE_PATHS)) {
      try {
        await this.loadNode(nodeType);
        results[nodeType] = 'available';
      } catch (error) {
        results[nodeType] = 'wrapper-only';
      }
    }
    return results;
  }
};

// Enhanced exports with lazy loading
export const HTTPRequestNode = {
  async create(config) {
    const NodeClass = await nodeLoader.loadNode('http-request');
    return new NodeClass(config);
  }
};

export const SlackNode = {
  async create(config) {
    const NodeClass = await nodeLoader.loadNode('slack');
    return new NodeClass(config);
  }
};

export const GoogleSheetsNode = {
  async create(config) {
    const NodeClass = await nodeLoader.loadNode('google-sheets');
    return new NodeClass(config);
  }
};

export const EmailSendNode = {
  async create(config) {
    const NodeClass = await nodeLoader.loadNode('email');
    return new NodeClass(config);
  }
};

export const WebhookNode = {
  async create(config) {
    const NodeClass = await nodeLoader.loadNode('webhook');
    return new NodeClass(config);
  }
};

// Main nodes object with factory methods
export const n8nNodes = {
  HTTPRequestNode,
  SlackNode,
  GoogleSheetsNode,
  EmailSendNode,
  WebhookNode,
  
  // Utility methods
  async createNode(nodeType, config) {
    const NodeClass = await nodeLoader.loadNode(nodeType);
    return new NodeClass(config);
  },

  async getAvailableNodes() {
    return await nodeLoader.checkN8nAvailability();
  }
};

export default n8nNodes;