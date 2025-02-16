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
As above,
`password = hash(masterKey + hash(slaveKey))`.

- How is `hash` designed

```
function simpleHash(input) {
    const binaryString = decompose(input);
    // Convert the binary string to an array
    const binaryArray = binaryStringToArray(binaryString);
    // Create an instance of the ISAAC PRNG
    const isaac = new ISAAC();
    // Seed the PRNG with yourSalt
    seed(isaac.state, binaryStringToArray(decompose('yourSalt')));
    // Seed the PRNG with the input key
    seed(isaac.state, binaryArray);
    // Generate a hash by taking five 4-byte integers and converting them to hexadecimal
    let hash = '';
    for (let i = 0; i < 5; i++) {
        const randNum = isaac.rand();
        const hexRandNum = randNum.toString(16).padStart(8, '0');
        hash += hexRandNum;
    }
    return hash; // `hash` is a 160-bit hexadecimal
}
```
As above, when you enter a key string, each character will be transformed into unicode, and be decomposed into 21-bit binary string with `decompose`. Then those binary strings will be combined together into one.

`seed` will change the internal state of ISAAC with `mix` or `isaac`, dependent on each bit consecutively.
```
function decompose(str) {
    let binaryString = '';
    // Iterate over the characters in the string
    for (let i = 0; i < str.length; i++) {
        let unicodeValue = str.charCodeAt(i);
        // Convert the Unicode value to a binary string and pad it to 21 bits
        let binaryValue = unicodeValue.toString(2).padStart(21, '0');
        // Append the binary value to the binary string
        binaryString += binaryValue;
    }
    return binaryString;
}
```
```
function seed(state, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            // If the value is 0, perform one iteration of the PRNG mixing step
            mix(state); // Corrected: Pass the state object
        } else {
            // Otherwise, refresh the random state
            isaac(state); // Corrected: Pass the state object
        }
    }
}
```
```
// Function to convert a binary string to an array
function binaryStringToArray(binaryString) {
    return binaryString.split('').map(char => parseInt(char, 10));
}
```

- References
[1]. [Code of ISAAC](https://burtleburtle.net/bob//c/readable.c)
[2]. [ISAAC's theory written by the author](https://burtleburtle.net/bob/rand/isaac.html)
[3]. [Rosetta Code](https://rosettacode.org/wiki/The_ISAAC_cipher)
[4]. [Wikipedia](https://en.wikipedia.org/wiki/ISAAC_(cipher))















