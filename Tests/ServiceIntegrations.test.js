/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */

const { expect } = require("chai");
const proxyquire = require("proxyquire");

const NodeMailer = proxyquire("../Mailers/NodeMailer", {
  nodemailer: {
    createTransport: () => ({
      sendMail: () => {
        return {
          response: "Email sent successfully",
        };
      },
    }),
  },
});

describe("NodeMailer", () => {
  it("should throw an error if email service is not provided", () => {
    expect(() => new NodeMailer()).to.throw(
      "Invalid or missing email service provided"
    );
  });

  it("should throw an error if email username is not provided", () => {
    expect(() => new NodeMailer("gmail", null, null, null)).to.throw(
      "Invalid or missing email username provided"
    );
  });

  it("should throw an error if email password is not provided", () => {
    expect(() => new NodeMailer("gmail", "username", null, null)).to.throw(
      "Invalid or missing email password service provided"
    );
  });

  it("should throw an error if sender address is not provided", () => {
    expect(
      () => new NodeMailer("gmail", "username", "password", null)
    ).to.throw(
      "Invalid or missing 'senderAddress'. Please provide a valid sender's email address."
    );
  });

  it("should throw an error if invalid transport is provided", () => {
    expect(
      () => new NodeMailer("gmail", "username", "password", "null", "null")
    ).to.throw("Invalid Nodemailer Transporter");
  });

  it("should send an email successfully", async () => {
    const cssConfigurations = {
      USER_DEFINED_BODY_CSS: "font-size: 16px; color: #333;",
      USER_DEFINED_CONTAINER_CSS: "background-color: white;",
      USER_DEFINED_H1_CSS: "color: #ff0000; font-size: 24px;",
    };
    const mailer = new NodeMailer(
      "gmail",
      "username",
      "password",
      "sender@example.com",
      null,
      cssConfigurations
    );
    const result = await mailer.sendEmail({
      withDefaultTemplate: true,
      templateName: "welcome",
      constants: {
        name: "John Doe",
      },
      subject: "Test email",
      email: "receiver@example.com",
    });

    expect(result.response).to.equal("Email sent successfully");
  });

  it("should throw an error if subject is not provided", async () => {
    const mailer = new NodeMailer(
      "gmail",
      "username",
      "password",
      "sender@example.com"
    );

    const result = await mailer.sendBulk({
      users: [
        {
          email: "receiver@example.com",
        },
      ],
    });

    expect(result.status).to.equal(
      "Sending Error: Invalid or missing 'subject'. Please provide a valid subject."
    );
  });

  it("should throw an error if users is not an array", async () => {
    const mailer = new NodeMailer(
      "gmail",
      "username",
      "password",
      "sender@example.com"
    );

    const result = await mailer.sendBulk({
      subject: "Test email",
      users: "receiver@example.com",
    });

    expect(result.status).to.equal(
      "Sending Error: Invalid 'users'. It should be a non-empty array."
    );
  });

  it("should send emails to all users successfully", async () => {
    const mailer = new NodeMailer(
      "gmail",
      "username",
      "password",
      "sender@example.com"
    );
    const users = [
      {
        email: "receiver1@example.com",
      },
      {
        email: "receiver2@example.com",
      },
    ];
    const result = await mailer.sendBulk({
      subject: "Test email",
      withDefaultTemplate: true,
      templateName: "welcome",
      users,
    });

    expect(result.status).to.equal("Emails queued for sending");
    expect(result.failedEmails).to.be.empty;
  });

  it("should log failed emails if any", async () => {
    const cssConfigurations = {
      USER_DEFINED_BODY_CSS: "font-size: 16px; color: #333;",
      USER_DEFINED_CONTAINER_CSS: "background-color: white;",
      USER_DEFINED_H1_CSS: "color: #ff0000; font-size: 24px;",
    };
    const mailer = new NodeMailer(
      "gmail",
      "username",
      "password",
      "sender@example.com",
      null,
      cssConfigurations
    );
    const users = [
      {
        email: "receiver1@example.com",
      },
      {
        email: "receiver2@example.com",
      },
      {
        user: "receiver3@example.com",
      },
    ];
    const result = await mailer.sendBulk({
      withDefaultTemplate: true,
      templateName: "welcome",
      subject: "Test email",
      users,
    });

    expect(result.status).to.equal("Emails queued for sending");
    expect(result.failedEmails).to.be.empty;
  });
});
