/* eslint-disable object-curly-spacing */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable quotes */
const nodemailer = require("nodemailer");
const defaultTemplate = require("../DefaultTemplates/defaults");
const defaultCSS = require("../DefaultCSS/default");

// NodeMailer class
class NodeMailer {
  /**
   * Constructor for NodeMailer class.
   * Initializes the email service settings and transporter.
   *
   * @param {string} emailService - The email service provider name.
   * @param {string} emailUsername - The email service username.
   * @param {string} emailPassword - The email service password.
   * @param {string} senderAddress - The sender's email address.
   * @param {object} transporter - Optional custom Nodemailer transporter.
   * @param {Object} [cssConfigurations={}] - Optional CSS configurations for customizing email templates.
   */
  constructor(
    emailService,
    emailUsername,
    emailPassword,
    senderAddress,
    transporter,
    cssConfigurations = {}
  ) {
    // Validate email service and credentials
    if (!emailService || typeof emailService !== "string") {
      throw new Error("Invalid or missing email service provided");
    }
    if (!emailUsername || typeof emailUsername !== "string") {
      throw new Error("Invalid or missing email username provided");
    }
    if (!emailPassword || typeof emailPassword !== "string") {
      throw new Error("Invalid or missing email password service provided");
    }
    if (!senderAddress || typeof senderAddress !== "string") {
      throw new Error(
        "Invalid or missing 'senderAddress'. Please provide a valid sender's email address."
      );
    }

    // Validate and set custom transporter
    if (
      transporter &&
      (typeof transporter !== "object" ||
        transporter === null ||
        typeof transporter.sendMail !== "function")
    ) {
      throw new Error("Invalid Nodemailer Transporter");
    }

    // Set CSS configurations and sender's email address
    this.cssConfigurations = cssConfigurations;
    this.senderAddress = senderAddress;

    // Create the Nodemailer transporter with provided service credentials
    this.transporter =
      transporter ||
      nodemailer.createTransport({
        service: emailService,
        auth: {
          user: emailUsername,
          pass: emailPassword,
        },
      });
  }

