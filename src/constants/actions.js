export const OtpForHtml = (otpcode) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - BroadEngage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #1B1C52;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            background-color: #f9f9f9;
        }
        .content h2 {
            margin-top: 0;
            font-size: 22px;
            color: #1B1C52;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 15px 0;
        }
        .otp {
            font-size: 28px;
            letter-spacing: 3px;
            margin: 20px 0;
            padding: 15px 30px;
            background-color: #e6e6e6;
            border: 2px dashed #1B1C52;
            border-radius: 8px;
            display: inline-block;
            color: #1B1C52;
        }
        .footer {
            background-color: #1B1C52;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 14px;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                border: none;
                border-radius: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WelCome To Starks world</h1>
        </div>
        <div class="content">
            <h2>Your OTP Code</h2>
            <p>Please use the following One Time Password (OTP) to complete your login process:</p>
            <div class="otp">${otpcode}</div>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;
  return html;
};

export const NodeMailerHost = {
  brevoHost: "smtp-relay.brevo.com",
  gmailHost: "gmail",
  resendHost: "smtp.resend.com"
};
