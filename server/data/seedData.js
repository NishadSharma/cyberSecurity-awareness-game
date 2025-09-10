const { Question, Scenario } = require('../models/Game');
const User = require('../models/User');

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
  },
  {
    question: "What should you do if you suspect your password has been compromised?",
    options: [
      "Wait and see if anything bad happens",
      "Change the password immediately and enable 2FA",
      "Only change it if you're sure it was compromised",
      "Just enable 2FA without changing the password"
    ],
    correctAnswer: 1,
    explanation: "If you suspect password compromise, immediately change it and enable two-factor authentication for additional security.",
    difficulty: "easy",
    category: "passwords"
  },
  {
    question: "What is a zero-day vulnerability?",
    options: [
      "A vulnerability that takes zero days to exploit",
      "A security flaw unknown to software vendors and without available patches",
      "A vulnerability that expires after one day",
      "A bug that causes zero damage to systems"
    ],
    correctAnswer: 1,
    explanation: "A zero-day vulnerability is a security flaw that is unknown to software vendors and security researchers, meaning no patch or fix is available.",
    difficulty: "hard",
    category: "general"
  },
  {
    question: "Which practice helps prevent social engineering attacks?",
    options: [
      "Always being helpful and trusting",
      "Verifying identity before sharing sensitive information",
      "Sharing passwords with trusted colleagues",
      "Responding quickly to urgent requests"
    ],
    correctAnswer: 1,
    explanation: "Always verify the identity of anyone requesting sensitive information through independent channels before sharing any data.",
    difficulty: "medium",
    category: "social-engineering"
  }
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
    question: "What should you do if you receive a suspicious email?",
    options: [
      "Click on links to verify if they're real",
      "Forward it to all your contacts",
      "Delete it and report it to your IT department",
      "Reply asking for more information"
    ],
    correctAnswer: 2,
    explanation: "If you receive a suspicious email, the safest approach is to delete it and report it to your IT department or security team. Never click on suspicious links or provide personal information.",
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
    question: "Which of these is the strongest password?",
    options: [
      "password123",
      "MyDog'sName",
      "Tr0ub4dor&3",
      "correct horse battery staple"
    ],
    correctAnswer: 3,
    explanation: "Long passphrases with random words are often stronger than complex short passwords because they're harder to crack but easier to remember.",
    difficulty: "hard",
    category: "passwords"
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
    question: "How often should you update your passwords?",
    options: [
      "Never",
      "Every 10 years",
      "Every 3-6 months or immediately if compromised",
      "Only when you forget them"
    ],
    correctAnswer: 2,
    explanation: "Passwords should be updated regularly (every 3-6 months) and immediately if you suspect they've been compromised.",
    difficulty: "easy",
    category: "passwords"
  }
];

