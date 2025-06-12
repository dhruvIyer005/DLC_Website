class FeedbackManager {
  constructor() {
    this.initializeFeedback();
  }

  initializeFeedback() {
    this.bindFormEvents();
    this.bindStarRating();
    this.bindOtherButtons();
  }

  bindFormEvents() {
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitFeedback();
      });
    }
  }

  bindStarRating() {
    const starInputs = document.querySelectorAll(".star-rating input");
    const starLabels = document.querySelectorAll(".star-rating label");

    starInputs.forEach((input, index) => {
      input.addEventListener("change", () => {
        // Update visual feedback
        starLabels.forEach((label, labelIndex) => {
          if (labelIndex >= starLabels.length - index - 1) {
            label.style.color = "#ffc107";
          } else {
            label.style.color = "#ddd";
          }
        });
      });
    });

    // Hover effects
    starLabels.forEach((label, index) => {
      label.addEventListener("mouseenter", () => {
        starLabels.forEach((l, lIndex) => {
          if (lIndex >= starLabels.length - index - 1) {
            l.style.color = "#ffc107";
          } else {
            l.style.color = "#ddd";
          }
        });
      });

      label.addEventListener("mouseleave", () => {
        // Reset to selected state
        const checkedInput = document.querySelector(
          ".star-rating input:checked"
        );
        if (checkedInput) {
          const checkedIndex = Array.from(starInputs).indexOf(checkedInput);
          starLabels.forEach((l, lIndex) => {
            if (lIndex >= starLabels.length - checkedIndex - 1) {
              l.style.color = "#ffc107";
            } else {
              l.style.color = "#ddd";
            }
          });
        } else {
          starLabels.forEach((l) => (l.style.color = "#ddd"));
        }
      });
    });
  }

  bindOtherButtons() {
    const submitAnotherBtn = document.getElementById("submitAnotherBtn");
    const openChatBtn = document.getElementById("openChatBtn");

    if (submitAnotherBtn) {
      submitAnotherBtn.addEventListener("click", () => {
        this.resetForm();
      });
    }

    if (openChatBtn) {
      openChatBtn.addEventListener("click", () => {
        // Open chat widget or navigate to chat page
        const chatWidget = document.getElementById("floatingWidget");
        const chatButton = document.getElementById("widgetButton");

        if (chatWidget && chatButton) {
          chatButton.click();
        } else {
          window.location.href = "chat.html";
        }
      });
    }
  }

  validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const feedbackType = document.getElementById("feedbackType").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const errors = [];

    if (!name) {
      errors.push("Name is required");
    }

    if (!email) {
      errors.push("Email is required");
    } else if (!this.isValidEmail(email)) {
      errors.push("Please enter a valid email address");
    }

    if (!feedbackType) {
      errors.push("Please select a feedback type");
    }

    if (!subject) {
      errors.push("Subject is required");
    }

    if (!message) {
      errors.push("Message is required");
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async submitFeedback() {
    const errors = this.validateForm();

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      feedbackType: document.getElementById("feedbackType").value,
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      rating:
        document.querySelector(".star-rating input:checked")?.value || null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Show loading state
      const submitBtn = document.querySelector(
        '.feedback-form button[type="submit"]'
      );
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      // Simulate API call (replace with actual endpoint)
      await this.simulateSubmission(formData);

      // Show success message
      this.showSuccessMessage();

      // Reset form
      document.getElementById("feedbackForm").reset();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    } finally {
      // Reset button state
      const submitBtn = document.querySelector(
        '.feedback-form button[type="submit"]'
      );
      submitBtn.textContent = "Submit Feedback";
      submitBtn.disabled = false;
    }
  }

  async simulateSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Feedback submitted:", formData);
        
        // fetch('/api/feedback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        resolve();
      }, 1000);
    });
  }

  showSuccessMessage() {
    const form = document.getElementById("feedbackForm");
    const successMessage = document.getElementById("feedbackSuccess");

    if (form && successMessage) {
      form.style.display = "none";
      successMessage.style.display = "block";

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: "smooth" });
    }
  }

  resetForm() {
    const form = document.getElementById("feedbackForm");
    const successMessage = document.getElementById("feedbackSuccess");

    if (form && successMessage) {
      form.style.display = "block";
      successMessage.style.display = "none";

      // Reset star rating visual state
      const starLabels = document.querySelectorAll(".star-rating label");
      starLabels.forEach((label) => (label.style.color = "#ddd"));

      // Scroll to form
      form.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Initialize feedback manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new FeedbackManager();
});
