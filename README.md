### About
A hash function to effectively create a secure and unique password for each service.

### Philosophy

- Secure

[ISAAC](https://en.wikipedia.org/wiki/ISAAC_(cipher)) has very strong avalanche effects: every unknown tiny change of its initial state can cause unpredictable output, therefore it is resistant to brute force attack and pre-calculated attack, and hasn't be proven any vulnerabilities for more than 30 years. `IsaacHash` [implements ISAAC](https://burtleburtle.net/bob//c/readable.c).

- Customizable

In `hash.js`, you are encouraged to customiza your secret 256-bit salt. It mitigates the risks of password leakage either if you accidentally reveal your keys but not salt, or your keys are set as weak, ~~but you are not encouraged to have weak keys for security reasons.~~
```
seed(isaac.state, binaryStringToArray(decompose(yourSalt)));
```

- Lightweight

The size of this extension is about 30 kB.

- Logless

It doesn't use `localStorage` or produce any logs. ISAAC uses deterministic algorithm, so your password can be retrieved with correct keys whenever you wish.

- Cross-platform

It is an Chromium extension, and it workable on desktop devices or Android with `Kiwi Browser` or `Lemur Browser`.

### How it works
When you click on the icon of this extension, it shows a distraction-free tiny pop-up.
![image](https://github.com/user-attachments/assets/235e864a-25a7-461d-a10c-869156baaaf7)

There're two input bars. One is `Master_Key`, and another is `Slave_Key`.
For example, if you want to generate/retrieve your Facebook password, you should enter correct `masterKey` and `slaveKey` that align with your registration setup. Those keys can be either memorable or you can log them elsewhere physically or digitally secure.



### Theories

- How is each `password` determined

`hash` is a hash function that implements ISAAC.

```
function derivePassword(mainKey, siteKey) {
  const hashedSiteKey = simpleHash(siteKey);
  const combinedKey = hashedSiteKey + mainKey;
  return simpleHash(combinedKey);
}
```
As above mentioned,
`password = hash(masterKey + hash(slaveKey))`.

- How is `hash` designed