  /**
   * Send an email using Nodemailer.
   *
   * @param {Object} options - The options object for sending the email.
   * @param {boolean} options.withDefaultTemplate - Flag to indicate whether to use the default template or custom template.
   * @param {string} [options.templateName] - The name of the default template to use if `withDefaultTemplate` is true.
   * @param {Object} [options.template] - The custom email template to use if `withDefaultTemplate` is false.
   * @param {Object} options.constants - An object containing key-value pairs for template variable replacement.
   * @param {string} options.subject - The subject of the email.
   * @param {string} options.email - The recipient's email address.
   * @param {string} options.replyTo - The reply-to email address (optional).
   * @param {string} options.message - The plain text version of the email content (optional).
   * @param {string[]} [options.cc] - An array of email addresses for CC recipients (optional).
   * @param {string[]} [options.bcc] - An array of email addresses for BCC recipients (optional).
   * @param {Object[]} [options.attachments] - An array of attachment objects (optional).
   * @param {string} options.attachments[].name - The name of the attachment.
   * @param {string} options.attachments[].url - The URL or path to the attachment file.
   */
  async sendEmail(options) {
    const template = options.withDefaultTemplate
      ? defaultTemplate[options.templateName]
      : options.template;

    let content = template.toString();

    Object.keys(options.constants).forEach((key) => {
      content = content.split(`\#{${key}}`).join(options.constants[key]);
    });

    for (const [placeholder, css] of Object.entries(this.cssConfigurations)) {
      const placeholderRegex = new RegExp(`\\/\\* @${placeholder} \\*\\/`, "g");
      content = content.replace(
        placeholderRegex,
        css || defaultCSS[placeholder]
      );
    }

    if (options.attachments && !Array.isArray(options.attachments)) {
      throw new Error("Invalid 'attachments'. It should be an array.");
    }

    const mailOptions = {
      from: this.senderAddress,
      to: options.email,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.message,
      html: content,
      attachments: options.attachments
        ? options.attachments.map((attachment) => ({
            filename: attachment.name || "attachment",
            path: attachment.url,
          }))
        : undefined,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
      return { response: "Email sent successfully" };
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  /**
   * Send bulk emails using Nodemailer.
   *
   * @param {Object} options - The options object for sending bulk emails.
   * @param {boolean} options.withDefaultTemplate - Flag to indicate whether to use the default template or custom template.
   * @param {string} [options.templateName] - The name of the default template to use if `withDefaultTemplate` is true.
   * @param {Object} [options.template] - The custom email template to use if `withDefaultTemplate` is false.
   * @param {Object} options.constants - An object containing key-value pairs for template variable replacement.
   * @param {string} options.subject - The subject of the email.
   * @param {Object[]} options.users - An array of user-specific email options.
   * @param {string} options.users[].email - The recipient's email address.
   * @param {string} options.users[].username - The recipient's username.
   * @param {string} options.users[].message - The user-specific plain text content of the email (optional).
   * @param {string} options.users[].replyTo - The reply-to email address for the user (optional).
   * @param {Object[]} options.users[].attachments - An array of attachment objects for the user (optional).
   * @param {string} options.users[].attachments[].name - The name of the attachment.
   * @param {string} options.users[].attachments[].url - The URL or path to the attachment file.
   * @param {string[]} [options.cc] - An array of email addresses for CC recipients (optional).
   * @param {string[]} [options.bcc] - An array of email addresses for BCC recipients (optional).
   * @param {Object[]} [options.attachments] - An array of general attachment objects to include in all emails (optional).
   * @param {string} options.attachments[].name - The name of the attachment.
   * @param {string} options.attachments[].url - The URL or path to the attachment file.
   * @return {Promise<Object|null>}  A promise containing the status and failed email addresses.
   */

  async sendBulk(options) {
    try {
      if (!options.subject || typeof options.subject !== "string") {
        throw new Error(
          "Invalid or missing 'subject'. Please provide a valid subject."
        );
      }

      if (
        !options.users ||
        !Array.isArray(options.users) ||
        options.users.length === 0
      ) {
        throw new Error("Invalid 'users'. It should be a non-empty array.");
      }

      const template = options.withDefaultTemplate
        ? defaultTemplate[options.templateName]
        : options.template;

      let content = template;

      for (const [placeholder, css] of Object.entries(this.cssConfigurations)) {
        const placeholderRegex = new RegExp(
          `\\/\\* @${placeholder} \\*\\/`,
          "g"
        );
        content = content.replace(
          placeholderRegex,
          css || defaultCSS[placeholder]
        );
      }

      if (options.attachments && !Array.isArray(options.attachments)) {
        throw new Error("Invalid 'attachments'. It should be an array.");
      }

      const allAttachments = options.attachments
        ? options.attachments.map((attachment) => ({
            filename: attachment.name || "attachment",
            path: attachment.url,
          }))
        : [];

      const failedEmails = []; // Array to store the email addresses of failed emails

      for (const user of options.users) {
        const constants = { ...user, ...options.constants };
        let userContent = content;
        for (const [key, value] of Object.entries(constants)) {
          const keyRegex = new RegExp(`\#{${key}}`, "g");
          userContent = userContent.replace(keyRegex, value);
        }

        const userAttachments = user.attachments
          ? user.attachments.map((attachment) => ({
              filename: attachment.name || "attachment",
              path: attachment.url,
            }))
          : [];

        const attachments = [...allAttachments, ...userAttachments];
        const mailOptions = {
          from: this.senderAddress,
          to: user.email,
          replyTo: user.replyTo,
          subject: options.subject,
          text: user.message,
          html: userContent,
          attachments: attachments.length > 0 ? attachments : undefined,
        };

        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log(`Email sent to ${user.email}: ${info.response}`);
        } catch (error) {
          console.error("Error sending email:", error);
          failedEmails.push(user.email);
        }
      }

      if (failedEmails.length > 0) {
        console.error(
          "Failed to send emails to the following recipients:",
          failedEmails
        );
      }

      return {
        status: "Emails queued for sending",
        failedEmails: failedEmails,
      };
    } catch (e) {
      // console.error("Sending Error:", e.message);
      return {
        status: `Sending Error: ${e.message}`,
      };
      // throw new Error(`Sending Error: ${e.message}`);
    }
  }
}

module.exports = NodeMailer;
