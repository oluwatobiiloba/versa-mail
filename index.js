/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable valid-jsdoc */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable quotes */
// Import required modules
const AzureMailer = require("./Mailers/AzureMailer");
const NodeMailer = require("./Mailers/NodeMailer");

// Define the MailerFactory class
class MailerFactory {
  /**
   * Create a mailer based on the provided type.
   *
   * @param {string} type - The type of mailer to create. Valid options are "azure" or "nodemailer".
   * @param {Object} options - The options object containing configuration details for the mailer.
   * @param {Object} cssConfigurations - Optional CSS configurations for customizing email templates (applicable only for AzureMailer).
   * @returns {AzureMailer | NodeMailer} The mailer instance based on the provided type.
   * @throws {Error} If an invalid mailing type is provided.
   */
  createMailer(type, options, cssConfigurations) {
    try {
      if (type === "azure") {
        const { connectionString, senderAddress } = options;
        return new AzureMailer(
          connectionString,
          senderAddress,
          cssConfigurations
        );
      } else if (type === "nodemailer") {
        const {
          emailService,
          emailUsername,
          emailPassword,
          senderAddress,
          transporter,
        } = options;

        return new NodeMailer(
          emailService,
          emailUsername,
          emailPassword,
          senderAddress,
          // eslint-disable-next-line comma-dangle
          transporter,
          cssConfigurations
        );
      } else {
        throw new Error("Invalid mailing type. Use 'azure' or 'nodemailer'.");
      }
    } catch (error) {
      throw error;
    }
  }
}

// Export the MailerFactory class
module.exports = MailerFactory;
