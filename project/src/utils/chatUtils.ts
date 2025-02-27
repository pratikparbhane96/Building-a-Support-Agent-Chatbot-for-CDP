import { Message } from '../types';
import { cdps } from '../data/cdps';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create a new message object
export const createMessage = (content: string, role: 'user' | 'assistant'): Message => {
  return {
    id: generateId(),
    content,
    role,
    timestamp: new Date()
  };
};

// Check if a question is CDP-related
export const isCDPRelated = (question: string): boolean => {
  const cdpKeywords = [
    'segment', 'mparticle', 'lytics', 'zeotap', 'cdp', 'customer data platform',
    'data', 'integration', 'source', 'destination', 'audience', 'profile',
    'tracking', 'analytics', 'event', 'user', 'identity', 'tag', 'api',
    'javascript sdk', 'mobile sdk', 'server sdk', 'webhook', 'schema', 'mapping',
    'transformation', 'enrichment', 'consent', 'privacy', 'gdpr', 'ccpa'
  ];
  
  const lowerQuestion = question.toLowerCase();
  return cdpKeywords.some(keyword => lowerQuestion.includes(keyword));
};

// Determine which CDP the question is about
export const detectCDP = (question: string) => {
  const lowerQuestion = question.toLowerCase();
  
  for (const cdp of cdps) {
    if (lowerQuestion.includes(cdp.id.toLowerCase()) || lowerQuestion.includes(cdp.name.toLowerCase())) {
      return cdp;
    }
  }
  
  return null;
};

// Extract the "how-to" intent from a question
export const extractHowToIntent = (question: string): string | null => {
  const howToPatterns = [
    /how (do|can|to) (i|we|you) (.*?)\?/i,
    /how (would|should|could) (i|we|you) (.*?)\?/i,
    /what('s| is) the (best way|process) to (.*?)\?/i,
    /what are the steps to (.*?)\?/i,
    /what are the (.*?) (options|settings|configurations|parameters)/i,
    /how (to|do i|can i) (configure|set up|implement) (.*?)\?/i
  ];
  
  for (const pattern of howToPatterns) {
    const match = question.match(pattern);
    if (match && match[3]) {
      return match[3].trim();
    }
  }
  
  return null;
};

// Generate a response for non-CDP related questions
export const generateNonCDPResponse = (): string => {
  return "I'm a CDP support assistant focused on helping with questions about Segment, mParticle, Lytics, and Zeotap. I can help you with how-to questions related to these platforms. Could you please ask a question related to one of these CDPs?";
};

// Handle general questions about the chatbot
export const handleGeneralQuestions = (question: string): string | null => {
  const lowerQuestion = question.toLowerCase();
  
  if (
    lowerQuestion.includes('who are you') || 
    lowerQuestion.includes('what can you do') || 
    lowerQuestion.includes('what can you help me with') ||
    lowerQuestion.includes('how can you help') ||
    lowerQuestion.includes('what are you')
  ) {
    return `
## I'm Your CDP Support Assistant

I'm designed to help you with questions about Customer Data Platforms (CDPs), specifically:

- **Segment**: Event collection, identity resolution, and data routing
- **mParticle**: Mobile-first CDP with identity management
- **Lytics**: Behavioral analytics and predictive modeling
- **Zeotap**: First-party data enrichment and activation

### How I Can Help You

1. **Answer "How-to" Questions**: I can provide step-by-step instructions for common tasks
2. **Compare CDPs**: I can explain differences between platforms
3. **Explain Features**: I can describe key features and capabilities
4. **Provide Documentation**: I can point you to relevant documentation

Feel free to ask me anything about these platforms, and I'll do my best to help!
    `;
  }
  
  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion === 'hey') {
    return "👋 Hello! I'm your CDP Support Assistant. How can I help you with Segment, mParticle, Lytics, or Zeotap today?";
  }
  
  return null;
};

// Handle extremely long questions
export const handleLongQuestion = (question: string): string => {
  return `
I notice your question is quite detailed. While I can process long questions, it might be more effective if we break this down:

1. Could you tell me which CDP platform you're asking about? (Segment, mParticle, Lytics, or Zeotap)
2. What specific task or feature are you trying to understand?

This will help me provide you with the most relevant information.
  `;
};

// Handle daily common questions
export const handleDailyCommonQuestions = (question: string): string | null => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('what is a customer data platform') || lowerQuestion.includes('what is a cdp')) {
    return `
## What is a Customer Data Platform (CDP)?

A Customer Data Platform (CDP) is a software that collects and organizes customer data from multiple sources, creates unified customer profiles, and makes this data available to other systems for marketing, customer service, and analytics purposes.

### Key Capabilities of CDPs:

1. **Data Collection**: Gather customer data from various sources (websites, mobile apps, CRM, email, etc.)
2. **Identity Resolution**: Connect data from different channels to create a single customer view
3. **Profile Management**: Build and maintain comprehensive customer profiles
4. **Segmentation**: Create audience segments based on behaviors and attributes
5. **Activation**: Make data available to other systems for personalization and targeting

### How CDPs Differ from Other Systems:

- **CRMs**: Focus on known customers and sales interactions; CDPs include anonymous visitors and behavioral data
- **DMPs**: DMPs primarily use third-party cookies for advertising; CDPs focus on first-party data for broader use cases
- **Data Warehouses**: Store data for analysis; CDPs make data operational for real-time marketing

The four CDPs I can help you with (Segment, mParticle, Lytics, and Zeotap) each have different strengths and specializations within this broader definition.
    `;
  }
  
  if (lowerQuestion.includes('difference between cdp and dmp')) {
    return `
## Differences Between CDPs and DMPs

| Feature | Customer Data Platform (CDP) | Data Management Platform (DMP) |
|---------|------------------------------|--------------------------------|
| **Data Types** | First-party data (known customers) | Primarily third-party data (anonymous) |
| **Identity** | Persistent customer profiles | Cookie-based, temporary profiles |
| **Time Horizon** | Long-term customer relationships | Short-term campaign optimization |
| **Use Cases** | Personalization, customer experience, analytics | Advertising, audience targeting, media buying |
| **Data Retention** | Indefinite/long-term | Short-term (often 90 days) |
| **Compliance** | Built for GDPR, CCPA compliance | More challenging compliance profile |
| **User Identification** | Email, customer ID, phone, address | Cookies, device IDs, IP addresses |

### Key Differences:

1. **Purpose**: CDPs create unified customer profiles for all marketing channels; DMPs focus on optimizing advertising campaigns
2. **Data Sources**: CDPs integrate deeply with first-party systems; DMPs rely heavily on third-party data
3. **Persistence**: CDPs maintain persistent profiles; DMPs typically have shorter data lifespans
4. **Scope**: CDPs support broader marketing and business use cases; DMPs are more specialized for advertising

Many organizations use both systems together: CDPs for customer experience and DMPs for prospecting and acquisition.
    `;
  }
  
  return null;
};

// Mock function to simulate fetching documentation
// In a real implementation, this would use langchain or similar to fetch and process documentation
export const fetchDocumentation = async (cdpId: string, query: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock responses based on CDP and query patterns
  if (cdpId === 'segment') {
    if (query.includes('source') || query.includes('set up a new source')) {
      return `
## Setting up a new source in Segment

To set up a new source in Segment:

1. Log in to your Segment workspace
2. Navigate to Sources in the left sidebar
3. Click "Add Source"
4. Search for the type of source you want to add
5. Follow the configuration steps for your specific source type
6. Save your configuration

For more details, visit the [Segment documentation](https://segment.com/docs/connections/sources/).
      `;
    }
    
    if (query.includes('javascript sdk') || query.includes('advanced configuration')) {
      return `
## Advanced Configuration Options for Segment's JavaScript SDK

Segment's JavaScript SDK (Analytics.js) offers several advanced configuration options:

### Initialization Options

\`\`\`javascript
analytics.load('YOUR_WRITE_KEY', {
  // Advanced configuration options
  integrations: {
    'All': false,
    'Google Analytics': true
  },
  initialPageview: false,
  cookie: {
    name: 'custom_cookie_name',
    domain: '.example.com',
    secure: true,
    expiration: 365
  },
  localStorage: false,
  metrics: true
});
\`\`\`

### Key Configuration Options

1. **Selective Integrations**: Control which destinations receive data
2. **Cookie Settings**: Customize cookie behavior for compliance
3. **Local Storage**: Disable local storage if needed
4. **Initial Pageview**: Control automatic pageview tracking
5. **User ID Persistence**: Configure how user IDs are stored
6. **Cross-Domain Tracking**: Set up tracking across multiple domains
7. **Metrics**: Enable/disable SDK performance metrics

### Best Practices

- Only load necessary integrations to improve performance
- Configure cookie settings to comply with privacy regulations
- Use debug mode during development: \`analytics.debug()\`

For complete documentation, visit [Segment's Analytics.js documentation](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/configuration/).
      `;
    }
  } else if (cdpId === 'mparticle') {
    if (query.includes('user profile') || query.includes('create a user profile')) {
      return `
## Creating a user profile in mParticle

To create a user profile in mParticle:

1. Implement the mParticle SDK in your application
2. Use the identify method to create a user identity
3. Add user attributes using the setUserAttribute method
4. Set user identities using the Identity API
5. Monitor user profiles in the mParticle dashboard

For more details, visit the [mParticle documentation](https://docs.mparticle.com/guides/idsync/introduction/).
      `;
    }
  } else if (cdpId === 'lytics') {
    if (query.includes('audience') || query.includes('segment') || query.includes('build an audience')) {
      return `
## Building an audience segment in Lytics

To build an audience segment in Lytics:

1. Navigate to the Audiences section in your Lytics account
2. Click "Create New Audience"
3. Define your audience criteria using the segment builder
4. Use behavioral, demographic, or custom attributes
5. Preview your audience size and composition
6. Save and activate your audience

For more details, visit the [Lytics documentation](https://docs.lytics.com/product/audiences/).
      `;
    }
  } else if (cdpId === 'zeotap') {
    if (query.includes('integrate') || query.includes('integration') || query.includes('data')) {
      return `
## Integrating your data with Zeotap

To integrate your data with Zeotap:

1. Access your Zeotap CDP account
2. Navigate to the Integrations section
3. Select the data source you want to integrate
4. Configure the connection settings
5. Map your data fields to Zeotap's schema
6. Test and activate the integration

For more details, visit the [Zeotap documentation](https://docs.zeotap.com/home/en-us/).
      `;
    }
  }
  
  // Attempt to fetch real documentation (in a real implementation)
  try {
    // This is a mock implementation - in a real app, you would use a more sophisticated approach
    // such as a vector database with embeddings or a specialized document retrieval system
    const docUrl = cdps.find(c => c.id === cdpId)?.docUrl;
    
    if (docUrl) {
      return `
## Information about ${query}

I don't have specific information about "${query}" for this CDP in my knowledge base. 

In a production environment, I would:
1. Search the documentation at ${docUrl}
2. Extract relevant sections
3. Summarize the information for you

For now, I recommend checking the official documentation directly or asking a more specific question.
      `;
    }
  } catch (error) {
    console.error('Error fetching documentation:', error);
  }
  
  // Default response if no specific match is found
  return `I don't have specific information about "${query}" for this CDP. Please check the official documentation or try asking a more specific question.`;
};

