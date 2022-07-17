/*! micro-otp - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { base32 } from '@scure/base';
import { sha1 } from '@noble/hashes/sha1';
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { hmac } from '@noble/hashes/hmac';
import * as P from 'micro-packed';

export type Bytes = Uint8Array;

export type OTPOpts = { algorithm: string; digits: number; interval: number; secret: Bytes };
function parseSecret(secret: string) {
  return base32.decode(secret.padEnd(Math.ceil(secret.length / 8) * 8, '=').toUpperCase());
}

export function parse(otp: string): OTPOpts {
  const opts = { secret: new Uint8Array(), algorithm: 'sha1', digits: 6, interval: 30 };
  if (otp.startsWith('otpauth://totp/')) {
    const url = new URL(otp);
    if (url.protocol !== 'otpauth:' || url.host !== 'totp') throw new Error('OTP: wrong url');
    const params = url.searchParams;
    const digits = params.get('digits');
    if (digits) {
      opts.digits = +digits;
      if (!['6', '7', '8'].includes(digits))
        throw new Error(`OTP: url should include 6, 7 or 8 digits. Got: ${digits}`);
    }
    const algo = params.get('algorithm');
    if (algo) {
      if (!['sha1', 'sha256', 'sha512'].includes(algo.toLowerCase()))
        throw new Error(`OTP: url with wrong algorithm: ${algo}`);
      opts.algorithm = algo.toLowerCase();
    }
    const secret = params.get('secret');
    if (!secret) throw new Error('OTP: url without secret');
    opts.secret = parseSecret(secret);
  } else opts.secret = parseSecret(otp);
  return opts;
}

export function buildURL(opts: OTPOpts): string {
  return `otpauth://totp/?secret=${base32.encode(opts.secret).replace(/=/gm, '')}&interval=${
    opts.interval
  }&digits=${opts.digits}&algorithm=${opts.algorithm.toUpperCase()}`;
}

export function hotp(opts: OTPOpts, counter: number | bigint) {
  const hash = { sha1, sha256, sha512 }[opts.algorithm];
  if (!hash) throw new Error(`TOTP: unknown hash: ${opts.algorithm}`);
  const mac = hmac(hash, opts.secret, P.U64BE.encode(BigInt(counter)));
  const offset = mac[mac.length - 1] & 0x0f;
  const num = P.U32BE.decode(mac.slice(offset, offset + 4)) & 0x7fffffff;
  return num.toString().slice(-opts.digits).padStart(opts.digits, '0');
}

export function totp(opts: OTPOpts, ts = Date.now()) {
  return hotp(opts, Math.floor(ts / (opts.interval * 1000)));
}
