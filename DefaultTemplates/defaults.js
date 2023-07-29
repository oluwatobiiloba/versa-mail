module.exports = {
  welcome: `<!DOCTYPE html>
<html lang=\"en\">

<head>
    <meta charset=\"UTF-8\" />
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap\" rel=\"stylesheet\">
    <title>Welcome to our Community</title>
    <style>
        /* Email CSS styles */
        body {
            /* @USER_DEFINED_BODY_CSS */
            font-family: 'Montserrat', sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            /* @USER_DEFINED_CONTAINER_CSS */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
        }

        h1 {
            /* @USER_DEFINED_H1_CSS */
            color: #000;
            font-size: 18px;
            width:100%;
        }

        p {
            font-size: 16px;
            width:100%;
        }

        .button {
            width: 150px;
            background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
            color: #ffffff;
            padding: 16px 16px;
            text-decoration: none;
            text-align: center;
            border-radius: 8px;
            font-size: 18px;
            margin-top: 32px;
            font-size: larger;
            font-weight: bolder;
        }

        .note {
            font-size: 14px;
            margin-top: 24px;
            text-align: center;
            color: #888;
        }
    </style>
</head>

<body>
    <div class=\"container\">
        <h1>Welcome to #{platform} ❤️</h1>
        <p>Hi #{username},</p>
        <p>#{body}</p>
        <p>Best regards,</p>
        <p>#{sender} </p>
    </div>
</body>

</html>`,
};
