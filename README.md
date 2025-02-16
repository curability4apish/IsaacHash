### About
An effective tool to create a strong and unique password for each service.

### Philosophy
ISAAC cipher has strong avalanche effects on password generation. Every unknown tiny change of its initial state can cause unpredictable output, therefore it is resistant to brute force attack and pre-calculated attack, and hasn't be proven any vulnerabilities for more than 30 years. IsaacHash re-implements ISAAC, and its philosophy is to be a secure, logless, lightweight and cross-platform password manager.

- Secure

ISAAC cipher has strong avalanche effects on password generation. Every unknown tiny change of its initial state can cause unpredictable output, therefore it is resistant to brute force attack and pre-calculated attack, and hasn't be proven any vulnerabilities for more than 30 years. `IsaacHash` re-implements ISAAC.

- Customizable

In `hash.js`, you are encouraged to customiza your secret 256-bit salt. It mitigates the risks of password leakage either if you accidentally reveal your keys but not salt, or your keys are set as weak, ~~but you are not encouraged to have weak keys for security reasons.~~
```
seed(isaac.state, binaryStringToArray(decompose(yourSalt)));
```

- Lightweight

The size of this extension is about 30 kB.

- Logless

It doesn't use `localStorage` or produce any logs.








