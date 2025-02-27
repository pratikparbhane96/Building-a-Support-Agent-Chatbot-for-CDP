# Building-a-Support-Agent-Chatbot-for-CDP
# CDP Support Agent Chatbot

A chatbot application designed to answer "how-to" questions related to four Customer Data Platforms (CDPs): Segment, mParticle, Lytics, and Zeotap.

# Screenshots of Project:-
![Screenshot 2025-02-27 184419](https://github.com/user-attachments/assets/ff1c32f3-51e8-4805-adf2-36556cbc7fb9)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------
![Screenshot 2025-02-27 184455](https://github.com/user-attachments/assets/238dacb2-2e6f-4f19-9980-b11da388e3fb)

![Screenshot 2025-02-27 184513](https://github.com/user-attachments/assets/9a6328d4-adc6-414c-bd86-38eee89ebaef)

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for UI icons
- **Markdown Rendering**: Marked for rendering markdown responses
- **HTTP Client**: Axios for making API requests
- **Document Processing**: Cheerio for HTML parsing (for future implementation)
- **Language Processing**: LangChain for document retrieval and processing (for future implementation)
- **Build Tool**: Vite for fast development and optimized production builds

## Core Features

1. **Answer "How-to" Questions**: The chatbot understands and responds to user questions about how to perform specific tasks within each CDP.

2. **CDP Platform Selection**: Users can select a specific CDP to focus their questions on.

3. **Markdown Support**: Responses are formatted in markdown for better readability.

4. **Loading States**: Visual feedback during response generation.

5. **Example Questions**: Pre-defined example questions to help users get started.

6. **Handle Question Variations**: The chatbot can handle various question formats, including extremely long questions and questions irrelevant to CDPs.

7. **Documentation Extraction**: The chatbot simulates retrieving relevant information from CDP documentation (in a production environment, this would use actual document retrieval).

## Bonus Features

1. **Cross-CDP Comparisons**: The chatbot can answer questions about the differences in approaches or functionalities between the four CDPs.

2. **Advanced "How-to" Questions**: Handles more complex or platform-specific "how-to" questions.

## Project Structure

- `src/components/`: React components for the UI
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions for chat processing
- `src/services/`: Service layer for handling chat logic
- `src/data/`: Static data like CDP information

## Implementation Details

The current implementation uses mock data to simulate responses from documentation. In a production environment, this would be replaced with:

1. A document indexer to crawl and index the CDP documentation
2. Vector embeddings to enable semantic search
3. A retrieval system to find relevant documentation sections
4. A response generator to format the information into user-friendly answers

## Future Enhancements

1. **Real Documentation Integration**: Connect to actual CDP documentation sources
2. **User Authentication**: Allow users to save conversation history
3. **Personalized Responses**: Tailor responses based on user history and preferences
4. **Multi-language Support**: Support for multiple languages
5. **Voice Interface**: Add speech-to-text and text-to-speech capabilities

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`
5. Go in Project folder --->  Go in src folder --> Open the folder in Terminal and type `npm install ` and next `npm run dev`
