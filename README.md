# Visual Workflow Editor

A Vue 3-based visual workflow editor that allows users to create, edit, and execute custom workflows using a drag-and-drop interface. Built with Vue Flow, Tailwind CSS, and integrates with various external services.

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows
- **Custom Node Types**: Support for various node types including data processing, AI analysis, and integrations
- **Real-time Execution**: Execute workflows with live progress tracking
- **Service Integrations**: Built-in support for Slack, Google Sheets, HTTP requests, and email
- **Responsive Design**: Modern, responsive UI with dark mode support
- **Export/Import**: Save and load workflow configurations

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for cloning the repository

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-editor-claude
```

### 2. Initialize n8n Submodule (Optional)

The project includes n8n as a git submodule for real node integration:

```bash
git submodule init
git submodule update
```

**Note**: If you encounter issues with the submodule, the project will work with mock implementations.

### 3. Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
# Slack Integration
VITE_SLACK_TOKEN=xoxb-your-slack-bot-token

# Google Services
VITE_GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----
VITE_GOOGLE_ACCESS_TOKEN=your-google-access-token

# Email Configuration (SMTP)
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASSWORD=your-app-password
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
```

### Service Setup Instructions

#### Slack Integration

1. **Create a Slack App**:
   - Go to [Slack API](https://api.slack.com/apps)
   - Click "Create New App" → "From scratch"
   - Choose your workspace

2. **Configure Bot Token**:
   - Go to "OAuth & Permissions"
   - Add these scopes under "Bot Token Scopes":
     - `chat:write`
     - `chat:write.public`
   - Install the app to your workspace
   - Copy the "Bot User OAuth Token" to `VITE_SLACK_TOKEN`

#### Google Sheets Integration

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing

2. **Enable APIs**:
   - Enable "Google Sheets API"
   - Enable "Google Drive API"

3. **Create Service Account**:
   - Go to "IAM & Admin" → "Service Accounts"
   - Create a new service account
   - Download the JSON key file
   - Extract `client_email` and `private_key` to environment variables

4. **Generate Access Token** (Optional):
   - Use OAuth 2.0 playground or generate programmatically
   - Add to `VITE_GOOGLE_ACCESS_TOKEN`

#### Email Configuration

For Gmail SMTP:

1. **Enable 2-Factor Authentication**
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `VITE_SMTP_PASSWORD`

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Code Formatting

```bash
npm run format
```

## 📁 Project Structure

```
workflow-editor-claude/
├── src/
│   ├── components/           # Vue components
│   │   ├── CustomNode.vue   # Individual workflow node component
│   │   ├── NodePalette.vue  # Draggable node palette
│   │   └── NodeConfiguration.vue
│   ├── lib/                 # Core libraries
│   │   ├── n8n-nodes.js    # n8n node integration
│   │   ├── n8n-wrapper.js  # Mock implementations
│   │   └── node-libraries.js
│   ├── utils/               # Utility functions
│   │   └── nodeRegistry.js  # Node definitions and registry
│   ├── assets/              # Static assets
│   └── App.vue              # Main application component
├── lib/n8n/                # n8n submodule (optional)
├── .env                     # Environment configuration
├── package.json
└── README.md
```

## 🎯 Usage

### Creating a Workflow

1. **Start the Application**: Run `npm run dev`
2. **Add Nodes**: Drag nodes from the left palette to the canvas
3. **Connect Nodes**: Drag from output handles (bottom) to input handles (top)
4. **Configure Nodes**: Click on nodes to configure their parameters
5. **Execute Workflow**: Click "Run Flow" to execute your workflow

### Available Node Types

#### Data Sources
- **Get Reviews**: Fetch customer reviews from various platforms
- **HTTP Request**: Make API calls to external services
- **Webhook**: Receive data from external services

#### Processing
- **K-Means Clustering**: Apply machine learning clustering
- **Clusters to List**: Transform clustering results
- **Customer Insights**: AI-powered analysis

#### Integrations
- **Google Sheets**: Read/write spreadsheet data
- **Slack**: Send notifications to channels
- **Email Send**: Send emails via SMTP

### Example Workflow

1. **Get Reviews** → Fetch customer data
2. **K-Means** → Cluster reviews by sentiment
3. **Customer Insights** → Generate AI insights
4. **Google Sheets** → Export results
5. **Slack** → Notify team

## 🔧 Troubleshooting

### Common Issues

#### Node Visibility Problems
If nodes aren't showing up on the canvas:
```css
/* Check if nodes have proper CSS visibility */
.vue-flow__node-custom {
  opacity: 1 !important;
  visibility: visible !important;
}
```

#### n8n Integration Issues
If real n8n nodes fail to load:
- The project automatically falls back to mock implementations
- Check console for specific error messages
- Ensure the n8n submodule is properly initialized

#### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart the development server after changes
- Variables must be prefixed with `VITE_`

#### API Integration Failures
- Check your API credentials and tokens
- Verify network connectivity
- Review service-specific setup instructions

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines

- Use Vue 3 Composition API
- Follow ESLint and Prettier configurations
- Add unit tests for new components
- Update documentation for new features

## 📚 Dependencies

### Core Dependencies
- **Vue 3**: Progressive JavaScript framework
- **@vue-flow/core**: Flow-based workflow editor
- **Tailwind CSS**: Utility-first CSS framework
- **Element Plus**: Vue 3 UI library

### Integration Libraries
- **axios**: HTTP client
- **googleapis**: Google APIs client
- **slack-web-api-client**: Slack integration
- **jsonwebtoken**: JWT handling

## 🚀 Deployment

### Environment Setup

For production deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Configure environment variables** on your hosting platform

3. **Deploy the `dist` folder** to your web server

### Hosting Platforms

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join our Discord server for discussions

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Advanced node templates
- [ ] Workflow versioning
- [ ] Plugin system
- [ ] Performance optimizations
- [ ] Mobile responsive improvements

---

**Happy workflow building! 🎉**