const sampleScenarios = [
  {
    title: "Suspicious Email from Bank",
    description: "You receive an email claiming to be from your bank asking you to verify your account information.",
    situation: "You receive an email with the subject 'URGENT: Your account will be suspended!' The email claims to be from your bank and asks you to click a link to verify your account information to prevent suspension. The email has your bank's logo but the sender's email address is 'security@bankk-alerts.com' (note the double 'k'). What should you do?",
    choices: [
      {
        text: "Click the link immediately to prevent account suspension",
        isCorrect: false,
        feedback: "This is incorrect. The suspicious email address and urgent language are red flags. Clicking the link could lead you to a phishing site designed to steal your credentials."
      },
      {
        text: "Delete the email and contact your bank directly using their official phone number or website",
        isCorrect: true,
        feedback: "Correct! This is the safest approach. Banks will never ask for sensitive information via email. Always verify suspicious communications through official channels."
      },
      {
        text: "Reply to the email asking for more information",
        isCorrect: false,
        feedback: "This is incorrect. Replying to a phishing email confirms that your email address is active and may result in more phishing attempts."
      },
      {
        text: "Forward the email to friends to ask their opinion",
        isCorrect: false,
        feedback: "This is incorrect. Forwarding phishing emails can spread the threat to others. Instead, report it to your bank and delete it."
      }
    ],
    category: "phishing"
  },
  {
    title: "USB Drive Found in Parking Lot",
    description: "You find a USB drive in your company's parking lot with a label 'Salary Information - Confidential'.",
    situation: "While walking to your car after work, you find a USB drive on the ground with a label that reads 'Salary Information - Confidential'. You're curious about what's on it and whether it contains information about employee salaries at your company. What should you do?",
    choices: [
      {
        text: "Plug it into your work computer to see what's on it",
        isCorrect: false,
        feedback: "This is very dangerous! Unknown USB drives can contain malware that could infect your computer and spread throughout your company's network. This is a common social engineering tactic."
      },
      {
        text: "Take it home and plug it into your personal computer",
        isCorrect: false,
        feedback: "This is also dangerous. The USB drive could contain malware that would infect your personal computer and potentially steal your personal information."
      },
      {
        text: "Report it to your IT security team without plugging it in anywhere",
        isCorrect: true,
        feedback: "Correct! This is the safest approach. Unknown USB drives are a common attack vector. Your IT security team can safely analyze it if needed."
      },
      {
        text: "Throw it in the trash",
        isCorrect: false,
        feedback: "While this avoids the security risk, it's better to report it to your IT security team so they can be aware of potential security threats targeting your organization."
      }
    ],
    category: "social-engineering"
  },
  {
    title: "Suspicious Phone Call",
    description: "You receive a phone call from someone claiming to be from IT support asking for your password.",
    situation: "You receive a phone call from someone who says they're from your company's IT support. They claim there's been a security breach and they need your username and password to 'secure your account immediately'. The caller seems to know some basic information about your company but is asking for your credentials. What should you do?",
    choices: [
      {
        text: "Provide your credentials since they're from IT support",
        isCorrect: false,
        feedback: "This is incorrect. Legitimate IT support will never ask for your password over the phone. This is a classic social engineering attack."
      },
      {
        text: "Ask for their employee ID and call back the main IT number to verify",
        isCorrect: true,
        feedback: "Correct! Always verify the identity of anyone asking for sensitive information by calling them back through official channels. Legitimate IT staff will understand and appreciate your caution."
      },
      {
        text: "Give them a fake password to test if they're legitimate",
        isCorrect: false,
        feedback: "This is not recommended. It's better to simply hang up and verify through official channels rather than engage with potential attackers."
      },
      {
        text: "Hang up immediately without saying anything",
        isCorrect: false,
        feedback: "While hanging up avoids the immediate threat, it's better to verify through official channels and report the incident to your real IT security team."
      }
    ],
    category: "social-engineering"
  },
  {
    title: "Public Wi-Fi Security",
    description: "You're at a coffee shop and need to access your online banking using the public Wi-Fi.",
    situation: "You're at a coffee shop and need to check your bank account balance urgently. The coffee shop offers free Wi-Fi called 'CoffeeShop_Free'. You notice there are actually two networks: 'CoffeeShop_Free' and 'CoffeeShop_Guest'. You need to access your online banking. What should you do?",
    choices: [
      {
        text: "Connect to either network and access your banking normally",
        isCorrect: false,
        feedback: "This is risky. Public Wi-Fi networks are not secure, and accessing sensitive financial information could expose your credentials to attackers on the same network."
      },
      {
        text: "Ask the coffee shop staff which network is legitimate, then use your mobile data or VPN for banking",
        isCorrect: true,
        feedback: "Correct! First verify which network is legitimate, but for sensitive activities like banking, it's safest to use your mobile data or a VPN to encrypt your connection."
      },
      {
        text: "Connect to the network with the strongest signal",
        isCorrect: false,
        feedback: "Signal strength doesn't indicate security or legitimacy. Attackers often set up fake networks with strong signals to attract victims."
      },
      {
        text: "Wait until you get home to check your banking",
        isCorrect: false,
        feedback: "While this is safe, it may not address your urgent need. Using mobile data or a VPN would be a better solution that balances security with accessibility."
      }
    ],
    category: "data-breach"
  },
  {
    title: "Suspicious Software Installation",
    description: "A pop-up appears claiming your computer is infected and offers to install security software.",
    situation: "While browsing the internet, a pop-up window suddenly appears claiming 'Your computer is infected with 5 viruses!' It offers to download and install 'UltraSecure Antivirus Pro' for free to clean your system immediately. The pop-up looks professional and has flashing red warnings. What should you do?",
    choices: [
      {
        text: "Click 'Download Now' to install the free antivirus",
        isCorrect: false,
        feedback: "This is incorrect. This is likely a scareware attack. The 'antivirus' software is probably malware designed to infect your computer or steal your information."
      },
      {
        text: "Close the pop-up and run a scan with your existing antivirus software",
        isCorrect: true,
        feedback: "Correct! Close the pop-up without clicking anything on it, then use your legitimate antivirus software to scan your system. These pop-ups are usually fake scare tactics."
      },
      {
        text: "Click 'Cancel' or 'No Thanks' on the pop-up",
        isCorrect: false,
        feedback: "Even clicking 'Cancel' on malicious pop-ups can trigger downloads or redirects. It's better to close the entire browser window or use Task Manager."
      },
      {
        text: "Call the phone number provided in the pop-up for help",
        isCorrect: false,
        feedback: "This is incorrect. The phone number is likely connected to scammers who will try to gain remote access to your computer or sell you fake software."
      }
    ],
    category: "malware"
  },
  {
    title: "Suspicious Social Media Message",
    description: "You receive a message on social media from a friend asking for money urgently.",
    situation: "You receive a direct message on social media from a close friend saying: 'Hey! I'm stuck abroad and lost my wallet. Can you send me $500 via wire transfer? I'll pay you back as soon as I get home. Please hurry, I'm in trouble!' The message seems urgent, but something feels off about the writing style. What should you do?",
    choices: [
      {
        text: "Send the money immediately since it's from a friend",
        isCorrect: false,
        feedback: "This is incorrect. Social media accounts can be compromised. Scammers often impersonate friends to request money urgently."
      },
      {
        text: "Call your friend directly to verify the situation before taking any action",
        isCorrect: true,
        feedback: "Correct! Always verify urgent requests through a different communication channel. Call your friend directly to confirm they actually sent the message."
      },
      {
        text: "Ask for more details about their location in the message",
        isCorrect: false,
        feedback: "This is not the best approach. Engaging with potential scammers can lead to more sophisticated attempts. Direct verification is safer."
      },
      {
        text: "Send a smaller amount first to test if it's really them",
        isCorrect: false,
        feedback: "This is incorrect. Any amount sent to scammers is money lost. Always verify through independent channels before sending any money."
      }
    ],
    category: "social-engineering"
  },
  {
    title: "Suspicious Email Attachment",
    description: "You receive an email with an unexpected attachment from a colleague.",
    situation: "You receive an email from a colleague with the subject 'Important Document - Please Review ASAP'. The email says 'Hi, please review this document and let me know your thoughts. Thanks!' with an attachment named 'Document.pdf.exe'. The email address looks correct, but you weren't expecting any document from this colleague. What should you do?",
    choices: [
      {
        text: "Open the attachment since it's from a colleague",
        isCorrect: false,
        feedback: "This is very dangerous! The '.exe' extension indicates an executable file, not a PDF. This is likely malware disguised as a document."
      },
      {
        text: "Contact your colleague through a different method to verify they sent it",
        isCorrect: true,
        feedback: "Correct! Always verify unexpected attachments through alternative communication channels. The '.exe' extension is a major red flag."
      },
      {
        text: "Save the attachment to scan it with antivirus first",
        isCorrect: false,
        feedback: "While scanning is good practice, the '.exe' extension makes this clearly malicious. It's better to verify with the sender first."
      },
      {
        text: "Reply asking what the document is about",
        isCorrect: false,
        feedback: "If the colleague's email is compromised, replying won't help. It's better to contact them through a different communication method."
      }
    ],
    category: "malware"
  }
];

async function seedDatabase() {
  try {
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@cyberguard.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@cyberguard.com',
        password: 'admin123', // This will be hashed automatically
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created: admin@cyberguard.com / admin123');
    }

    // Clear existing data
    await Question.deleteMany({});
    await Scenario.deleteMany({});
    
    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log('Sample questions inserted successfully');
    
    // Insert sample scenarios
    await Scenario.insertMany(sampleScenarios);
    console.log('Sample scenarios inserted successfully');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase };