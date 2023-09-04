# Versa Mail

This emailing package is a Node.js library that simplifies sending emails using either Nodemailer or Azure Communication Services. It provides easy-to-use functions to send single or bulk emails with customizable templates and attachments.

## Installation

To use the Emailer package in your Node.js project, you can install it via npm:

```bash
npm install versa-mail
```

## Usage

### Creating a Mailer Instance

The Emailer package allows you to create a mailer instance based on the mailer type you want to use. The mailer factory class provides a convenient method for this purpose.

```javascript
const MailerFactory = require("versa-mail");

// Configuration for Nodemailer mailer
const nodemailerConfig = {
  emailService: "your_email_service_provider",
  emailUsername: "your_email_username",
  emailPassword: "your_email_password",
  senderAddress: "your_sender_email@example.com",
};

// Configuration for Azure mailer
const azureConfig = {
  connectionString: "your_azure_connection_string",
  senderAddress: "your_sender_email@example.com",
};

// Create the mailer instance based on the selected type
const mailerType = "nodemailer"; // Use "nodemailer" for Nodemailer or "azure" for Azure Email Service
const mailerFactory = new MailerFactory();
const mailer = mailerFactory.createMailer(mailerType, nodemailerConfig);
// OR
const mailer = mailerFactory.createMailer("azure", azureConfig);
```

### Sending a Single Email

You can send a single email using the `sendEmail` method. The method allows you to use custom or default email templates, replace template variables, and include attachments.

```javascript
const emailOptions = {
  withDefaultTemplate: true, // Set to false if using a custom template
  templateName: "template_name", // Required if withDefaultTemplate is true
  template: "<html><body>Hello, #{username}!</body></html>", // Required if withDefaultTemplate is false
  constants: {
    username: "John Doe", // Replace #{username} in the template with this value
  },
  subject: "Test Email",
  email: "recipient@example.com",
  replyTo: "reply@example.com", // Optional
  cc: ["cc_recipient1@example.com", "cc_recipient2@example.com"], // Optional
  bcc: ["bcc_recipient1@example.com", "bcc_recipient2@example.com"], // Optional
  attachments: [
    {
      name: "attachment.txt",
      url: "path.to.attachment.",
    },
  ], // Optional
};

mailer
  .sendEmail(emailOptions)
  .then((response) => {
    // Email sent successfully
    console.log("Email sent successfully:", response);
  })
  .catch((error) => {
    // Error sending email
    console.error("Error sending email:", error);
  });

OR;

try {
  const sendMail = await mailer.sendEmail(emailOptions);
  console.log("Email sent successfully:", sendMail);
} catch (err) {
  console.error("Error sending email:", err);
}
```

### Sending Bulk Emails

If you need to send bulk emails, you can use the `sendBulk` method. This method allows you to customize each email for individual recipients and include common attachments for all emails.

```javascript
const bulkEmailOptions = {
  withDefaultTemplate: true, // Set to false if using a custom template
  templateName: "template_name", // Required if withDefaultTemplate is true
  template: "<html><body>Hello, #{username}!</body></html>", // Required if withDefaultTemplate is false
  constants: {
    // Common constants for all emails
    company: "Your Company",
    website: "https://example.com",
  },
  subject: "Test Email",
  users: [
    {
      //An object of user specific constants to replace placeholders within the html. User specific Attachments can be handled seperately.
      email: "recipient1@example.com",
      username: "Recipient 1",
      attachments: [
        {
          name: "attachment1.txt",
          url: "path/to/attachment1.txt",
        },
      ], // Optional
    },
    {
      email: "recipient2@example.com",
      username: "Recipient 2",
      // Add more user-specific options here
    },
  ],
  cc: ["cc_recipient@example.com"], // Optional
  bcc: ["bcc_recipient@example.com"], // Optional
  attachments: [
    {
      name: "common_attachment.txt",
      url: "path/to/common_attachment.txt", //should a valid CDN link
    },
  ], // Optional
};

mailer
  .sendBulk(bulkEmailOptions)
  .then((response) => {
    // Bulk emails sent successfully
    console.log("Bulk emails sent:", response);
  })
  .catch((error) => {
    // Error sending bulk emails
    console.error("Error sending bulk emails:", error);
  });
```

## CSS Configurations (Applicable for AzureMailer Only)

If you are using the `AzureMailer`, you have the option to customize email templates with CSS configurations. The following CSS configurations are available:

- USER_DEFINED_BODY_CSS: CSS styles for the email body.
- USER_DEFINED_CONTAINER_CSS: CSS styles for the email container.
- USER_DEFINED_H1_CSS: CSS styles for the h1 element.

To set CSS configurations, provide an object with these properties when creating the `AzureMailer` instance.

```javascript
const cssConfigurations = {
  USER_DEFINED_BODY_CSS: "body { background-color: #f0f0f0; }",
  USER_DEFINED_CONTAINER_CSS: ".container { padding: 20px; }",
  USER_DEFINED_H1_CSS: "h1 { color: #0080ff; }",
};

const mailer = new AzureMailer(
  connectionString,
  senderAddress,
  cssConfigurations
);
```

## Additional Notes

- Ensure you have valid credentials and connection strings for your email service or Azure Communication Services.
- The `email` and `username` fields in the email options are mandatory and must be valid strings.
- The package automatically handles the conversion of attachment URLs to base64 encoded strings before sending emails.

Feel free to reach out to us if you encounter any issues or have questions about using the Emailer package! Happy emailing!
