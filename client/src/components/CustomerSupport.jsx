import React, { useState, useRef, useEffect } from 'react';

const CustomerSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! Welcome to Where is my bus? support. I'm here to help you with bus bookings, tracking, payments, and more. How can I assist you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const quickReplies = [
    'How to book a bus?',
    'Track my bus',
    'Payment issues',
    'Cancel booking',
    'Refund status',
  ];

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('book') || lowerMessage.includes('ticket') || lowerMessage.includes('seat')) {
      return "To book a bus ticket:\n\n1. Go to the **Buses** page from the menu\n2. Search for your route by entering source and destination\n3. Select your preferred bus and timing\n4. Choose your seats from the seat layout\n5. Complete the payment to confirm your booking\n\nYour booking confirmation will be sent to your registered email.";
    }

    if (lowerMessage.includes('track') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return "To track your bus in real-time:\n\n1. Go to **My Bookings** page\n2. Find your active booking\n3. Click on the **Track Bus** button\n4. You'll see the live location on the map\n\nNote: Real-time tracking is available only for buses currently on the route.";
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('failed')) {
      return "If you're facing payment issues:\n\n1. Check your internet connection\n2. Ensure your card/UPI details are correct\n3. Check if the amount was debited from your account\n4. Wait 15-30 minutes for the transaction to reflect\n\nIf payment was deducted but booking not confirmed, please check **My Bookings**. The refund will be processed automatically within 5-7 working days if the booking failed.";
    }

    if (lowerMessage.includes('cancel') || lowerMessage.includes('cancellation')) {
      return "To cancel your booking:\n\n1. Go to **My Bookings** page\n2. Find the booking you want to cancel\n3. Click on **Cancel Booking**\n4. Confirm the cancellation\n\n**Cancellation Policy:**\n- More than 24 hours before departure: 90% refund\n- 12-24 hours before departure: 75% refund\n- 6-12 hours before departure: 50% refund\n- Less than 6 hours: No refund";
    }

    if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
      return "**Refund Information:**\n\nRefunds are typically processed within 5-7 working days to your original payment method.\n\nTo check your refund status:\n1. Go to **My Bookings**\n2. Click on the cancelled booking\n3. View the refund status\n\nIf it's been more than 7 working days, please contact your bank or reach out to our human support.";
    }

    if (lowerMessage.includes('login') || lowerMessage.includes('sign') || lowerMessage.includes('password') || lowerMessage.includes('account')) {
      return "**Account & Login Help:**\n\n- **Forgot Password?** Click 'Forgot Password' on the login page to reset it\n- **Can't login?** Make sure you're using the correct email/password\n- **New user?** Click 'Register' to create a new account\n- **Google Login:** You can also sign in quickly using your Google account\n\nIf you're still having issues, please contact our human support team.";
    }

    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('timing')) {
      return "To check bus schedules:\n\n1. Go to the **Timetable** page from the menu\n2. Select your route or bus number\n3. View the complete schedule with departure and arrival times\n\nTimetables are updated regularly. For real-time updates, please check the tracking feature.";
    }

    if (lowerMessage.includes('favorite') || lowerMessage.includes('save')) {
      return "To save your favorite buses:\n\n1. Browse buses on the **Buses** page\n2. Click the heart icon on any bus to add it to favorites\n3. Access all your favorites from the **Favorites** page\n\nThis makes it easier to quickly book your regular routes!";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('human')) {
      return "**Contact Support:**\n\n📧 Email: support@whereismybus.com\n📞 Phone: 1800-XXX-XXXX (Toll-free)\n⏰ Hours: 24/7 support available\n\nFor urgent issues, please call our helpline. For general queries, you can also email us and we'll respond within 24 hours.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you today? You can ask me about:\n\n• Booking a bus ticket\n• Tracking your bus\n• Payment issues\n• Cancellation & refunds\n• Login problems\n• Bus schedules";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with? Feel free to ask any questions about bus bookings, tracking, or payments.";
    }

    return "I'm here to help! You can ask me about:\n\n• **Booking** - How to book tickets, select seats\n• **Tracking** - Track your bus in real-time\n• **Payments** - Payment issues, refunds\n• **Cancellation** - Cancel bookings, refund policy\n• **Account** - Login, password issues\n• **Schedules** - Bus timetables\n\nFor specific issues not covered here, please contact our human support team.";
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(text),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
        aria-label="Customer Support"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-blue-100">We typically reply instantly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto rounded-full p-1 hover:bg-white/20 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="border-t border-gray-100 bg-white px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(reply)}
                  className="flex-shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerSupport;
