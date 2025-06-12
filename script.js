class DigitalLiteracyChatbot {
  constructor() {
    this.apiUrl = "http://localhost:5000/chat";
    this.currentCategory = null;
    this.isTyping = false;

    this.initializeElements();
    this.bindEvents();
    this.initializeWidget();
  }

  initializeElements() {
    // Main chat elements
    this.chatMessages = document.getElementById("chatMessages");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.chatForm = document.getElementById("chatForm");

    // Widget elements
    this.floatingWidget = document.getElementById("floatingWidget");
    this.widgetButton = document.getElementById("widgetButton");
    this.widgetChat = document.getElementById("widgetChat");
    this.widgetClose = document.getElementById("widgetClose");
    this.widgetMessages = document.getElementById("widgetMessages");
    this.widgetInput = document.getElementById("widgetInput");
    this.widgetForm = document.getElementById("widgetForm");

    // Category buttons
    this.categoryButtons = document.querySelectorAll(".category-btn");
  }

  bindEvents() {
    // Main chat form
    this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e));

    // Category buttons
    this.categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () =>
        this.selectCategory(btn.dataset.category)
      );
    });

    // Widget events
    this.widgetButton.addEventListener("click", () => this.toggleWidget());
    this.widgetClose.addEventListener("click", () => this.closeWidget());
    this.widgetForm.addEventListener("submit", (e) =>
      this.handleWidgetSubmit(e)
    );

    // Enter key handling
    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit(e);
      }
    });
  }

  initializeWidget() {
    // Show widget if embedded
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("embed") === "true" ||
      window.location.pathname.includes("embed")
    ) {
      this.floatingWidget.style.display = "block";
      document.querySelector(".container").style.display = "none";
    }
  }

  selectCategory(category) {
    this.currentCategory = category;

    // Update button states
    this.categoryButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });

    // Send category selection message
    const categoryMessages = {
      whatsapp: "I'd like to learn about WhatsApp",
      paytm: "I'd like to learn about Paytm",
      googlemaps: "I'd like to learn about Google Maps",
      general: "I need general help with digital tools",
    };

    if (categoryMessages[category]) {
      this.sendMessage(categoryMessages[category]);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const message = this.messageInput.value.trim();
    if (message && !this.isTyping) {
      this.sendMessage(message);
      this.messageInput.value = "";
    }
  }

  async handleWidgetSubmit(e) {
    e.preventDefault();
    const message = this.widgetInput.value.trim();
    if (message && !this.isTyping) {
      this.sendWidgetMessage(message);
      this.widgetInput.value = "";
    }
  }

  async sendMessage(message) {
    // Add user message to chat
    this.addMessage(message, "user");

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Send to Python backend
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          category: this.currentCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator and add bot response
      this.hideTypingIndicator();
      this.addMessage(data.response, "bot");
    } catch (error) {
      console.error("Error:", error);
      this.hideTypingIndicator();

      // Use fallback response
      const fallbackResponse = this.getFallbackResponse(message);
      this.addMessage(fallbackResponse, "bot");
    }
  }

  async sendWidgetMessage(message) {
    this.addWidgetMessage(message, "user");
    this.showWidgetTyping();

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          category: this.currentCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.hideWidgetTyping();
      this.addWidgetMessage(data.response, "bot");
    } catch (error) {
      console.error("Error:", error);
      this.hideWidgetTyping();

      const fallbackResponse = this.getFallbackResponse(message);
      this.addWidgetMessage(fallbackResponse, "bot");
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // WhatsApp responses
    if (lowerMessage.includes("whatsapp")) {
      if (lowerMessage.includes("photo") || lowerMessage.includes("picture")) {
        return `To send a photo on WhatsApp:
1. Open WhatsApp chat 📱
2. Tap the 📎 (attachment) icon
3. Select 'Camera' or 'Gallery'
4. Choose your photo
5. Add caption if needed
6. Tap Send button ➤`;
      }
      if (lowerMessage.includes("call") || lowerMessage.includes("video")) {
        return `To make a video call on WhatsApp:
1. Open the chat with the person 👤
2. Tap the 📹 video call icon at the top
3. Wait for them to answer
4. Enjoy your video call!`;
      }
      if (lowerMessage.includes("group")) {
        return `To create a WhatsApp group:
1. Tap the 3 dots menu ⋮
2. Select 'New Group'
3. Add participants
4. Give your group a name
5. Tap the green checkmark ✓`;
      }
    }

    // Paytm responses
    if (
      lowerMessage.includes("paytm") ||
      lowerMessage.includes("money") ||
      lowerMessage.includes("payment")
    ) {
      if (lowerMessage.includes("send") || lowerMessage.includes("transfer")) {
        return `To send money via Paytm:
1. Open Paytm app 📱
2. Tap 'Send Money'
3. Enter mobile number or scan QR
4. Enter amount
5. Add note (optional)
6. Enter PIN to confirm`;
      }
      if (lowerMessage.includes("recharge")) {
        return `To recharge your mobile:
1. Open Paytm
2. Tap 'Mobile Recharge' 📞
3. Enter your mobile number
4. Select operator
5. Choose recharge amount
6. Pay using wallet/card`;
      }
    }

    // Google Maps responses
    if (
      lowerMessage.includes("maps") ||
      lowerMessage.includes("direction") ||
      lowerMessage.includes("navigate")
    ) {
      return `To get directions on Google Maps:
1. Open Google Maps app 🗺️
2. Tap the search bar
3. Type your destination
4. Tap 'Directions' button
5. Choose travel mode (🚗 car, 🚶 walk, 🚌 bus)
6. Tap 'Start' to begin navigation`;
    }

    // Greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return `Hello! 👋 Welcome to Digital Literacy Campaign!

I can help you learn:
📱 **WhatsApp** - Send messages, photos, make calls
💳 **Paytm** - Send money, recharge, pay bills  
🗺️ **Google Maps** - Get directions, find places

What would you like to learn about?`;
    }

    // Default response
    return `I'd love to help you! 😊

I can teach you about:
• **WhatsApp**: Sending photos, making calls, creating groups
• **Paytm**: Sending money, mobile recharge, paying bills
• **Google Maps**: Getting directions, finding nearby places

Try asking something like:
- "How to send photo on WhatsApp?"
- "How to send money via Paytm?"
- "How to get directions on Google Maps?"

What would you like to learn?`;
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = this.formatMessage(content);

    messageDiv.appendChild(contentDiv);

    // Remove welcome message if it exists
    const welcomeMessage = this.chatMessages.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addWidgetMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `${sender}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = this.formatMessage(content);

    messageDiv.appendChild(contentDiv);
    this.widgetMessages.appendChild(messageDiv);
    this.widgetMessages.scrollTop = this.widgetMessages.scrollHeight;
  }

  formatMessage(content) {
    // Convert line breaks to HTML and preserve formatting
    return content
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  }

  showTypingIndicator() {
    this.isTyping = true;
    this.sendButton.disabled = true;

    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message typing-message";
    typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    this.sendButton.disabled = false;

    const typingMessage = this.chatMessages.querySelector(".typing-message");
    if (typingMessage) {
      typingMessage.remove();
    }
  }

  showWidgetTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message typing-message";
    typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
    this.widgetMessages.appendChild(typingDiv);
    this.widgetMessages.scrollTop = this.widgetMessages.scrollHeight;
  }

  hideWidgetTyping() {
    const typingMessage = this.widgetMessages.querySelector(".typing-message");
    if (typingMessage) {
      typingMessage.remove();
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  toggleWidget() {
    const isVisible = this.widgetChat.style.display === "block";
    this.widgetChat.style.display = isVisible ? "none" : "block";
  }

  closeWidget() {
    this.widgetChat.style.display = "none";
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DigitalLiteracyChatbot();
});
