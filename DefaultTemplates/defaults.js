/* eslint-disable max-len */
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
  passwordReset: `<!DOCTYPE html>
<html lang=\"en\">

<head>
    <meta charset=\"UTF-8\" />
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap\" rel=\"stylesheet\">
    <title>Password Reset</title>
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
        <h1>Password Reset</h1>
        <p>Hello #{username},</p>
        <p>We have received a request to reset your password. Please click the button below to reset your password:</p>
        <a class=\"button\" href=\"#{resetLink}\">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,</p>
        <p>#{sender}</p>
    </div>
</body>

</html>`,
  orderConfirmation: `<!DOCTYPE html>
<html lang=\"en\">

<head>
    <meta charset=\"UTF-8\" />
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap\" rel=\"stylesheet\">
    <title>Order Confirmation</title>
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
        <h1>Order Confirmation</h1>
        <p>Dear #{username},</p>
        <p>Thank you for your order. Your order with order ID #{orderID} has been confirmed and is being processed.</p>
        <p>We will notify you once your order is shipped. If you have any questions or concerns, please feel free to contact our customer support.</p>
        <p>Best regards,</p>
        <p>#{sender}</p>
    </div>
</body>

</html>`,
  newsletterSubscription: `<!DOCTYPE html>
<html lang=\"en\">

<head>
    <meta charset=\"UTF-8\" />
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap\" rel=\"stylesheet\">
    <title>Newsletter Subscription Confirmation</title>
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
        <h1>Newsletter Subscription Confirmation</h1>
        <p>Dear #{username},</p>
        <p>Thank you for subscribing to our newsletter. You will now receive the latest updates, news, and special offers from us.</p>
        <p>If you have any questions or wish to unsubscribe, you can do so by clicking the link below.</p>
        <a class=\"button\" href=\"#{unsubscribeLink}\">Unsubscribe</a>
        <p>Best regards,</p>
        <p>#{sender}</p>
    </div>
</body>

</html>`,
};
