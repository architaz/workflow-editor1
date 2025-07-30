# 🚀 Visual Workflow Editor

> **A modern Vue.js application for building and executing visual workflows with drag-and-drop functionality**

A professional-grade visual workflow editor built with Vue 3, Vue Flow, and Tailwind CSS. This application combines custom workflow nodes with integrated n8n automation nodes, enabling users to create sophisticated data processing workflows through an intuitive visual interface with real-time execution monitoring.

*![Screenshot of landing page](image.png) Main application interface showing the sidebar, canvas with workflow nodes and output panel*

---

## ✨ Key Features

- **🎨 Visual Workflow Builder** - Drag-and-drop interface for creating complex workflows
- **🔗 n8n Integration** - Native support for industry-standard n8n automation nodes
- **⚡ Real-time Execution** - Live progress tracking with animated status indicators  
- **🌐 Service Integrations** - Production-ready APIs for Slack, Google Sheets, HTTP, and SMTP
- **🧠 Custom Analytics** - Purpose-built customer insights and ML clustering nodes
- **📊 Advanced Processing** - K-means clustering, data transformation, and intelligent export
- **🌙 Modern UI/UX** - Responsive design with smooth animations and professional styling
- **⚙️ Dual Node System** - Both custom workflow nodes and standard n8n automation nodes

*<video controls src="20250730-0752-28.2321277.mp4" title="Demo Video"></video>* *Demo showing: dragging nodes → connecting them → running workflow → viewing results*

---

## 🏗️ Architecture Overview

### Frontend Stack
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Flow** - Advanced flow-based workflow editor
- **Tailwind CSS** - Utility-first CSS framework for modern styling
- **Vite** - Next-generation frontend build tool

### Node System Architecture
- **Custom Workflow Nodes** - Specialized data processing and analysis components
- **Integrated n8n Nodes** - Production-ready automation building blocks with full compatibility
- **Hybrid Execution Engine** - Seamless integration between custom and n8n node types
- **Real-time Processing** - Asynchronous workflow execution with comprehensive progress tracking

### Integration Layer
- **Google APIs** - Sheets and Drive integration via service account authentication
- **Slack Web API** - Team notifications and messaging
- **SMTP Email** - Automated email delivery
- **HTTP Client** - RESTful API communications

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd workflow-editor-claude

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Slack Integration
VITE_SLACK_TOKEN=xoxb-your-slack-bot-token

# Google Services (Service Account)
VITE_GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
VITE_GOOGLE_ACCESS_TOKEN=your-access-token

# SMTP Configuration
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASSWORD=your-app-password
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
```

<details>
<summary>📋 <strong>Service Setup Guide</strong></summary>

### Slack Configuration
1. Create a Slack app at [api.slack.com](https://api.slack.com/apps)
2. Add bot scopes: `chat:write`, `chat:write.public`
3. Install app to workspace and copy Bot User OAuth Token

### Google Sheets Setup
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API and Google Drive API
3. Create service account and download JSON credentials
4. Extract `client_email` and `private_key` for environment variables

### Email Configuration
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password in Google Account settings
3. Use app password (not regular password) in SMTP configuration

</details>

---

## 📊 Node System Overview

This application features a **dual-node architecture** combining custom-built workflow components with integrated n8n automation nodes:

### 🎯 Custom Workflow Nodes
*Purpose-built for data analysis and customer insights*

| Node | Type | Purpose | Key Features |
|------|------|---------|--------------|
| **Get Reviews** | Data Source | Fetch customer feedback | Multi-platform support, rate limiting |
| **K-Means Clustering** | ML Algorithm | Segment customer data | Configurable clusters, feature selection |
| **Customer Insights** | AI Analysis | Generate business intelligence | Sentiment analysis, topic modeling |
| **Clusters to List** | Transform | Organize clustering results | Multiple grouping options |
| **Export to Sheets** | Output | Formatted data export | Custom sheet naming, summary generation |

### 🔧 Integrated n8n Nodes  
*Production-ready automation components with full API integration*

| Node | API Integration | Purpose | Authentication |
|------|----------------|---------|---------------|
| **HTTP Request** | REST APIs | External service communication | Bearer, Basic, Custom headers |
| **Google Sheets** | Google Workspace API | Spreadsheet operations | Service Account, OAuth2 |
| **Slack** | Slack Web API | Team notifications | Bot tokens, Webhooks |
| **Email Send** | SMTP Protocol | Automated messaging | App passwords, TLS/SSL |
| **Webhook** | HTTP Server | Data ingestion | Custom endpoints, validation |

<div>

**Node System Overview**

<table>
  <tr>
    <td align="center" style="padding: 0 20px;">
      <img src="image-2.png" style="width: 150px;" alt="Custom Nodes"><br>
      <em>Custom Nodes</em><br>
      <small>Get Reviews, Apply K-Means, Cluster to List,<br>Customer Insights, Export to Sheets</small>
    </td>
    <td align="center" style="padding: 0 20px;">
      <img src="image-3.png" style="width: 150px;" alt="n8n Nodes"><br>
      <em>n8n Nodes</em><br>
      <small>HTTP Request, Google Sheets,<br>Slack, Email, Webhook</small>
    </td>
  </tr>
</table>

**Mixed Workflow Example**

<img src="image-1.png" style="width: 350px;" alt="Workflow">

*Complete workflow showing both node types connected together*

</div>

---

## 🎯 Usage Examples

### Customer Analytics Workflow
*Combining custom analytics nodes with n8n integrations*

```mermaid
graph LR
    A[Get Reviews<br/>Custom] --> B[K-Means Clustering<br/>Custom]
    B --> C[Customer Insights<br/>Custom]
    C --> D[Google Sheets<br/>n8n]
    D --> E[Slack Notification<br/>n8n]
