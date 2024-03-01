const { client, authenticated, getCode } = require('../../../utilities/whatsapp-config');

function setAuthenticationResponse() {
  try {
    const authenticationResponse = {
      qr_code: getCode(),
      auth: authenticated(),
      success: true
    };
    return authenticationResponse;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

function logout() {
  try {
    client.logout();
    return true;
  } catch(err) {
    return false;
  }
}

module.exports = {
  setAuthenticationResponse,
  logout
};
