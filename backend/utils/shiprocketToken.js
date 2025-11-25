const axios = require('axios');

let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
    const now = Date.now();

    if (shiprocketToken && tokenExpiry && now < tokenExpiry) {
        console.log("Using cached Shiprocket token");
        return shiprocketToken;
    }

    // Generate new token
    const authResponse = await axios.post(
        'https://apiv2.shiprocket.in/v1/external/auth/login',
        { email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }
    );

    shiprocketToken = authResponse.data.token;
    tokenExpiry = now + 24 * 60 * 60 * 1000; // 24 hours

    console.log("Generated new Shiprocket token");
    return shiprocketToken;
}

module.exports = { getShiprocketToken };