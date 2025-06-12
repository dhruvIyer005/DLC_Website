from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import random
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Enhanced Digital Literacy Knowledge Base with Better AI Logic
class DigitalLiteracyAI:
    def __init__(self):
        self.knowledge_base = {
            "whatsapp": {
                "send_photo": {
                    "keywords": ["photo", "picture", "image", "send photo", "share photo", "pic", "camera", "gallery"],
                    "response": """📱 **How to send a photo on WhatsApp:**

1. Open WhatsApp chat
2. Tap the 📎 (attachment) icon at the bottom
3. Select 'Camera' to take new photo OR 'Gallery' for existing photo
4. Choose your photo
5. Add caption if needed (optional)
6. Tap the Send button ➤

**💡 Pro Tip:** You can also take a photo directly from the chat by tapping the camera icon next to the text box!

**🔒 Privacy:** Photos are end-to-end encrypted for your security."""
                },
                "video_call": {
                    "keywords": ["video call", "call", "video chat", "face call", "calling", "video", "face time"],
                    "response": """📹 **How to make a video call on WhatsApp:**

1. Open the chat with the person you want to call
2. Tap the 📹 video call icon at the top right
3. Wait for them to answer
4. Enjoy your video call!

**📞 For voice call:** Tap the phone icon instead

**💡 Tips:**
- Make sure you have good internet connection
- Use WiFi for better quality
- You can switch between front and back camera during call"""
                },
                "create_group": {
                    "keywords": ["group", "create group", "new group", "group chat", "make group", "add people"],
                    "response": """👥 **How to create a WhatsApp group:**

1. Tap the 3 dots menu (⋮) at top right
2. Select 'New Group'
3. Add participants by tapping + and selecting contacts
4. Give your group a name
5. Add group description (optional)
6. Tap the green checkmark ✓

**📝 Group Features:**
- Add up to 256 people
- Only admins can change group info
- Everyone can send messages by default"""
                },
                "send_message": {
                    "keywords": ["message", "text", "chat", "send message", "type", "write"],
                    "response": """💬 **How to send a message on WhatsApp:**

1. Open WhatsApp
2. Tap on the contact you want to message
3. Type your message in the text box at the bottom
4. Tap the Send button (➤) or press Enter

**✨ Fun Features:**
- Add emojis by tapping the smiley face 😊
- Send voice messages by holding the microphone 🎤
- Format text: *bold*, _italic_, ~strikethrough~"""
                },
                "status": {
                    "keywords": ["status", "story", "whatsapp status", "update status"],
                    "response": """📸 **How to post WhatsApp Status:**

1. Open WhatsApp
2. Tap 'Status' tab at the bottom
3. Tap the camera icon to take photo/video
4. Add text, stickers, or drawings if you want
5. Tap the Send button

**⏰ Important:** Status disappears after 24 hours automatically

**👀 Privacy:** You can choose who sees your status in Settings > Account > Privacy > Status"""
                }
            },
            "paytm": {
                "send_money": {
                    "keywords": ["send money", "transfer money", "pay someone", "money transfer", "send cash", "payment"],
                    "response": """💳 **How to send money via Paytm:**

1. Open Paytm app on your phone
2. Tap 'Send Money' or 'To Contact'
3. Enter recipient's mobile number OR scan their QR code
4. Enter the amount you want to send
5. Add a note/message (optional)
6. Enter your 4-digit PIN to confirm

**🔒 Security Tips:**
- Always verify the recipient's number
- Double-check the amount before confirming
- Never share your PIN with anyone
- Keep your PIN secret and secure"""
                },
                "mobile_recharge": {
                    "keywords": ["recharge", "mobile recharge", "phone recharge", "top up", "balance", "prepaid"],
                    "response": """📞 **How to recharge your mobile:**

1. Open Paytm app
2. Tap 'Mobile Recharge'
3. Enter your mobile number
4. Select your operator (Airtel, Jio, Vi, BSNL, etc.)
5. Choose recharge amount or select a plan
6. Pay using Paytm wallet, card, or UPI

**💡 Smart Tips:**
- Save your number for quick recharge next time
- Check plan details before recharging
- Set up auto-recharge to never run out of balance"""
                },
                "pay_bills": {
                    "keywords": ["pay bills", "bill payment", "electricity bill", "gas bill", "water bill", "bills"],
                    "response": """🧾 **How to pay bills on Paytm:**

1. Go to 'Bill Payments' section
2. Select bill type:
   - Electricity
   - Gas
   - Water
   - Broadband
   - DTH/Cable TV
3. Enter your consumer number (found on your bill)
4. Enter amount OR it will show automatically
5. Complete payment using wallet/card/UPI

**⚡ Auto-Pay Feature:** Set up auto-pay to never miss bill payments!"""
                },
                "scan_pay": {
                    "keywords": ["scan", "qr code", "scan and pay", "qr payment", "scanner", "qr"],
                    "response": """📷 **How to scan and pay with Paytm:**

1. Open Paytm app
2. Tap the 'Scan' icon (camera symbol)
3. Point your camera at the merchant's QR code
4. Enter the amount you want to pay
5. Add note if needed
6. Enter your PIN to confirm payment

**🛡️ Safety First:**
- Only scan QR codes from trusted merchants
- Verify the merchant name before paying
- Check the amount before confirming"""
                }
            },
            "googlemaps": {
                "directions": {
                    "keywords": ["directions", "navigate", "route", "how to reach", "navigation", "way", "go to"],
                    "response": """🗺️ **How to get directions on Google Maps:**

1. Open Google Maps app
2. Tap the search bar at the top
3. Type your destination (address, place name, or business)
4. Tap 'Directions' button (blue arrow)
5. Choose your travel mode:
   - 🚗 Car (driving)
   - 🚶 Walking
   - 🚌 Public transport
   - 🚲 Bicycle
6. Tap 'Start' to begin turn-by-turn navigation

**🎯 Pro Features:**
- Voice guidance while driving
- Real-time traffic updates
- Alternative route suggestions"""
                },
                "nearby_places": {
                    "keywords": ["nearby", "find places", "restaurants near me", "atm near me", "hospital near me", "near", "around"],
                    "response": """📍 **How to find nearby places:**

1. Open Google Maps
2. Tap 'Explore' at the bottom OR
3. Use the search bar and type:
   - "Restaurants near me"
   - "ATM near me"
   - "Hospital near me"
   - "Gas station near me"
4. Browse the results
5. Tap on any place for:
   - Reviews and ratings ⭐
   - Phone number 📞
   - Opening hours 🕐
   - Directions 🗺️

**💡 Categories:** Restaurants, Gas stations, ATMs, Hospitals, Shopping, etc."""
                },
                "save_places": {
                    "keywords": ["save places", "bookmark", "favorite places", "saved locations", "mark", "save"],
                    "response": """⭐ **How to save places on Google Maps:**

1. Search for the place you want to save
2. Tap on the place name/card at the bottom
3. Tap the 'Save' button (bookmark icon)
4. Choose a list:
   - ⭐ Starred places
   - 🏠 Want to go
   - 📝 Create new list
5. Access saved places from the menu (☰)

**🏠 Quick Setup:**
- Save your home address
- Save your work address
- Create lists like "Favorite Restaurants" or "Weekend Plans" """
                }
            },
            "general": {
                "safety": {
                    "keywords": ["safety", "secure", "safe", "fraud", "scam", "security", "protect", "otp", "pin"],
                    "response": """🔒 **Digital Safety Tips:**

**🚫 Never Share:**
- OTP/PIN with anyone (not even bank employees)
- Passwords or login details
- Personal information to unknown callers

**✅ Always Verify:**
- Check website URLs before entering details
- Verify payment details before confirming
- Use official apps from Play Store/App Store

**🛡️ Best Practices:**
- Use strong passwords (mix of letters, numbers, symbols)
- Enable 2-factor authentication
- Keep apps updated
- Log out from shared devices
- Don't click suspicious links

**📞 Remember:** Banks/Apps NEVER ask for PIN/OTP over phone calls!"""
                },
                "internet": {
                    "keywords": ["internet", "wifi", "data", "connection", "network", "online"],
                    "response": """📶 **Internet Connection Guide:**

**📡 Connect to WiFi:**
1. Go to Settings on your phone
2. Tap 'WiFi' or 'Wireless & Networks'
3. Select your network name
4. Enter password
5. Tap 'Connect'

**📱 Mobile Data:**
1. Go to Settings
2. Tap 'Mobile Data' or 'Cellular'
3. Turn ON mobile data

**💡 Data Saving Tips:**
- Use WiFi at home/office
- Turn off auto-updates on mobile data
- Download videos/music on WiFi
- Monitor data usage in settings

**🔍 Speed Test:** Search 'speed test' on Google to check your internet speed"""
                },
                "help": {
                    "keywords": ["help", "what can you do", "features", "capabilities", "assist", "support"],
                    "response": """🤖 **I'm here to help you with digital tools!**

**📱 WhatsApp:**
- Send messages and photos
- Make video/voice calls
- Create groups
- Post status updates

**💳 Paytm:**
- Send money safely
- Recharge mobile
- Pay bills (electricity, gas, water)
- Scan QR codes for payments

**🗺️ Google Maps:**
- Get directions anywhere
- Find nearby restaurants, ATMs, hospitals
- Save favorite places
- Download offline maps

**🔒 Digital Safety:**
- Protect yourself from fraud
- Secure your accounts
- Safe internet practices

Just ask me anything like "How to send photo?" or "How to pay bills?" and I'll guide you step by step! 😊"""
                }
            }
        }
        
        # Common question patterns for better matching
        self.question_patterns = {
            "what": ["what is", "what are", "what can", "what do"],
            "how": ["how to", "how do", "how can", "how does"],
            "where": ["where is", "where can", "where do"],
            "why": ["why is", "why do", "why should"],
            "when": ["when to", "when do", "when should"],
            "help": ["help me", "i need help", "can you help", "assist me"],
            "learn": ["learn about", "teach me", "show me", "explain"],
            "use": ["how to use", "using", "operate"]
        }
    
    def find_best_response(self, message, category=None):
        """Enhanced AI logic to find the best response"""
        message_lower = message.lower().strip()
        
        # Handle empty messages
        if not message_lower:
            return self.get_default_response()
        
        # First, try exact keyword matching
        best_match = self.keyword_matching(message_lower, category)
        if best_match:
            return best_match
        
        # Then try pattern-based matching for general questions
        pattern_match = self.pattern_matching(message_lower, category)
        if pattern_match:
            return pattern_match
        
        # Handle greetings
        if self.is_greeting(message_lower):
            return self.get_welcome_message()
        
        # Handle thanks
        if self.is_thanks(message_lower):
            return self.get_thanks_response()
        
        # Handle general help requests
        if self.is_help_request(message_lower):
            return self.knowledge_base["general"]["help"]["response"]
        
        # Handle app-specific general questions
        app_response = self.handle_app_questions(message_lower)
        if app_response:
            return app_response
        
        # Default response with suggestions
        return self.get_default_response()
    
    def keyword_matching(self, message, category=None):
        """Improved keyword matching with scoring"""
        best_match = None
        best_score = 0
        
        # Categories to search
        categories_to_search = [category] if category and category in self.knowledge_base else self.knowledge_base.keys()
        
        for cat_name in categories_to_search:
            if cat_name not in self.knowledge_base:
                continue
                
            category_data = self.knowledge_base[cat_name]
            for topic, data in category_data.items():
                score = 0
                for keyword in data["keywords"]:
                    if keyword in message:
                        # Score based on keyword length and position
                        score += len(keyword.split()) * 2
                        if message.startswith(keyword):
                            score += 5  # Bonus for starting with keyword
                
                if score > best_score:
                    best_score = score
                    best_match = data["response"]
        
        return best_match if best_score > 0 else None
    
    def pattern_matching(self, message, category=None):
        """Pattern-based matching for natural questions"""
        # Check for question patterns
        for pattern_type, patterns in self.question_patterns.items():
            for pattern in patterns:
                if pattern in message:
                    # Extract the main topic after the pattern
                    topic_part = message.replace(pattern, "").strip()
                    
                    # Try to match the topic part with keywords
                    topic_match = self.keyword_matching(topic_part, category)
                    if topic_match:
                        return topic_match
        
        return None
    
    def is_greeting(self, message):
        """Check if message is a greeting"""
        greetings = ["hello", "hi", "hey", "namaste", "good morning", "good evening", "start", "hola"]
        return any(greeting in message for greeting in greetings)
    
    def is_thanks(self, message):
        """Check if message is a thank you"""
        thanks = ["thank", "thanks", "thank you", "thx", "appreciate", "grateful"]
        return any(thank in message for thank in thanks)
    
    def is_help_request(self, message):
        """Check if message is asking for general help"""
        help_phrases = [
            "what can you do", "what do you do", "help me", "i need help", 
            "can you help", "what are your features", "what can you teach",
            "what do you know", "capabilities", "functions"
        ]
        return any(phrase in message for phrase in help_phrases)
    
    def handle_app_questions(self, message):
        """Handle general questions about specific apps"""
        if "whatsapp" in message:
            if any(word in message for word in ["what", "about", "tell me", "explain"]):
                return """📱 **About WhatsApp:**

WhatsApp is a messaging app that lets you:
- Send text messages for free
- Share photos and videos
- Make voice and video calls
- Create group chats
- Post status updates

**Popular features I can help with:**
• Sending photos and videos
• Making video calls
• Creating groups
• Posting status updates

Ask me "How to send photo?" or "How to make video call?" for step-by-step guides!"""
        
        elif "paytm" in message:
            if any(word in message for word in ["what", "about", "tell me", "explain"]):
                return """💳 **About Paytm:**

Paytm is a digital payment app that lets you:
- Send money to friends and family
- Recharge your mobile phone
- Pay utility bills (electricity, gas, water)
- Scan QR codes for payments
- Book tickets and services

**Popular features I can help with:**
• Sending money safely
• Mobile recharge
• Bill payments
• QR code scanning

Ask me "How to send money?" or "How to recharge mobile?" for detailed guides!"""
        
        elif "google maps" in message or "maps" in message:
            if any(word in message for word in ["what", "about", "tell me", "explain"]):
                return """🗺️ **About Google Maps:**

Google Maps is a navigation app that helps you:
- Get directions to any place
- Find nearby restaurants, ATMs, hospitals
- See real-time traffic updates
- Save your favorite places
- Download maps for offline use

**Popular features I can help with:**
• Getting directions
• Finding nearby places
• Saving locations
• Offline maps

Ask me "How to get directions?" or "How to find nearby restaurants?" for step-by-step help!"""
        
        return None
    
    def get_welcome_message(self):
        return """Hello! 👋 Welcome to Digital Literacy Campaign!

I'm your friendly AI assistant, ready to help you master digital tools! 

**I can teach you:**
📱 **WhatsApp** - Send messages, photos, make video calls, create groups
💳 **Paytm** - Send money, recharge mobile, pay bills safely  
🗺️ **Google Maps** - Get directions, find nearby places, save locations
🔒 **Digital Safety** - Stay secure online

**Just ask me things like:**
• "How to send photo on WhatsApp?"
• "How to send money via Paytm?"
• "How to get directions on Google Maps?"
• "What can you do?"

What would you like to learn today? 😊"""
    
    def get_thanks_response(self):
        return """You're welcome! 😊 

I'm always here to help you learn digital tools. Feel free to ask me anything about:
📱 WhatsApp
💳 Paytm  
🗺️ Google Maps
🔒 Digital Safety

Is there anything else you'd like to learn?"""
    
    def get_default_response(self):
        suggestions = [
            "How to send photo on WhatsApp?",
            "How to send money via Paytm?",
            "How to get directions on Google Maps?",
            "How to make video call on WhatsApp?",
            "How to recharge mobile on Paytm?",
            "How to find nearby restaurants?",
            "Digital safety tips",
            "What can you do?"
        ]
        
        random_suggestions = random.sample(suggestions, 3)
        
        return f"""I'd love to help you! 😊

I can teach you about:
📱 **WhatsApp** - Messaging, calls, groups, status
💳 **Paytm** - Payments, recharge, bills
🗺️ **Google Maps** - Navigation, nearby places
🔒 **Digital Safety** - Stay secure online

**Try asking:**
• {random_suggestions[0]}
• {random_suggestions[1]}
• {random_suggestions[2]}

You can also ask general questions like "What is WhatsApp?" or "Tell me about Paytm"!

What would you like to learn?"""

