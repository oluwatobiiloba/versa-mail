/* eslint-disable require-jsdoc */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */

// const chai = require("chai");
// const assert = require("chai").assert;
const expect = require("chai").expect;
// const sinon = require("sinon");

const { welcome } = require("../DefaultTemplates/defaults");

describe("Template Styling", () => {
  it("should render the HTML template without User CSS", () => {
    const cssConfigurations = {
      USER_DEFINED_BODY_CSS: "font-size: 16px; color: #333;",
      USER_DEFINED_CONTAINER_CSS: "background-color: white;",
      USER_DEFINED_H1_CSS: "color: #ff0000; font-size: 24px;",
    };

    function compileStyleTemplate() {
      const compiledTemplate = welcome.replace(
        /\/\* @(.*?) \*\//g,
        (match, placeholder) =>
          cssConfigurations[placeholder] || defaultCSS[placeholder]
      );
      return compiledTemplate;
    }

    // Check if the template compiles without throwing any errors
    expect(compileStyleTemplate).not.throw();
    const compiledTemplate = compileStyleTemplate();

    expect(compiledTemplate).contain("font-size: 16px; color: #333;");
    expect(compiledTemplate).contain("background-color: white;");
    expect(compiledTemplate).contain("color: #ff0000; font-size: 24px;");
  });
});
