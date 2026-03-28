import axios from 'axios';
import crypto from 'crypto';

const LENCO_BASE = 'https://sandbox.lenco.co/access/v2/';
const LENCO_TIMEOUT = 15000;

const getAuthHeader = () => {
  const rawKey = '993bed87f9d592566a6cce2cefd79363d1b7e95af3e1e6642b294ce5fc8c59f6';

  if (!rawKey || !rawKey.trim()) {
    console.error('[Lenco] LENCO_API_KEY is not set; requests will fail with 401');
    throw new Error('Lenco API key not configured (LENCO_API_KEY)');
  }

  const key = rawKey.trim();
  const header = key.startsWith('Bearer ') ? key : `Bearer ${key}`;

  // Log only a safe prefix (never the full key)
  console.log('[Lenco] Using API key prefix:', header.slice(0, 12) + '…');

  return header;
};

export const initiateCollectionMobileMoney = async (
  operator: string,
  bearer: 'merchant' | 'customer' = 'merchant',
  phone: string,
  amount: string | number,
  currency: string,
  reference: string
) => {
  const url = `${LENCO_BASE}/collections/mobile-money`;
  const body = {
    operator,
    bearer,
    phone,
    amount: String(amount),
    currency: String(currency).toUpperCase(),
    reference,
  };

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: getAuthHeader(),
  };

  try {
    const resp = await axios.post(url, body, { headers, timeout: LENCO_TIMEOUT });
    return resp.data;
  } catch (err: any) {
    const axiosResp = err && (err as any).response;

    if (axiosResp) {
      console.error('[Lenco] initiateCollectionMobileMoney failed:', {
        status: axiosResp.status,
        data: axiosResp.data,
      });
    } else {
      console.error('[Lenco] initiateCollectionMobileMoney unexpected error:', err?.message || err);
    }

    throw err;
  }
};

/**
 * Fetches Lenco's RSA public key in JWK format for encryption
 */
export const getLencoEncryptionKey = async () => {
  const url = `${LENCO_BASE}/encryption-key`;
  const headers = {
    accept: 'application/json',
    Authorization: getAuthHeader(),
  };

  try {
    const resp = await axios.get(url, { headers, timeout: LENCO_TIMEOUT });
    return resp.data;
  } catch (err: any) {
    const axiosResp = err && (err as any).response;

    if (axiosResp) {
      console.error('[Lenco] getLencoEncryptionKey failed:', {
        status: axiosResp.status,
        data: axiosResp.data,
      });
    } else {
      console.error('[Lenco] getLencoEncryptionKey unexpected error:', err?.message || err);
    }

    throw err;
  }
};

/**
 * Converts JWK public key to PEM format for Node crypto
 */
const jwkToPem = (jwk: any): string => {
  // Lenco returns an RSA public key in JWK format with 'n' (modulus) and 'e' (exponent)
  const n = Buffer.from(jwk.n, 'base64url');
  const e = Buffer.from(jwk.e, 'base64url');

  // For Node.js 15+ we can use crypto.createPublicKey with JWK
  // But for broader compatibility, we'll convert to PEM manually
  
  // Build the RSA public key in DER format following X.509 SubjectPublicKeyInfo
  const encodeLength = (len: number): Buffer => {
    if (len < 128) {
      return Buffer.from([len]);
    } else if (len < 256) {
      return Buffer.from([0x81, len]);
    } else {
      return Buffer.from([0x82, (len >> 8) & 0xff, len & 0xff]);
    }
  };

  const encodeInteger = (int: Buffer): Buffer => {
    // Prepend 0x00 if high bit is set (to keep it positive)
    if (int[0] & 0x80) {
      int = Buffer.concat([Buffer.from([0x00]), int]);
    }
    const lengthBytes = encodeLength(int.length);
    return Buffer.concat([Buffer.from([0x02]), lengthBytes, int]);
  };

  const encodedN = encodeInteger(n);
  const encodedE = encodeInteger(e);
  
  const sequence = Buffer.concat([encodedN, encodedE]);
  const sequenceLen = encodeLength(sequence.length);
  const innerSequence = Buffer.concat([Buffer.from([0x30]), sequenceLen, sequence]);
  
  // Wrap in BIT STRING
  const bitStringLen = encodeLength(innerSequence.length + 1);
  const bitString = Buffer.concat([
    Buffer.from([0x03]),
    bitStringLen,
    Buffer.from([0x00]), // no unused bits
    innerSequence
  ]);
  
  // RSA encryption algorithm identifier
  const algorithmId = Buffer.from([
    0x30, 0x0d, // SEQUENCE
    0x06, 0x09, // OBJECT IDENTIFIER
    0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, // rsaEncryption OID
    0x05, 0x00 // NULL
  ]);
  
  const publicKeyInfo = Buffer.concat([algorithmId, bitString]);
  const publicKeyLen = encodeLength(publicKeyInfo.length);
  const der = Buffer.concat([Buffer.from([0x30]), publicKeyLen, publicKeyInfo]);
  
  // Convert to PEM format
  const base64 = der.toString('base64');
  const pem = `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
  
  return pem;
};

/**
 * Encrypts card payload using Lenco's RSA public key
 */
export const encryptCardPayload = async (cardPayload: any): Promise<string> => {
  try {
    // Fetch Lenco's public encryption key
    const keyResponse = await getLencoEncryptionKey();
    
    if (!keyResponse?.data?.publicKey) {
      throw new Error('Invalid encryption key response from Lenco');
    }

    const jwk = keyResponse.data.publicKey;
    const publicKeyPem = jwkToPem(jwk);

    // Convert card payload to JSON string
    const payloadString = JSON.stringify(cardPayload);

    // Encrypt using RSA-OAEP (standard for card data encryption)
    const encryptedBuffer = crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(payloadString, 'utf8')
    );

    // Return base64-encoded encrypted payload
    return encryptedBuffer.toString('base64');
  } catch (err: any) {
    console.error('[Lenco] encryptCardPayload failed:', err?.message || err);
    throw err;
  }
};

export const initiateCollectionCard = async (encryptedPayload: string) => {
  const url = `${LENCO_BASE}/collections/card`;
  const body = { encryptedPayload };

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: getAuthHeader(),
  };

  try {
    const resp = await axios.post(url, body, { headers, timeout: LENCO_TIMEOUT });
    return resp.data;
  } catch (err: any) {
    const axiosResp = err && (err as any).response;

    if (axiosResp) {
      console.error('[Lenco] initiateCollectionCard failed:', {
        status: axiosResp.status,
        data: axiosResp.data,
      });
    } else {
      console.error('[Lenco] initiateCollectionCard unexpected error:', err?.message || err);
    }

    throw err;
  }
};

export default { 
  initiateCollectionMobileMoney, 
  initiateCollectionCard,
  encryptCardPayload,
  getLencoEncryptionKey,
};
