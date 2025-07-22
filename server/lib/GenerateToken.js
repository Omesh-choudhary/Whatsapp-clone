import crypto from "crypto"

export default function generateZegoToken(appID, userID, serverSecret, effectiveTimeInSeconds = 3600) {
  const ctime = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const expire = ctime + effectiveTimeInSeconds;
  const nonce = Math.floor(Math.random() * 99999);

  const payload = {
    app_id: appID,
    user_id: userID,
    nonce,
    ctime,
    expire,
  };

  const message = `${appID}${userID}${nonce}${ctime}${expire}`;
  const signature = crypto
    .createHmac('sha256', serverSecret)
    .update(message)
    .digest('hex');

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

  return `${signature}.${base64Payload}`;
}
