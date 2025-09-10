const { Question } = require('../models/Game');

const sampleQuestions = [
  {
    question: "What is the most secure way to create a password?",
    options: [
      "Use your birthday and name",
      "Use a combination of uppercase, lowercase, numbers, and symbols",
      "Use the same password for all accounts",
      "Use dictionary words only"
    ],
    correctAnswer: 1,
    explanation: "A strong password should include a mix of uppercase letters, lowercase letters, numbers, and special symbols to make it harder to crack.",
    difficulty: "easy",
    category: "passwords"
  },
  {
    question: "What does HTTPS stand for and why is it important?",
    options: [
      "Hypertext Transfer Protocol Secure - encrypts data in transit",
      "High Tech Transfer Protocol System - faster data transfer",
      "Hypertext Transport Protocol Standard - industry standard",
      "Home Transfer Protocol Security - protects home networks"
    ],
    correctAnswer: 0,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts data transmitted between your browser and websites, protecting sensitive information from eavesdropping.",
    difficulty: "easy",
    category: "general"
  },
  {
    question: "What is phishing?",
    options: [
      "A type of computer virus",
      "A method of catching fish online",
      "A fraudulent attempt to obtain sensitive information",
      "A way to speed up internet connection"
    ],
    correctAnswer: 2,
    explanation: "Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information like passwords, credit card numbers, or personal data.",
    difficulty: "easy",
    category: "phishing"
  },
  {
    question: "Which of the following is a sign of a phishing email?",
    options: [
      "Urgent language demanding immediate action",
      "Generic greetings like 'Dear Customer'",
      "Suspicious links or attachments",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Phishing emails often use urgent language, generic greetings, and contain suspicious links or attachments. Being aware of these signs helps you identify and avoid phishing attempts.",
    difficulty: "medium",
    category: "phishing"
  },
  {
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Using two different passwords",
      "An additional security layer requiring a second form of verification",
      "Having two email accounts",
      "Using two different browsers"
    ],
    correctAnswer: 1,
    explanation: "Two-factor authentication adds an extra layer of security by requiring a second form of verification (like a code sent to your phone) in addition to your password.",
    difficulty: "medium",
    category: "general"
  },
  {
    question: "What is malware?",
    options: [
      "A type of hardware malfunction",
      "Malicious software designed to harm or exploit devices",
      "A broken email attachment",
      "A slow internet connection"
    ],
    correctAnswer: 1,
    explanation: "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
    difficulty: "easy",
    category: "malware"
  },
  {
    question: "What should you do before clicking on a link in an email?",
    options: [
      "Click it immediately",
      "Hover over it to see the actual URL",
      "Forward the email first",
      "Nothing, all links are safe"
    ],
    correctAnswer: 1,
    explanation: "Always hover over links to see the actual destination URL before clicking. This helps you identify potentially malicious links that may lead to phishing sites.",
    difficulty: "medium",
    category: "phishing"
  },
  {
    question: "What is social engineering in cybersecurity?",
    options: [
      "Building social media networks",
      "Manipulating people to divulge confidential information",
      "Engineering social software",
      "Creating social websites"
    ],
    correctAnswer: 1,
    explanation: "Social engineering is the psychological manipulation of people to perform actions or divulge confidential information, often used by cybercriminals to gain unauthorized access.",
    difficulty: "medium",
    category: "social-engineering"
  },
  {
    question: "Which of these is NOT a common sign of malware infection?",
    options: [
      "Computer running slower than usual",
      "Unexpected pop-up advertisements",
      "Files being encrypted or deleted",
      "Receiving software update notifications"
    ],
    correctAnswer: 3,
    explanation: "Legitimate software update notifications are normal and important for security. The other options are common signs of malware infection.",
    difficulty: "medium",
    category: "malware"
  },
  {
    question: "What is the principle of 'least privilege' in cybersecurity?",
    options: [
      "Users should have the minimum access rights needed to perform their job",
      "Only privileged users should have computer access",
      "Passwords should be as short as possible",
      "Security measures should be minimal to avoid inconvenience"
    ],
    correctAnswer: 0,
    explanation: "The principle of least privilege means giving users only the minimum access rights necessary to perform their job functions, reducing potential attack surfaces.",
    difficulty: "hard",
    category: "general"
  }
];

async function seedQuestions() {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    
    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log('Sample questions seeded successfully!');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}

module.exports = { seedQuestions };