```

1. **Data Collection** - Custom node fetches reviews with intelligent parsing
2. **ML Processing** - Purpose-built K-means clustering for customer segmentation  
3. **AI Analysis** - Custom insights generation with sentiment and topic analysis
4. **Production Export** - n8n Google Sheets node with full API integration
5. **Team Notification** - n8n Slack node with rich message formatting

### API Automation Pipeline
*Pure n8n node workflow for system integration*

```mermaid
graph LR
    A[Webhook<br/>n8n] --> B[HTTP Request<br/>n8n]
    B --> C[Email Send<br/>n8n]
```

1. **Trigger** - n8n webhook receiver with validation and parsing
2. **API Call** - Production HTTP client with authentication and retry logic
3. **Notify** - SMTP email delivery with HTML formatting and attachments

---

## 🗂️ Project Structure

```
src/
├── components/              # Vue components
│   ├── CustomNode.vue      # Individual workflow nodes
│   ├── NodePalette.vue     # Draggable node library
│   └── NodeConfiguration.vue
├── lib/                    # Core libraries and integrations
│   ├── n8n-nodes.js       # Production n8n node implementations
│   ├── n8n-wrapper.js     # n8n compatibility layer
│   └── node-libraries.js  # Service integration logic (Google, Slack, SMTP)
├── utils/                  # Utility functions
│   ├── nodeRegistry.js    # Node definitions and metadata
│   └── n8nIcons.js        # Icon and styling system
└── App.vue                 # Main application component
```

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run format   # Format code with Prettier
```

### Key Development Features

- **Hot Module Replacement** - Instant updates during development
- **Vue DevTools** - Enhanced debugging and component inspection
- **ESLint & Prettier** - Code quality and formatting enforcement
- **TypeScript Support** - Optional static typing for enhanced development

---

## 🚀 Deployment

### Production Deployment

```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting platform
```

### Supported Platforms

- **Vercel**: `npm i -g vercel && vercel --prod`
- **Netlify**: `npm i -g netlify-cli && netlify deploy --prod --dir dist`
- **AWS S3**: Static hosting with CloudFront distribution
- **Docker**: Containerized deployment with nginx

---

## 🛠️ Technical Implementation

### Node Execution Architecture
- **Dual Execution Paths** - Separate handlers for custom nodes and n8n integrations
- **Production APIs** - Real Google Sheets, Slack, and SMTP implementations
- **Error Handling** - Comprehensive error recovery with fallback simulation modes
- **Progress Tracking** - Real-time status updates with visual feedback across node types
- **State Management** - Reactive data flow using Vue 3 Composition API

### Visual Editor Features
- **Drag & Drop** - Intuitive node placement and connection
- **Real-time Updates** - Live canvas updates and synchronization
- **Responsive Design** - Optimized for desktop and tablet workflows
- **Accessibility** - WCAG 2.1 compliant interface design

### Performance Optimizations
- **Lazy Loading** - On-demand component and library loading
- **Virtual Scrolling** - Efficient handling of large node collections
- **Memory Management** - Automatic cleanup and garbage collection
- **Bundle Splitting** - Optimized loading for production deployments

---

## 📈 Future Enhancements

- [ ] **Advanced n8n Integration** - Support for additional n8n community nodes
- [ ] **Custom Node SDK** - Framework for building domain-specific workflow components  
- [ ] **Workflow Templates** - Pre-built templates combining custom and n8n nodes
- [ ] **Performance Analytics** - Execution metrics for both node types
- [ ] **Enterprise Features** - Advanced authentication, audit logs, and governance
- [ ] **Cloud Deployment** - Managed hosting with auto-scaling capabilities

---

## 🤝 Contributing

This project demonstrates modern workflow automation techniques combining custom business logic with industry-standard n8n integrations:

1. **Architecture Review** - Examine the dual-node system design and execution patterns
2. **Integration Testing** - Test both custom analytics and n8n automation workflows  
3. **API Functionality** - Verify production integrations with Google, Slack, and SMTP services
4. **Performance Assessment** - Evaluate execution efficiency across different node types

---

## 📄 License & Acknowledgments

- **Framework**: Vue.js - Progressive JavaScript Framework
- **Flow Editor**: Vue Flow - Advanced workflow visualization
- **Automation**: n8n - Workflow automation platform integration
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Icons**: n8n-compatible SVG icon system with custom extensions
- **APIs**: Production integrations with Google Workspace, Slack, and SMTP protocols

---

<div align="center">

**A demonstration of modern workflow automation architecture**

*Combining custom business logic with industry-standard automation tools*

---

**📧 Contact**: archita.0240@gmail.com | **🔗 LinkedIn**: [Archita Aggarwal](https://www.linkedin.com/in/archita-aggarwal34/)

</div>