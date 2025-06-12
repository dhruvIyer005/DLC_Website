class AccessibilityManager {
  constructor() {
    this.currentFontSize = 1;
    this.currentLanguage = "en";
    this.isListening = false;
    this.recognition = null;

    this.initializeAccessibility();
    this.bindEvents();
    this.initializeVoiceRecognition();
  }

  initializeAccessibility() {
    // Load saved preferences
    const savedFontSize = localStorage.getItem("fontSize");
    const savedLanguage = localStorage.getItem("language");

    if (savedFontSize) {
      this.currentFontSize = Number.parseFloat(savedFontSize);
      this.applyFontSize();
    }

    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
      this.applyLanguage();
    }
  }

  bindEvents() {
    // Font size controls
    const increaseFontBtn = document.getElementById("increaseFont");
    const decreaseFontBtn = document.getElementById("decreaseFont");
    const languageSelector = document.getElementById("languageSelector");
    const voiceCommandBtn = document.getElementById("voiceCommand");

    if (increaseFontBtn) {
      increaseFontBtn.addEventListener("click", () => this.increaseFontSize());
    }

    if (decreaseFontBtn) {
      decreaseFontBtn.addEventListener("click", () => this.decreaseFontSize());
    }

    if (languageSelector) {
      languageSelector.value = this.currentLanguage;
      languageSelector.addEventListener("change", (e) =>
        this.changeLanguage(e.target.value)
      );
    }

    if (voiceCommandBtn) {
      voiceCommandBtn.addEventListener("click", () =>
        this.toggleVoiceCommand()
      );
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mainNav = document.querySelector(".main-nav");

    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("active");
      });
    }
  }

  increaseFontSize() {
    if (this.currentFontSize < 1.4) {
      this.currentFontSize += 0.1;
      this.applyFontSize();
      this.saveFontSize();
    }
  }

  decreaseFontSize() {
    if (this.currentFontSize > 0.8) {
      this.currentFontSize -= 0.1;
      this.applyFontSize();
      this.saveFontSize();
    }
  }

  applyFontSize() {
    document.documentElement.style.setProperty(
      "--font-size-scale",
      this.currentFontSize
    );

    // Apply font size classes for better control
    document.body.classList.remove(
      "font-small",
      "font-large",
      "font-extra-large"
    );

    if (this.currentFontSize <= 0.9) {
      document.body.classList.add("font-small");
    } else if (this.currentFontSize >= 1.2) {
      document.body.classList.add("font-large");
    } else if (this.currentFontSize >= 1.4) {
      document.body.classList.add("font-extra-large");
    }
  }

  saveFontSize() {
    localStorage.setItem("fontSize", this.currentFontSize.toString());
  }

  changeLanguage(language) {
    this.currentLanguage = language;
    this.applyLanguage();
    localStorage.setItem("language", language);
  }

  applyLanguage() {
    // Basic language translations
    const translations = {
      en: {
        "Empowering Digital Literacy!": "Empowering Digital Literacy!",
        Home: "Home",
        Tutorials: "Tutorials",
        "AI Chat": "AI Chat",
        Feedback: "Feedback",
        "Start Learning": "Start Learning",
        "Ask DigiBuddy": "Ask DigiBuddy",
      },
      hi: {
        "Empowering Digital Literacy!": "डिजिटल साक्षरता को सशक्त बनाना!",
        Home: "होम",
        Tutorials: "ट्यूटोरियल",
        "AI Chat": "एआई चैट",
        Feedback: "फीडबैक",
        "Start Learning": "सीखना शुरू करें",
        "Ask DigiBuddy": "डिजीबडी से पूछें",
      },
      ta: {
        "Empowering Digital Literacy!": "டிஜிட்டல் கல்வியறிவை வலுப்படுத்துதல்!",
        Home: "முகப்பு",
        Tutorials: "பயிற்சிகள்",
        "AI Chat": "AI அரட்டை",
        Feedback: "கருத்து",
        "Start Learning": "கற்றல் தொடங்கு",
        "Ask DigiBuddy": "டிஜிபடியிடம் கேளுங்கள்",
      },
      te: {
        "Empowering Digital Literacy!": "డిజిటల్ అక్షరాస్యతను శక్తివంతం చేయడం!",
        Home: "హోమ్",
        Tutorials: "ట్యుటోరియల్స్",
        "AI Chat": "AI చాట్",
        Feedback: "ఫీడ్‌బ్యాక్",
        "Start Learning": "నేర్చుకోవడం ప్రారంభించండి",
        "Ask DigiBuddy": "డిజిబడ్డీని అడగండి",
      },
    };

    // Apply translations to elements with data-translate attribute
    const elementsToTranslate = document.querySelectorAll("[data-translate]");
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (
        translations[this.currentLanguage] &&
        translations[this.currentLanguage][key]
      ) {
        element.textContent = translations[this.currentLanguage][key];
      }
    });
  }

  initializeVoiceRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.getLanguageCode();

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.processVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        this.isListening = false;
        this.updateVoiceButton();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButton();
      };
    }
  }

  getLanguageCode() {
    const languageCodes = {
      en: "en-US",
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
    };
    return languageCodes[this.currentLanguage] || "en-US";
  }

  toggleVoiceCommand() {
    if (!this.recognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.lang = this.getLanguageCode();
      this.recognition.start();
      this.isListening = true;
      this.updateVoiceButton();
    }
  }

  updateVoiceButton() {
    const voiceBtn = document.getElementById("voiceCommand");
    if (voiceBtn) {
      if (this.isListening) {
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop';
        voiceBtn.style.background = "#ff4444";
      } else {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice';
        voiceBtn.style.background = "rgba(255, 255, 255, 0.2)";
      }
    }
  }

  processVoiceCommand(transcript) {
    console.log("Voice command:", transcript);

    // Navigation commands
    if (transcript.includes("home") || transcript.includes("होम")) {
      window.location.href = "index.html";
    } else if (
      transcript.includes("tutorial") ||
      transcript.includes("ट्यूटोरियल")
    ) {
      window.location.href = "tutorials.html";
    } else if (transcript.includes("chat") || transcript.includes("चैट")) {
      window.location.href = "chat.html";
    } else if (
      transcript.includes("feedback") ||
      transcript.includes("फीडबैक")
    ) {
      window.location.href = "feedback.html";
    }

    // Font size commands
    else if (
      transcript.includes("increase font") ||
      transcript.includes("bigger text")
    ) {
      this.increaseFontSize();
    } else if (
      transcript.includes("decrease font") ||
      transcript.includes("smaller text")
    ) {
      this.decreaseFontSize();
    }

    // Chat commands
    else if (
      transcript.includes("open chat") ||
      transcript.includes("start chat")
    ) {
      const chatWidget = document.getElementById("floatingWidget");
      const chatButton = document.getElementById("widgetButton");
      if (chatWidget && chatButton) {
        chatButton.click();
      }
    }

    // Send voice command to chat if chat input is available
    else {
      const chatInput =
        document.getElementById("messageInput") ||
        document.getElementById("widgetInput");
      if (chatInput) {
        chatInput.value = transcript;
        const chatForm =
          document.getElementById("chatForm") ||
          document.getElementById("widgetForm");
        if (chatForm) {
          chatForm.dispatchEvent(new Event("submit"));
        }
      }
    }
  }

  // Text-to-speech for bot responses
  speakText(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode();
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }
}

// Initialize accessibility manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.accessibilityManager = new AccessibilityManager();
});
