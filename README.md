# 🔐 TOTP Educational Demo

A comprehensive, educational implementation of Time-based One-Time Password (TOTP) algorithm following RFC 6238 specification. This demo provides step-by-step visualization of how TOTP works, making it perfect for learning and understanding the cryptographic principles behind 2FA systems.

## 🎯 Purpose

This implementation demonstrates:
- **Complete TOTP Algorithm**: RFC 6238 compliant implementation
- **Educational Clarity**: Step-by-step algorithm breakdown with real-time visualization
- **Security Best Practices**: Proper secret generation, replay protection, and clock drift tolerance
- **Practical Implementation**: Full enrollment and verification flows

## 🏗️ Architecture

### Core Components

1. **TOTPGenerator Class**: RFC 6238 compliant TOTP implementation
   - Cryptographically secure secret generation
   - Base32 encoding/decoding
   - HMAC-SHA256 computation using Web Crypto API
   - Dynamic truncation algorithm
   - Time-based counter calculation

2. **StorageManager Class**: localStorage wrapper for persistence
   - Secret storage with metadata
   - Used code tracking for replay protection
   - Automatic cleanup of expired codes

3. **Educational UI**: Three-page interactive demo
   - **Enrollment**: Secret generation and QR code creation using qrcodejs library <mcreference link="https://davidshimjs.github.io/qrcodejs/" index="0">0</mcreference>
   - **Authenticator**: Real-time TOTP generation with algorithm visualization
   - **Verification**: Code validation with security features demonstration

## 🚀 Getting Started

### Prerequisites
- Modern web browser with Web Crypto API support
- No server setup required - runs entirely in browser

### Dependencies
- **qrcodejs**: QR code generation library by davidshimjs <mcreference link="https://davidshimjs.github.io/qrcodejs/" index="0">0</mcreference>
  - Loaded via CDN: `https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js`
  - Cross-browser compatible with HTML5 Canvas
  - No additional dependencies required

### Usage

1. **Open the Demo**:
   ```bash
   open totp-demo.html
   ```
   Or simply double-click the HTML file

2. **Follow the Three-Step Process**:
   - **Step 1**: Generate a secret and QR code (Enrollment)
   - **Step 2**: Watch real-time TOTP generation (Authenticator)
   - **Step 3**: Verify codes with security features (Verification)

## 📚 Educational Features

### Algorithm Visualization

The demo shows each step of the TOTP algorithm in real-time:

1. **Time Counter Calculation**:
   ```
   T = floor(Unix_time / time_step)
   T = floor(1640995200 / 30) = 54699840
   ```

2. **HMAC-SHA256 Computation**:
   ```javascript
   HMAC = HMAC-SHA256(secret, counter_as_8_bytes)
   Result: cc93cf18508d94934c64804e014f5af4a6300a37
   ```

3. **Dynamic Truncation**:
   ```
   Offset = last_nibble = 0x7 = 7
   Extract 4 bytes starting at offset 7
   Truncated: 0x6300a37 = 103810615
   ```

4. **Final OTP Generation**:
   ```
   OTP = truncated_value mod 10^6
   OTP = 103810615 mod 1000000 = 810615
   ```

### Security Demonstrations

- **Clock Drift Tolerance**: Shows T-1, T, T+1 time windows
- **Replay Protection**: Tracks and rejects used codes
- **Proper Secret Handling**: Cryptographically secure generation
- **Base32 Encoding**: Human-readable secret representation

## 🔧 Technical Implementation

### TOTP Algorithm (RFC 6238)

```javascript
// Time counter calculation
const counter = Math.floor(timestamp / 30);

// HMAC-SHA256 computation
const hmac = await crypto.subtle.sign('HMAC', key, counterBytes);

// Dynamic truncation
const offset = hmac[hmac.length - 1] & 0x0f;
const code = ((hmac[offset] & 0x7f) << 24) | 
             ((hmac[offset + 1] & 0xff) << 16) |
             ((hmac[offset + 2] & 0xff) << 8) |
             (hmac[offset + 3] & 0xff);

// Generate 6-digit OTP
const otp = (code % 1000000).toString().padStart(6, '0');
```

