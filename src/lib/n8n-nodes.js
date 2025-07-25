import { NodeLibraries } from './node-libraries.js'

// Production-ready node implementations using real APIs
export class HTTPRequestNode {
  constructor(config) {
    this.config = config
    this.parameters = config.parameters || {}
    this.credentials = config.credentials || {}
  }

  async execute() {
    return await NodeLibraries.httpRequest({
      ...this.parameters,
      auth: this.credentials
    })
  }
}

export class SlackNode {
  constructor(config) {
    this.config = config
    this.parameters = config.parameters || {}
    this.credentials = config.credentials || {}
  }

  async execute() {
    return await NodeLibraries.slack({
      ...this.parameters,
      token: this.credentials.token
    })
  }
}

export class GoogleSheetsNode {
  constructor(config) {
    this.config = config
    this.parameters = config.parameters || {}
    this.credentials = config.credentials || {}
  }

  async execute() {
    return await NodeLibraries.googleSheets({
      ...this.parameters,
      credentials: this.credentials
    })
  }
}

export class EmailSendNode {
  constructor(config) {
    this.config = config
    this.parameters = config.parameters || {}
    this.credentials = config.credentials || {}
  }

  async execute() {
    return await NodeLibraries.email({
      ...this.parameters,
      credentials: this.credentials
    })
  }
}

export class WebhookNode {
  constructor(config) {
    this.config = config
    this.parameters = config.parameters || {}
    this.credentials = config.credentials || {}
  }

  async execute() {
    return await NodeLibraries.webhook(this.parameters)
  }
}

// Simple node loader that always works
export const nodeLoader = {
  async loadNode(nodeType) {
    const nodeMap = {
      'http-request': HTTPRequestNode,
      'slack': SlackNode,
      'google-sheets': GoogleSheetsNode,
      'email-send': EmailSendNode,
      'webhook': WebhookNode
    }
    
    const NodeClass = nodeMap[nodeType]
    if (!NodeClass) {
      throw new Error(`Unknown node type: ${nodeType}`)
    }
    
    console.log(`✓ Loaded enhanced node: ${nodeType}`)
    return NodeClass
  },

  async checkN8nAvailability() {
    return {
      'http-request': 'enhanced-library',
      'slack': 'enhanced-library',
      'google-sheets': 'enhanced-library',
      'email-send': 'enhanced-library',
      'webhook': 'enhanced-library'
    }
  }
}

// Factory functions
export const n8nNodes = {
  async createNode(nodeType, config) {
    const NodeClass = await nodeLoader.loadNode(nodeType)
    return new NodeClass(config)
  },

  async getAvailableNodes() {
    return await nodeLoader.checkN8nAvailability()
  }
}

export default n8nNodes