// Import specific n8n nodes
import HTTPRequestNode from '../../lib/n8n/packages/nodes-base/nodes/HTTP/HTTPRequest.node.js';
import SlackNode from '../../lib/n8n/packages/nodes-base/nodes/Slack/Slack.node.js';
import GoogleSheetsNode from '../../lib/n8n/packages/nodes-base/nodes/Google/Sheets.node.js';
import EmailSendNode from '../../lib/n8n/packages/nodes-base/nodes/Email/Send.node.js';
import WebhookNode from '../../lib/n8n/packages/nodes-base/nodes/Webhook/Webhook.node.js';

export const n8nNodes = {
  HTTPRequestNode,
  SlackNode,
  GoogleSheetsNode,
  EmailSendNode,
  WebhookNode
};