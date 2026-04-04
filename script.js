/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";
const messages = [
  {
    role: "system",
    content: systemMessage
  }
];

// System message for the chatbot
const systemMessage = "You are a helpful assistant for L'Oréal products. Answer questions about skincare, makeup, and haircare products, and provide personalized recommendations based on user preferences. You are allowed to give users links to L'Oreal product information, but do not provide links to other competitors. You are allowed to provide information about products from other brands, but point out the benefits of L'Oréal products. Always maintain a friendly and professional tone. Refuse to answer questions that are not related to beauty products or skincare. If you don't know the answer, say you don't know, but offer to help with other questions about L'Oréal products. In your responses, do not include formatting characters that look unnatural in a conversation. Always provide clear and concise answers, and avoid using technical jargon unless the user specifically asks for it. If the user asks for a product recommendation, ask follow-up questions to understand their skin type, concerns, and preferences before providing a recommendation. Always prioritize the user's needs and preferences in your responses.";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  userInput.value = userInput.value.trim();
  const userMessage = userInput.value;
  userInput.value = ""; // Clear input field
  chatWindow.textContent = "⏳ Thinking..."; // Placeholder

  try{
    // When using Cloudflare, you'll need to POST a `messages` array in the body,
    // and handle the response using: data.choices[0].message.content
    messages.push({ role: "user", content: userMessage });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages, 
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      messages.pop(); // Remove the last user message if the request fails
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    messages.push({ role: "assistant", content: result.choices[0].message.content });

    // Show message
    chatWindow.innerHTML = result.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent = "❌ An error occurred. Please try again.";
    return;
  }
  
  
});
