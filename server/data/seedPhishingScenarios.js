const { PhishingScenario } = require('../models/Game');

const samplePhishingScenarios = [
  {
    title: "Urgent Bank Account Verification",
    description: "You receive an email claiming to be from your bank asking for immediate account verification.",
    email: {
      from: {
        name: "Security Team",
        email: "security@bankk-alerts.com"
      },
      to: {
        name: "Valued Customer",
        email: "you@email.com"
      },
      subject: "URGENT: Your account will be suspended in 24 hours!",
      body: `Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be SUSPENDED within 24 hours unless you verify your information immediately.

Click here to verify your account: http://bank-verification.suspicious-site.com

If you do not verify within 24 hours, your account will be permanently closed and you will lose access to your funds.

Thank you for your immediate attention to this matter.

Security Team
First National Bank`
    },
    redFlags: [
      {
        type: "Suspicious sender email",
        description: "The email address 'bankk-alerts.com' has a double 'k' which is not the real bank domain",
        severity: "high"
      },
      {
        type: "Urgent language",
        description: "Creates false urgency with threats of account suspension",
        severity: "high"
      },
      {
        type: "Suspicious link",
        description: "The verification link goes to a suspicious domain, not the bank's official website",
        severity: "high"
      },
      {
        type: "Generic greeting",
        description: "Uses 'Valued Customer' instead of your actual name",
        severity: "medium"
      }
    ],
    isPhishing: true,
    explanation: "This is a classic phishing email. Banks never ask for account verification via email links. The suspicious domain, urgent language, and generic greeting are major red flags.",
    difficulty: "easy",
    category: "banking"
  },
  {
    title: "LinkedIn Connection Request",
    description: "You receive what appears to be a LinkedIn connection request from a colleague.",
    email: {
      from: {
        name: "LinkedIn",
        email: "invitations@linkedin.com"
      },
      to: {
        name: "Professional User",
        email: "you@company.com"
      },
      subject: "Sarah Johnson wants to connect with you on LinkedIn",
      body: `Hi there,

Sarah Johnson would like to connect with you on LinkedIn.

Sarah Johnson
Senior Marketing Manager at TechCorp Solutions

Accept Sarah's invitation:
https://www.linkedin.com/in/sarah-johnson-connect

You are receiving Invitation emails. Unsubscribe here.

© 2024 LinkedIn Corporation. All rights reserved.
LinkedIn and the LinkedIn logo are registered trademarks of LinkedIn.`
    },
    redFlags: [],
    isPhishing: false,
    explanation: "This appears to be a legitimate LinkedIn connection request. The email comes from the official LinkedIn domain, uses proper formatting, and the link goes to the real LinkedIn website.",
    difficulty: "medium",
    category: "social-media"
  },
  {
    title: "IT Support Password Reset",
    description: "You receive an email from your company's IT department about a mandatory password reset.",
    email: {
      from: {
        name: "IT Support",
        email: "it-support@yourcompany.com"
      },
      to: {
        name: "Employee",
        email: "you@yourcompany.com"
      },
      subject: "Mandatory Password Reset - Action Required",
      body: `Dear Employee,

Due to recent security updates, all employees must reset their passwords by end of day today.

Please click the link below to reset your password:
https://password-reset.yourcompany-secure.net/reset

Failure to reset your password will result in account lockout.

If you have any questions, please contact IT Support at extension 1234.

Best regards,
IT Support Team
Your Company Inc.`
    },
    redFlags: [
      {
        type: "Suspicious domain",
        description: "The reset link goes to 'yourcompany-secure.net' instead of the official company domain",
        severity: "high"
      },
      {
        type: "Urgent deadline",
        description: "Creates pressure with 'end of day' deadline and lockout threats",
        severity: "medium"
      },
      {
        type: "Generic greeting",
        description: "Uses 'Dear Employee' instead of your actual name",
        severity: "low"
      }
    ],
    isPhishing: true,
    explanation: "This is a phishing attempt. While it appears to come from IT, the password reset link goes to a suspicious domain. Legitimate IT departments use official company domains for password resets.",
    difficulty: "medium",
    category: "work"
  },
  {
    title: "Amazon Order Confirmation",
    description: "You receive an order confirmation for an expensive item you didn't purchase.",
    email: {
      from: {
        name: "Amazon",
        email: "auto-confirm@amazon.com"
      },
      to: {
        name: "Customer",
        email: "you@email.com"
      },
      subject: "Your Amazon order has been confirmed - $1,299.99",
      body: `Hello,

Your order has been confirmed and will be shipped soon.

Order Details:
- MacBook Pro 16-inch - $1,299.99
- Shipping Address: 123 Unknown Street, City, State
- Estimated Delivery: Tomorrow

If you did not place this order, please click here immediately to cancel:
http://amazon-security.verify-orders.com/cancel

Order #: AMZ-789456123

Thank you for shopping with Amazon!`
    },
    redFlags: [
      {
        type: "Suspicious cancellation link",
        description: "The cancellation link goes to 'amazon-security.verify-orders.com' which is not Amazon's official domain",
        severity: "high"
      },
      {
        type: "Unexpected purchase",
        description: "Claims you made an expensive purchase you didn't make, designed to cause panic",
        severity: "high"
      },
      {
        type: "Urgent action required",
        description: "Pressures you to click the link immediately to cancel the fake order",
        severity: "medium"
      }
    ],
    isPhishing: true,
    explanation: "This is a phishing scam that exploits fear of unauthorized purchases. The cancellation link leads to a fake site designed to steal your Amazon credentials. Always check your actual Amazon account directly.",
    difficulty: "easy",
    category: "shopping"
  },
  {
    title: "Microsoft Security Alert",
    description: "You receive a security alert claiming your Microsoft account has been compromised.",
    email: {
      from: {
        name: "Microsoft Security",
        email: "security-noreply@microsoft.com"
      },
      to: {
        name: "User",
        email: "you@email.com"
      },
      subject: "Microsoft Security Alert: Unusual sign-in activity",
      body: `Microsoft Security Alert

We detected unusual sign-in activity on your Microsoft account.

Location: Unknown location
Device: Unknown device
Time: Today at 3:47 AM

If this was you, you can safely ignore this email.

If this wasn't you, please secure your account immediately:
https://account.microsoft.com/security/signin-activity

We're here to help keep your account secure.

The Microsoft Account Team`
    },
    redFlags: [],
    isPhishing: false,
    explanation: "This appears to be a legitimate Microsoft security alert. It comes from an official Microsoft domain, provides specific details about the sign-in attempt, and links to the official Microsoft security page.",
    difficulty: "hard",
    category: "work"
  },
  {
    title: "Government Tax Refund",
    description: "You receive an email claiming you're eligible for a tax refund from the IRS.",
    email: {
      from: {
        name: "IRS Refund Department",
        email: "refunds@irs-gov.net"
      },
      to: {
        name: "Taxpayer",
        email: "you@email.com"
      },
      subject: "You are eligible for a $2,847 tax refund",
      body: `Dear Taxpayer,

After reviewing your tax records, we have determined that you are eligible for a tax refund of $2,847.00.

To claim your refund, please verify your information by clicking the link below:
https://irs-refund-portal.gov-services.org/claim

You must claim your refund within 72 hours or it will be forfeited.

Please have the following information ready:
- Social Security Number
- Bank Account Information
- Previous Year's Tax Return

Internal Revenue Service
Refund Processing Department`
    },
    redFlags: [
      {
        type: "Fake government domain",
        description: "Uses 'irs-gov.net' instead of the official 'irs.gov' domain",
        severity: "high"
      },
      {
        type: "Suspicious refund link",
        description: "The claim link goes to 'gov-services.org' which is not an official government domain",
        severity: "high"
      },
      {
        type: "Requests sensitive information",
        description: "Asks for SSN and bank account information via email",
        severity: "high"
      },
      {
        type: "Artificial deadline",
        description: "Creates false urgency with 72-hour deadline",
        severity: "medium"
      }
    ],
    isPhishing: true,
    explanation: "This is a government impersonation scam. The IRS never initiates contact via email about refunds. The fake domains and request for sensitive information are major red flags.",
    difficulty: "easy",
    category: "government"
  }
];

async function seedPhishingScenarios() {
  try {
    // Clear existing scenarios
    await PhishingScenario.deleteMany({});
    
    // Insert sample scenarios
    await PhishingScenario.insertMany(samplePhishingScenarios);
    console.log('Sample phishing scenarios seeded successfully!');
  } catch (error) {
    console.error('Error seeding phishing scenarios:', error);
  }
}

module.exports = { seedPhishingScenarios };