// Compare CDPs (for bonus feature)
export const compareCDPs = async (aspect: string, cdp1: string, cdp2: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock comparison responses
  if (aspect.includes('audience') || aspect.includes('segment')) {
    if ((cdp1.includes('segment') && cdp2.includes('lytics')) || (cdp1.includes('lytics') && cdp2.includes('segment'))) {
      return `
## Comparing Audience Creation: Segment vs Lytics

### Segment Audience Creation
- Uses SQL-like syntax for audience definition
- Focuses on event-based segmentation
- Integrates with Personas for identity resolution
- Offers real-time audience updates
- Provides A/B testing capabilities for audience optimization

### Lytics Audience Creation
- Uses a visual segment builder interface
- Specializes in behavioral and predictive segmentation
- Includes machine learning for audience optimization
- Provides audience insights and recommendations
- Features lookalike modeling capabilities

### Key Differences

| Feature | Segment | Lytics |
|---------|---------|--------|
| Interface | SQL-based | Visual builder |
| Focus | Event-based | Behavioral |
| ML Capabilities | Limited | Advanced |
| Real-time | Yes | Yes, with predictive |
| Identity Resolution | Via Personas | Built-in |

The main difference is that Segment's approach is more technical and event-focused, while Lytics offers more advanced behavioral targeting with built-in machine learning capabilities.
      `;
    }
    
    if ((cdp1.includes('mparticle') && cdp2.includes('segment')) || (cdp1.includes('segment') && cdp2.includes('mparticle'))) {
      return `
## Comparing Segment vs mParticle

### Data Collection Approach
- **Segment**: Primarily web and server-side focused, with strong API capabilities
- **mParticle**: Mobile-first approach with robust SDKs for iOS, Android, and web

### Identity Resolution
- **Segment**: Uses Personas for cross-device identity resolution
- **mParticle**: Built-in IDSync with more granular identity controls

### Data Governance
- **Segment**: Basic data governance features
- **mParticle**: Advanced data planning and governance tools

### Audience Building
- **Segment**: SQL-based audience creation
- **mParticle**: Visual audience builder with real-time capabilities

### Key Differences

| Feature | Segment | mParticle |
|---------|---------|-----------|
| Primary Focus | Web/API | Mobile |
| Identity Management | Good | Excellent |
| Data Governance | Basic | Advanced |
| Pricing Model | Event-based | User-based |
| Enterprise Features | Growing | Mature |

mParticle tends to be more suitable for mobile-heavy applications with complex identity requirements, while Segment excels in web applications and has a larger ecosystem of integrations.
      `;
    }
  }
  
  if (aspect.includes('integration') || aspect.includes('connect')) {
    return `
## Comparing Integration Capabilities: ${cdp1} vs ${cdp2}

### Integration Approaches

${cdp1.includes('segment') ? `
**Segment**:
- 300+ pre-built integrations
- Server-side destination support
- Client-side integrations via Analytics.js
- Function-based custom destinations
- Extensive API for custom integrations
` : ''}

${cdp1.includes('mparticle') ? `
**mParticle**:
- 250+ integrations
- Mobile-optimized connections
- Server-side forwarding
- Kit Framework for mobile extensions
- Advanced filtering and transformation
` : ''}

${cdp1.includes('lytics') ? `
**Lytics**:
- 80+ pre-built integrations
- Focus on activation destinations
- Real-time data streaming
- Custom JavaScript destinations
- API-based custom integrations
` : ''}

${cdp1.includes('zeotap') ? `
**Zeotap**:
- 120+ marketing and advertising integrations
- Focus on advertising platforms
- Identity resolution across integrations
- Compliance-focused data connections
- Specialized for EU market
` : ''}

${cdp2.includes('segment') ? `
**Segment**:
- 300+ pre-built integrations
- Server-side destination support
- Client-side integrations via Analytics.js
- Function-based custom destinations
- Extensive API for custom integrations
` : ''}

${cdp2.includes('mparticle') ? `
**mParticle**:
- 250+ integrations
- Mobile-optimized connections
- Server-side forwarding
- Kit Framework for mobile extensions
- Advanced filtering and transformation
` : ''}

${cdp2.includes('lytics') ? `
**Lytics**:
- 80+ pre-built integrations
- Focus on activation destinations
- Real-time data streaming
- Custom JavaScript destinations
- API-based custom integrations
` : ''}

${cdp2.includes('zeotap') ? `
**Zeotap**:
- 120+ marketing and advertising integrations
- Focus on advertising platforms
- Identity resolution across integrations
- Compliance-focused data connections
- Specialized for EU market
` : ''}

### Key Differences

The main differences in integration capabilities are:

1. **Integration Volume**: ${cdp1.includes('segment') ? 'Segment' : cdp1} ${cdp1.includes('segment') ? 'has more pre-built integrations' : ''} ${cdp1.includes('mparticle') ? 'has fewer integrations than Segment but more than Lytics/Zeotap' : ''} ${cdp1.includes('lytics') || cdp1.includes('zeotap') ? 'has fewer integrations but more specialized ones' : ''}

2. **Specialization**: ${cdp1.includes('segment') ? 'Segment has broad coverage across categories' : ''} ${cdp1.includes('mparticle') ? 'mParticle specializes in mobile ecosystem connections' : ''} ${cdp1.includes('lytics') ? 'Lytics focuses on marketing activation destinations' : ''} ${cdp1.includes('zeotap') ? 'Zeotap specializes in advertising and European market integrations' : ''}

3. **Implementation Approach**: Different SDKs and integration methods with varying levels of developer effort required

For specific integration needs, I recommend checking each platform's integration catalog directly.
    `;
  }
  
  return `
## Comparing ${cdp1} and ${cdp2}

I don't have specific comparison information between these CDPs regarding "${aspect}" in my knowledge base.

In a production environment, I would:
1. Analyze documentation from both platforms
2. Extract key differences related to ${aspect}
3. Present a structured comparison

For now, I recommend checking the official documentation for both platforms or asking about a more specific aspect of these CDPs.
  `;
};

// In a real implementation, this function would fetch and parse documentation
// This is a placeholder for the actual implementation
export const fetchRealDocumentation = async (url: string, query: string): Promise<string | null> => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // This is a simplified example - in a real implementation, you would:
    // 1. Use a more sophisticated search algorithm
    // 2. Process and rank results
    // 3. Extract and format relevant content
    
    // Find sections that might contain the answer
    const sections = $('h1, h2, h3, h4, h5, h6').filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return query.toLowerCase().split(' ').some(word => text.includes(word));
    });
    
    if (sections.length > 0) {
      let content = '';
      sections.each((_, section) => {
        const title = $(section).text();
        let sectionContent = '';
        
        // Get content until the next heading
        let nextEl = $(section).next();
        while (nextEl.length && !nextEl.is('h1, h2, h3, h4, h5, h6')) {
          sectionContent += nextEl.text() + '\n';
          nextEl = nextEl.next();
        }
        
        content += `## ${title}\n\n${sectionContent}\n\n`;
      });
      
      return content || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching documentation:', error);
    return null;
  }
};