### Security Features

1. **Cryptographically Secure Random Generation**:
   ```javascript
   const secret = new Uint8Array(20);
   crypto.getRandomValues(secret);
   ```

2. **Replay Attack Prevention**:
   ```javascript
   // Track used codes with timestamps
   const usedCodes = StorageManager.getUsedCodes();
   if (usedCodes.some(item => item.code === inputCode)) {
       return false; // Reject used code
   }
   ```

3. **Clock Drift Tolerance**:
   ```javascript
   // Check T-1, T, T+1 time windows
   for (let offset = -1; offset <= 1; offset++) {
       const timestamp = now + (offset * 30);
       const result = await generateTOTP(secret, timestamp);
       if (result.otp === inputCode) return true;
   }
   ```

## 🧪 Testing

The implementation includes comprehensive tests:

1. **Load Test Script**:
   ```html
   <script src="test-totp.js"></script>
   ```

2. **Run Tests in Browser Console**:
   ```javascript
   runAllTests();
   ```

3. **Test Coverage**:
   - Secret generation and Base32 encoding
   - Time counter calculation
   - HMAC computation
   - Dynamic truncation
   - OTPAuth URL generation
   - RFC 6238 test vectors
   - Storage functionality

## 📖 TOTP Fundamentals Reference

Based on the specifications in `docs/TOTP_FUNDAMENTAL.txt`:

### Core Algorithm
1. **T = floor(current Unix time / time-step)** (default step = 30s)
2. **MAC = HMAC-SHA-256/512(secret, T)**
3. **Dynamic Truncation (DT) → 31-bit unsigned integer**
4. **OTP = integer mod 10^digits** (zero-padded to 6–8 digits)

### Security Properties
- ✅ Secret never travels after enrollment
- ✅ Codes are short-lived (30s) and single-use
- ✅ Works offline on device
- ✅ Clock drift tolerance (±1 step)
- ✅ Replay protection

## 🔒 Security Considerations

### Production Recommendations
1. **Use HTTPS**: Always serve over TLS in production
2. **Rate Limiting**: Implement verification endpoint rate limiting
3. **Secure Storage**: Hash secrets at rest on server
4. **Algorithm Choice**: Using SHA-256 for enhanced security
5. **Backup Codes**: Provide recovery mechanisms

### Demo Limitations
- Uses localStorage (not suitable for production)
- Client-side only (real systems need server validation)
- Educational focus over production hardening

## 📁 File Structure

```
totp-example/
├── totp-demo.html          # Main demo application
├── test-totp.js            # Comprehensive test suite
├── README.md               # This documentation
└── docs/
    └── TOTP_FUNDAMENTAL.txt # TOTP specification reference
```

## 🎓 Learning Outcomes

After using this demo, you will understand:

1. **Cryptographic Principles**:
   - HMAC-based authentication
   - Time-based synchronization
   - Dynamic truncation algorithm

2. **Security Mechanisms**:
   - Replay attack prevention
   - Clock drift tolerance
   - Proper secret generation

3. **Implementation Details**:
   - Base32 encoding for human readability
   - QR code generation for mobile apps
   - Web Crypto API usage

4. **Real-world Applications**:
   - 2FA system design
   - Mobile authenticator apps
   - Enterprise security systems

## 🤝 Contributing

This is an educational demo. Suggestions for improvements:
- Additional algorithm visualizations
- More comprehensive test vectors
- Alternative hash algorithm demonstrations
- Mobile-responsive enhancements

## 📜 License

Educational use. Based on RFC 6238 public specification.

## 🔗 References

- [RFC 6238 - TOTP: Time-Based One-Time Password Algorithm](https://tools.ietf.org/html/rfc6238)
- [RFC 4226 - HOTP: An HMAC-Based One-Time Password Algorithm](https://tools.ietf.org/html/rfc4226)
- [RFC 4648 - Base32 Encoding](https://tools.ietf.org/html/rfc4648)
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**🎯 Perfect for**: Security education, cryptography learning, 2FA implementation understanding, and TOTP algorithm demonstration.