### About
An effective tool to create a strong and unique password for each service.

### Philosophy
ISAAC cipher has strong avalanche effects on password generation. Every unknown tiny change of its initial state can cause unpredictable output, therefore it is resistant to brute force attack and pre-calculated attack, and hasn't be proven any vulnerabilities for more than 30 years. IsaacHash re-implements ISAAC, and its philosophy is to be a secure, logless, lightweight and cross-platform password manager.

- Highly customizable

In `hash.js`, you are encouraged to customiza your secret 256-bit salt.
```
seed(isaac.state, binaryStringToArray(decompose(yourSalt)));
```




