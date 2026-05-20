const axios = require("axios");

const sendEmail = async (to, subject, html) => {
    try {
        const response = await axios.post(
            "https://expert-tribble-6j95g54v9jvfxvg7-8080.app.github.dev/mail",
            {
                to,
                subject,
                html,
            }
        );

        return response.data;
    } catch (error) {
        console.log(error.response?.data || error.message);
    }
};

module.exports = sendEmail;