/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */

const {
  welcome,
  passwordReset,
  orderConfirmation,
  newsletterSubscription,
} = require("../DefaultTemplates/defaults");

// const chai = require("chai");
// const assert = require("chai").assert;
const expect = require("chai").expect;
// const sinon = require("sinon");

describe("Template Compilation", () => {
  it("should compile the welcome template without errors", () => {
    const data = {
      platform: "My Platform",
      username: "John Doe",
      body: "Welcome to our community! We are excited to have you on board.",
      sender: "Community Team",
    };

    function compileTemplate() {
      const compiledTemplate = welcome.replace(
        /#\{(.*?)\}/g,
        (match, placeholder) => data[placeholder]
      );
      return compiledTemplate;
    }

    expect(compileTemplate).not.throw();
    const compiledTemplate = compileTemplate();
    expect(compiledTemplate).contain("Welcome to My Platform ❤️");
    expect(compiledTemplate).contain("Hi John Doe,");
    expect(compiledTemplate).contain(
      "Welcome to our community! We are excited to have you on board."
    );
    expect(compiledTemplate).contain("Best regards,");
    expect(compiledTemplate).contain("Community Team");
  });

  it("should compile the passwordReset template without errors", () => {
    const data = {
      resetLink: "Reset link",
      sender: "Community Team",
      username: "John Doe",
    };

    function compileTemplate() {
      const compiledTemplate = passwordReset.replace(
        /#\{(.*?)\}/g,
        (match, placeholder) => data[placeholder]
      );
      return compiledTemplate;
    }

    // Check if the template compiles without throwing any errors
    expect(compileTemplate).not.throw();
    const compiledTemplate = compileTemplate();
    expect(compiledTemplate).contain("Reset link");
    expect(compiledTemplate).contain("Community Team");
    expect(compiledTemplate).contain("Community Team");
  });

  it("should compile the orderConfirmation template without errors", () => {
    const data = {
      orderID: "HGJKN567656",
      username: "John Doe",
      sender: "John Sam",
    };

    function compileTemplate() {
      const compiledTemplate = orderConfirmation.replace(
        /#\{(.*?)\}/g,
        (match, placeholder) => data[placeholder]
      );
      return compiledTemplate;
    }

    expect(compileTemplate).not.throw();
    const compiledTemplate = compileTemplate();
    expect(compiledTemplate).contain("HGJKN567656");
    expect(compiledTemplate).contain("John Doe");
    expect(compiledTemplate).contain("John Sam");
  });

  it("should compile the newsletterSubscription template without errors", () => {
    const data = {
      unsubscribeLink: "unsubscribe.com",
      username: "John Doe",
      sender: "John Sam",
    };

    function compileTemplate() {
      const compiledTemplate = newsletterSubscription.replace(
        /#\{(.*?)\}/g,
        (match, placeholder) => data[placeholder]
      );
      return compiledTemplate;
    }

    expect(compileTemplate).not.throw();
    const compiledTemplate = compileTemplate();
    expect(compiledTemplate).contain("unsubscribe.com");
    expect(compiledTemplate).contain("John Doe");
    expect(compiledTemplate).contain("John Sam");
  });
});
