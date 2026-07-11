function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

function getOtpHtml(otp) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #1976D2; /* Google Blue */
            color: white;
        }
        .content {
            padding: 20px 0;
            text-align: center;
        }
        .otp-box {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #333;
            margin: 20px 0;
            display: inline-block;
            padding: 10px 20px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>One-Time Password (OTP)</h1>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            <p>You requested to verify your email address. Please use the code below to complete the verification process.</p>
            
            <div class="otp-box">
                ${otp}
            </div>
            
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not initiate this request, please ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>Thank you,<br>Your Company/Service</p>
        </div>
    </div>
</body>
</html>
    `
}


export { generateOtp, getOtpHtml }