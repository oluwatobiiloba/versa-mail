const { EmailClient } = require("@azure/communication-email");
const defaultTemplate = require("../DefaultTemplates/defaults");
const defaultCSS = require("../DefaultCSS/default");
const axios = require("axios");

/**
 * Represents an AzureMailer instance used for sending emails using Azure Communication Services.
 *
 * @class AzureMailer
 * @constructor
 * @param {string} connectionString - The connection string for Azure Communication Services.
 * @param {string} senderAddress - The sender's email address for outgoing emails.
 * @param {Object} [cssConfigurations={}] - Optional CSS configurations for customizing email templates.
 * @param {string} cssConfigurations.USER_DEFINED_BODY_CSS - CSS styles for the email body.
 * @param {string} cssConfigurations.USER_DEFINED_CONTAINER_CSS - CSS styles for the email container.
 * @param {string} cssConfigurations.USER_DEFINED_H1_CSS - CSS styles for the h1 element.
 */

class AzureMailer {
  constructor(connectionString, senderAddress, cssConfigurations = {}) {
    if (!connectionString || typeof connectionString !== "string") {
      throw new Error(
        "Invalid or missing 'connectionString'. Please provide a valid connection string."
      );
    }

    if (!senderAddress || typeof senderAddress !== "string") {
      throw new Error(
        "Invalid or missing 'senderAddress'. Please provide a valid sender's email address."
      );
    }

    this.emailClient = new EmailClient(connectionString);
    this.senderAddress = senderAddress;
    this.cssConfigurations = cssConfigurations;
  }

  /**
   * Sends an email using Azure Communication Services.
   *
   * @param {Object} options - The options object for sending the email.
   * @param {boolean} options.withDefaultTemplate - Flag to indicate whether to use the default template or custom template.
   * @param {string} [options.templateName] - The name of the default template to use if `withDefaultTemplate` is true.
   * @param {Object} [options.template] - The custom email template to use if `withDefaultTemplate` is false.
   * @param {Object} options.constants - An object containing key-value pairs for template variable replacement.
   * @param {string} options.subject - The subject of the email.
   * @param {string} options.email - The recipient's email address.
   * @param {string} options.username - The recipient's name or username.
   * @param {string[]} [options.cc] - An array of email addresses for CC recipients (optional).
   * @param {string[]} [options.bcc] - An array of email addresses for BCC recipients (optional).
   * @param {Object[]} [options.attachments] - An array of attachment objects (optional).
   * @param {string} options.attachments[].name - The name of the attachment.
   * @param {string} options.attachments[].contentType - The content type of the attachment.
   * @param {string} options.attachments[].url - The URL or content of the attachment.
   *
   * @returns {Promise<Object|null>} A promise that resolves to the response object if the email is sent successfully,
   *                                or null if there was an error.
   */

  async sendEmail(options) {
    try {
      const template = options.withDefaultTemplate
        ? defaultTemplate[options.templateName]
        : options.template;

      let content = template.toString();
      Object.keys(options.constants).forEach((key) => {
        content = content.split(`\#{${key}}`).join(options.constants[key]);
      });

      if (options.withDefaultTemplate) {
        for (const [placeholder, css] of Object.entries(
          this.cssConfigurations
        )) {
          const placeholderRegex = new RegExp(
            `\\/\\* @${placeholder} \\*\\/`,
            "g"
          );
          content = content.replace(
            placeholderRegex,
            css || defaultCSS[placeholder]
          );
        }
      }

      if (options.attachments && !Array.isArray(options.attachments)) {
        throw new Error("Invalid 'attachments'. It should be an array.");
      }

      const attachments = options.attachments
        ? await Promise.all(
            options.attachments.map(async (attachment) => {
              if (!attachment.url || typeof attachment.url !== "string") {
                throw new Error(
                  "Invalid attachment. 'url' is required and should be a string."
                );
              }
              return {
                name: attachment.name || "attachment",
                contentType:
                  attachment.contentType || "application/octet-stream",
                contentInBase64: await this._convertAttachment(attachment.url),
              };
            })
          )
        : null;

      const mailOptions = {
        senderAddress: this.senderAddress,
        content: {
          subject: options.subject,
          html: content,
        },
        recipients: {
          to: [
            {
              address: options.email,
              displayName: options.username,
            },
          ],
        },
        cc: options.cc,
        bcc: options.bcc,
        attachments: attachments,
      };

      const poller = await this.emailClient.beginSend(mailOptions);
      const response = await poller.pollUntilDone();
      if (response) {
        console.log(`Email sent to ${options.email}: ${response.id}`);
      }
      return response;
    } catch (e) {
      console.error("Error:", e.message);
      if (e.name === "RestError") {
        console.error("Azure Communication Services Error:", e.message);
      }
    }
    return null;
  }