# Initialize AI
ai_assistant = DigitalLiteracyAI()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        message = data.get('message', '').strip()
        category = data.get('category', None)
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Log the incoming message for debugging
        print(f"Received message: '{message}' in category: {category}")
        
        # Simulate thinking time for better UX
        time.sleep(0.3)
        
        # Get AI response
        response = ai_assistant.find_best_response(message, category)
        
        print(f"Generated response: {response[:100]}...")  # Log first 100 chars
        
        return jsonify({
            'response': response,
            'category': category,
            'timestamp': int(time.time()),
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Sorry, I encountered an error. Please try again.',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Digital Literacy Chatbot AI is running!',
        'timestamp': int(time.time())
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Digital Literacy Campaign Chatbot API',
        'version': '2.0.0',
        'endpoints': {
            'chat': '/chat (POST)',
            'health': '/health (GET)'
        },
        'features': [
            'Enhanced keyword matching',
            'Pattern-based question understanding',
            'General conversation support',
            'App-specific help'
        ]
    })

if __name__ == '__main__':
    print("🚀 Starting Digital Literacy Campaign Chatbot AI v2.0...")
    print("📱 Ready to help users learn WhatsApp, Paytm, and Google Maps!")
    print("🤖 Enhanced AI with better conversation understanding")
    print("💬 Now handles general questions and natural language")
    print("🌐 Server running on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
