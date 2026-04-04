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
/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  chatWindow.textContent = "⏳ Thinking..."; // Placeholder
  try{
    // When using Cloudflare, you'll need to POST a `messages` array in the body,
    // and handle the response using: data.choices[0].message.content
    messages.push({ role: "user", content: userInput.value });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages, 
        //FIXME: Finetune properties
      })
    });

    if (!response.ok) {
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
