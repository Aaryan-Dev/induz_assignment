import {QRCodeCanvas} from 'qrcode.react';
import { useState } from 'react';
import { Buffer } from 'buffer';
import base32Decode from 'base32-decode';
const speakeasy = require('speakeasy');

// Generate a TOTP secret
const secret = speakeasy.generateSecret({ length: 20 });

console.log('Secret:', secret.base32);
console.log('QR Code URL:', secret.otpauth_url);

const onLogin = (token) => {
  const decodedSecret = Buffer.from(base32Decode(secret.base32, 'RFC4648'));

  const verified = speakeasy.totp.verify({
    secret: decodedSecret,
    encoding: 'base32',
    token: token, 
  });
  
  if (verified) {
    alert('Login successful');
  } else {
    alert('Invalid code');
}

}

export const QRCodeDisplay = ({email}) => {
  console.log('email', email)
 const otpauthUrl = `otpauth://totp/${encodeURIComponent('indiz')}:${encodeURIComponent(email)}?secret=${secret.base32}&issuer=${encodeURIComponent('induz')}`;

 return (
  <div>
    <h3>Scan this QR code with your authenticator app</h3>
    <QRCodeCanvas value={otpauthUrl} />
  </div>
 );
};


export const TOTPLogin = () => {
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
      onLogin(token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter TOTP code"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