  /**
   * Send bulk emails using Nodemailer
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
   * @returns {Object} An object containing the status and failed email addresses.
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

      let content = template.toString();

      if (options.withDefaultTemplate) {
        for (const [placeholder, css] of Object.entries(
          this.cssConfigurations
        )) {
          const placeholderRegex = new RegExp(
            `\\/\\* @${placeholder} \\*\\/`,
            "g"
          );
          content = content.replace(
            placeholderRegex,
            css || defaultCSS[placeholder]
          );
        }
      }

      if (options.attachments && !Array.isArray(options.attachments)) {
        throw new Error("Invalid 'attachments'. It should be an array.");
      }

      const generalAttachments = options.attachments
        ? await Promise.all(
            options.attachments.map(async (attachment) => {
              if (!attachment.url || typeof attachment.url !== "string") {
                throw new Error(
                  "Invalid attachment. 'url' is required and should be a string."
                );
              }
              return {
                name: attachment.name || "attachment",
                contentType:
                  attachment.contentType || "application/octet-stream",
                contentInBase64: await this._convertAttachment(attachment.url),
              };
            })
          )
        : null;

      const failedEmails = []; // Array to store the email addresses of failed emails

      const emails = options.users.map(async (user) => {
        const constants = { ...user, ...options.constants };
        let userContent = content;
        Object.keys(constants).forEach((key) => {
          userContent = userContent.split(`\#{${key}}`).join(constants[key]);
        });

        const userAttachments = user.attachments
          ? await Promise.all(
              user.attachments.map(async (attachment) => {
                if (!attachment.url || typeof attachment.url !== "string") {
                  throw new Error(
                    "Invalid attachment. 'url' is required and should be a string."
                  );
                }
                return {
                  name: attachment.name || "attachment",
                  contentType:
                    attachment.contentType || "application/octet-stream",
                  contentInBase64: await this._convertAttachment(
                    attachment.url
                  ),
                };
              })
            )
          : null;

        return {
          email: user.email,
          username: user.username,
          subject: options.subject,
          content: userContent,
          attachments: userAttachments
            ? generalAttachments
              ? [...generalAttachments, ...userAttachments]
              : userAttachments
            : generalAttachments,
        };
      });

      const resolvedEmails = await Promise.all(emails);

      for (const email of resolvedEmails) {
        const status = await this._sendSingle(email);
        if (status === null) {
          failedEmails.push(email.email);
        }
      }

      if (failedEmails.length > 0) {
        console.log(
          "Failed to send emails to the following recipients:",
          failedEmails
        );
      }

      return {
        status: "Emails queued for sending",
        failedEmails: failedEmails,
      };
    } catch (e) {
      console.error("Error:", e.message);
      if (e.name === "RestError") {
        console.error("Azure Communication Services Error:", e.message);
      }
      return null;
    }
  }

  /**
   * Send a single email using the email client.
   *
   * @private
   * @param {Object} options - The email options for sending a single email.
   * @param {string} options.subject - The subject of the email.
   * @param {string} options.email - The recipient's email address.
   * @param {string} options.username - The recipient's username (optional).
   * @param {string} options.content - The HTML content of the email.
   * @param {string[]} [options.cc] - An array of email addresses for CC recipients (optional).
   * @param {string[]} [options.bcc] - An array of email addresses for BCC recipients (optional).
   * @param {Object[]} [options.attachments] - An array of attachment objects (optional).
   * @param {string} options.attachments[].name - The name of the attachment.
   * @param {string} options.attachments[].url - The URL or path to the attachment file.
   * @returns {string|null} The message ID if the email was sent successfully, or null if it failed.
   */

  async _sendSingle(options) {
    const mailOptions = {
      senderAddress: this.senderAddress,
      content: {
        subject: options.subject,
        html: options.content,
      },
      recipients: {
        to: [
          {
            address: options.email,
            displayName: options.username,
          },
        ],
      },
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    const poller = await this.emailClient.beginSend(mailOptions);
    const response = await poller.pollUntilDone();
    if (response) {
      console.log(`Email sent to ${options.email}: ${response.id}`);
      return `Email sent to ${options.email}: ${response.id}`;
    }
    return null;
  }

  /**
   * Convert an attachment from its URL to a base64 encoded string.
   *
   * @private
   * @param {string} url - The URL of the attachment file to be converted.
   * @returns {string} The base64 encoded string representation of the attachment content.
   * @throws {Error} If there's an error converting the attachment, an error will be thrown.
   */
  async _convertAttachment(url) {
    try {
      const content = await axios.get(url, {
        responseType: "arraybuffer",
      });
      return Buffer.from(content.data).toString("base64");
    } catch (e) {
      console.error("Error converting attachment:", e.message);
      throw e;
    }
  }
}

module.exports = AzureMailer;
