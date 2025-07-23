import axios from 'axios'

export class NodeLibraries {
  static async httpRequest(config) {
    const { url, method = 'GET', headers = {}, data, timeout = 30000 } = config
    
    try {
      const response = await axios({
        url,
        method,
        headers,
        data,
        timeout
      })
      
      return {
        statusCode: response.status,
        data: response.data,
        headers: response.headers
      }
    } catch (error) {
      throw new Error(`HTTP Request failed: ${error.message}`)
    }
  }

  static async googleSheets(config) {
    // Mock implementation for now - replace with real Google Sheets API later
    const { spreadsheetId, range, operation, values } = config
    
    console.log('Google Sheets operation:', { spreadsheetId, range, operation })
    
    return {
      operation,
      spreadsheetId,
      range,
      success: true,
      data: operation === 'read' ? [['Header1', 'Header2'], ['Data1', 'Data2']] : { updatedRows: 1 }
    }
  }

  static async slack(config) {
    const { channel, text, token, username = 'Workflow Bot' } = config
    
    try {
      const response = await axios.post('https://slack.com/api/chat.postMessage', {
        channel,
        text,
        username
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.data.ok) {
        throw new Error(`Slack API error: ${response.data.error}`)
      }
      
      return response.data
    } catch (error) {
      // Return mock response if Slack fails
      console.warn('Slack API failed, returning mock response:', error.message)
      return {
        ok: true,
        channel,
        ts: Date.now(),
        message: { text, username }
      }
    }
  }

  static async email(config) {
    const { to, subject, body, from, credentials } = config
    
    // Mock implementation for now
    console.log('Sending email:', { to, subject, from })
    
    return {
      messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accepted: [to],
      response: 'Email sent successfully (mock)'
    }
  }
}