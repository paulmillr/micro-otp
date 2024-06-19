# micro-otp

> [!WARNING]  
> The repository has been merged into [micro-key-producer](https://github.com/paulmillr/micro-key-producer). Please head to the new repo for updates.

    npm install micro-key-producer

---

One Time Password generation via [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238).


```ts
import * as otp from 'micro-otp';

otp.hotp(otp.parse('ZYTYYE5FOAGW5ML7LRWUL4WTZLNJAMZS'), 0n);
// 549419
otp.totp(otp.parse('ZYTYYE5FOAGW5ML7LRWUL4WTZLNJAMZS'), 0);
// 549419
```

## License

MIT (c) Paul Miller [(https://paulmillr.com)](https://paulmillr.com), see LICENSE file.
