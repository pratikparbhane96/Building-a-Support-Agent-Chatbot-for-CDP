import { Message, CDP } from '../types';
import { 
  createMessage, 
  isCDPRelated, 
  detectCDP, 
  extractHowToIntent,
  generateNonCDPResponse,
  fetchDocumentation,
  compareCDPs,
  handleGeneralQuestions,
  handleLongQuestion,
  handleDailyCommonQuestions
} from '../utils/chatUtils';

export const processUserMessage = async (
  message: string, 
  messages: Message[], 
  selectedCDP: CDP | null = null
): Promise<Message> => {
  // Handle extremely long questions
  if (message.length > 500) {
    return createMessage(handleLongQuestion(message), 'assistant');
  }
  
  // Handle general questions about the chatbot
  const generalResponse = handleGeneralQuestions(message);
  if (generalResponse) {
    return createMessage(generalResponse, 'assistant');
  }
  
  // Handle daily common questions
  const commonResponse = handleDailyCommonQuestions(message);
  if (commonResponse) {
    return createMessage(commonResponse, 'assistant');
  }
  
  // Check if the question is CDP-related
  if (!isCDPRelated(message)) {
    return createMessage(generateNonCDPResponse(), 'assistant');
  }
  
  // Detect if this is a comparison question
  const comparisonRegex = /how does (.*?) compare to (.*?)\?|difference between (.*?) and (.*?)|compare (.*?) (?:with|and) (.*?)|what('s| is) the difference between (.*?) and (.*?)/i;
  const comparisonMatch = message.match(comparisonRegex);
  
  if (comparisonMatch) {
    // Extract the CDPs being compared
    let cdp1, cdp2, aspect;
    
    if (comparisonMatch[1] && comparisonMatch[2]) {
      cdp1 = comparisonMatch[1].toLowerCase();
      cdp2 = comparisonMatch[2].toLowerCase();
      aspect = extractHowToIntent(message) || 'general features';
    } else if (comparisonMatch[3] && comparisonMatch[4]) {
      cdp1 = comparisonMatch[3].toLowerCase();
      cdp2 = comparisonMatch[4].toLowerCase();
      aspect = 'general features';
    } else if (comparisonMatch[5] && comparisonMatch[6]) {
      cdp1 = comparisonMatch[5].toLowerCase();
      cdp2 = comparisonMatch[6].toLowerCase();
      aspect = 'general features';
    } else if (comparisonMatch[8] && comparisonMatch[9]) {
      cdp1 = comparisonMatch[8].toLowerCase();
      cdp2 = comparisonMatch[9].toLowerCase();
      aspect = 'general features';
    }
    
    if (cdp1 && cdp2) {
      const comparisonResponse = await compareCDPs(aspect, cdp1, cdp2);
      return createMessage(comparisonResponse, 'assistant');
    }
  }
  
  // Detect which CDP the question is about (use selected CDP if available)
  const cdp = selectedCDP || detectCDP(message);
  
  if (!cdp) {
    return createMessage(
      "I notice you're asking about CDPs, but I'm not sure which platform you're referring to. Could you specify if your question is about Segment, mParticle, Lytics, or Zeotap?",
      'assistant'
    );
  }
  
  // Extract the how-to intent
  const intent = extractHowToIntent(message) || message;
  
  // Fetch documentation based on the CDP and intent
  const response = await fetchDocumentation(cdp.id, intent);
  
  return createMessage(response, 'assistant');
};