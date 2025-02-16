// A utility function to perform bit operations on a 32-bit integer
function ub4(x) {
    // Ensure the value stays within the 32-bit range
    x = x % (Math.pow(2, 32));
    // Perform a bitwise unsigned right shift of all bits of x, equivalent to Math.floor(x / 2^32)
    return (x + 0.0) >>> 0;
}


// Define the functions outside the class, operating on a state object

function mix(state) {
    // Update the state variables based on the mixing rules
    state.a ^= ub4(state.b << 11);
    state.d = ub4(state.d + state.a);
    state.b = ub4(state.b + state.c);

    state.b ^= ub4(state.c >> 2);
    state.e = ub4(state.e + state.b);
    state.c = ub4(state.c + state.d);

    state.c ^= ub4(state.d << 8);
    state.f = ub4(state.f + state.c);
    state.d = ub4(state.d + state.e);

    state.d ^= ub4(state.e >> 16);
    state.g = ub4(state.g + state.d);
    state.e = ub4(state.e + state.f);

    state.e ^= ub4(state.f << 10);
    state.h = ub4(state.h + state.e);
    state.f = ub4(state.f + state.g);

    state.f ^= ub4(state.g >> 4);
    state.a = ub4(state.a + state.f);
    state.g = ub4(state.g + state.h);

    state.g ^= ub4(state.h << 8);
    state.b = ub4(state.b + state.g);
    state.h = ub4(state.h + state.a);

    state.h ^= ub4(state.a >> 9);
    state.c = ub4(state.c + state.h);
    state.a = ub4(state.a + state.b);
}


function isaac(state) {
    // Increment the counter and update the accumulators
    state.cc = ub4(state.cc + 1);
    state.bb = ub4(state.bb + state.cc);

    // Iterate over the random state array and update it
    for (let i = 0; i < 256; i++) {
        let x = state.mm[i];
        // Select which bit operation to apply based on the index
        switch (i % 4) {
            case 0:
                state.aa ^= ub4(state.aa << 13);
                break;
            case 1:
                state.aa ^= ub4(state.aa >> 6);
                break;
            case 2:
                state.aa ^= ub4(state.aa << 2);
                break;
            case 3:
                state.aa ^= ub4(state.aa >> 16);
                break;
        }
        // Update the accumulator
        state.aa = ub4(state.aa + state.mm[ub4(i + 128) % 256]);
        // Perform a 32-bit mixing step on the current element of the random state array
        state.mm[i] = ub4(state.aa + state.bb + state.mm[ub4(x >> 2) % 256]);
        state.rsl[i] = ub4(x + state.mm[ub4(state.mm[i] >> 10) % 256]); // Fixed the typo: state.mm[]
    }
}

function randinit(state) {
    // The initial seed for the PRNG
    state.a = 0x9e3779b9;
    state.b = 0x9e3779b9;
    state.c = 0x9e3779b9;
    state.d = 0x9e3779b9;
    state.e = 0x9e3779b9;
    state.f = 0x9e3779b9;
    state.g = 0x9e3779b9;
    state.h = 0x9e3779b9;

    // Perform four iterations of the PRNG mixing step
    for (let i = 0; i < 4; i++) {
        mix(state); // Corrected:  Pass the state object
    }

    // Populate the random state array with 256 random values
    for (let i = 0; i < 256; i += 8) {
        state.a = ub4(state.a + state.rsl[i]);
        state.b = ub4(state.b + state.rsl[i + 1]);
        state.c = ub4(state.c + state.rsl[i + 2]);
        state.d = ub4(state.d + state.rsl[i + 3]);
        state.e = ub4(state.e + state.rsl[i + 4]);
        state.f = ub4(state.f + state.rsl[i + 5]);
        state.g = ub4(state.g + state.rsl[i + 6]);
        state.h = ub4(state.h + state.rsl[i + 7]);

        mix(state); // Corrected: Pass the state object

        state.mm[i] = state.a;
        state.mm[i + 1] = state.b;
        state.mm[i + 2] = state.c;
        state.mm[i + 3] = state.d;
        state.mm[i + 4] = state.e;
        state.mm[i + 5] = state.f;
        state.mm[i + 6] = state.g;
        state.mm[i + 7] = state.h;
    }

    // Perform another four iterations of the PRNG mixing step
    for (let i = 0; i < 256; i += 8) {
        state.a = ub4(state.a + state.mm[i]);
        state.b = ub4(state.b + state.mm[i + 1]);
        state.c = ub4(state.c + state.mm[i + 2]);
        state.d = ub4(state.d + state.mm[i + 3]);
        state.e = ub4(state.e + state.mm[i + 4]);
        state.f = ub4(state.f + state.mm[i + 5]);
        state.g = ub4(state.g + state.mm[i + 6]);
        state.h = ub4(state.h + state.mm[i + 7]);

        mix(state);  // Corrected: Pass the state object

        state.mm[i] = state.a;
        state.mm[i + 1] = state.b;
        state.mm[i + 2] = state.c;
        state.mm[i + 3] = state.d;
        state.mm[i + 4] = state.e;
        state.mm[i + 5] = state.f;
        state.mm[i + 6] = state.g;
        state.mm[i + 7] = state.h;
    }

    // Finalize the random state
    isaac(state); // Corrected: Pass the state object
}

function initialize(state) {
    // Initialize the internal state variables
    state.ccount = 0;
    state.rsl = new Array(256); // The random state array (256 elements)
    state.mm = new Array(256); // The mixing state array (256 elements)
    state.aa = 0; // The first accumulator (32 bits)
    state.bb = 0; // The second accumulator (32 bits)
    state.cc = 0; // The counter for the second phase (32 bits)

    // Reset all state variables to 0
    for (let i = 0; i < 256; i++) {
        state.rsl[i] = 0;
        state.mm[i] = 0;
    }
    // Initialize the random number generator (PRNG) with random values
    randinit(state); // Corrected: Pass the state object
}


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

// The ISAAC (Incorporating a Universal Algorithm for Random Number Generation) PRNG class
class ISAAC {

    constructor() {
        // Create the state object
        this.state = {};
        initialize(this.state); // initialize the state
    }


    rand() {
        // Check if the random state needs to be refreshed
        if (this.state.ccount === 0) {
            // Refresh the random state by running the ISAAC algorithm
            isaac(this.state);
            // Reset the counter
            this.state.ccount = 256;
        }
        // Return the next random number
        return this.state.rsl[--this.state.ccount];
    }
}


// Function to create a simple hash based on the input string
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

// Function to decompose a string into a binary string
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

// Function to convert a binary string to an array
function binaryStringToArray(binaryString) {
    return binaryString.split('').map(char => parseInt(char, 10));
}
