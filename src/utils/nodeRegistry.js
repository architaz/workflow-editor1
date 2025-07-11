import { n8nNodes } from '@/lib/n8n-nodes';

const nodeRegistry = {
  'http-request': {
    component: () => import('@/components/nodes/HttpRequestNode.vue'),
    n8nClass: n8nNodes.HTTPRequestNode,
    defaults: {
      credentials: {},
      parameters: {
        url: '',
        method: 'GET'
      }
    }
  },
  'google-sheets': {
    component: () => import('@/components/nodes/GoogleSheetsNode.vue'),
    n8nClass: n8nNodes.GoogleSheetNode,
    defaults: {
      credentials: {},
      parameters: {
        spreadsheetId: '',
        range: 'A1:B2',
        operation: 'read'
      }
    }
  },
  'slack': {
    component: () => import('@/components/nodes/SlackNode.vue'),
    n8nClass: n8nNodes.SlackNode,
    defaults: {
      credentials: {},
      parameters: {
        channel: '',
        text: ''
      }
    }
  },
  'email-send': {
    component: () => import('@/components/nodes/EmailSendNode.vue'),
    n8nClass: n8nNodes.EmailSendNode,
    defaults: {
      credentials: {},
      parameters: {
        to: '',
        subject: '',
        body: ''
      }
    }
  },
  'webhook': {
    component: () => import('@/components/nodes/WebhookNode.vue'),
    n8nClass: n8nNodes.WebhookNode,
    defaults: {
      credentials: {},
      parameters: {
        path: '/webhook',
        httpMethod: 'POST',
        responseData: '{}'
      }
    }
  }
};

export function getNodeConfig(type) {
  return nodeRegistry[type];
}