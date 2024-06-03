# micro-otp

One Time Password generation via [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238).

## Switch to [micro-key-producer](https://github.com/paulmillr/micro-key-producer)

The package has been integrated into micro-key-producer. It is now deprecated.

---

```ts
import * as otp from 'micro-otp';

otp.hotp(otp.parse('ZYTYYE5FOAGW5ML7LRWUL4WTZLNJAMZS'), 0n);
// 549419
otp.totp(otp.parse('ZYTYYE5FOAGW5ML7LRWUL4WTZLNJAMZS'), 0);
// 549419
```

## License

MIT (c) Paul Miller [(https://paulmillr.com)](https://paulmillr.com), see LICENSE file.
