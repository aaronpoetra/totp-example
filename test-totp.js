// Test script for TOTP implementation
// Run this in browser console to validate functionality

// Test the TOTP implementation
async function testTOTPImplementation() {
    console.log('🧪 Testing TOTP Implementation...');
    
    // Create TOTP instance
    const totp = new TOTPGenerator();
    
    // Test 1: Secret generation
    console.log('\n1. Testing secret generation...');
    const secret = totp.generateSecret();
    console.log('✅ Secret generated:', secret.length, 'bytes');
    console.log('   Hex:', Array.from(secret).map(b => b.toString(16).padStart(2, '0')).join(''));
    
    // Test 2: Base32 encoding/decoding
    console.log('\n2. Testing Base32 encoding/decoding...');
    const base32 = totp.base32Encode(secret);
    console.log('✅ Base32 encoded:', base32);
    
    const decoded = totp.base32Decode(base32);
    const isEqual = Array.from(secret).every((byte, i) => byte === decoded[i]);
    console.log('✅ Base32 decode matches original:', isEqual);
    
    // Test 3: Time counter calculation
    console.log('\n3. Testing time counter...');
    const now = Math.floor(Date.now() / 1000);
    const counter = totp.getTimeCounter(now);
    console.log('✅ Current timestamp:', now);
    console.log('✅ Time counter (T):', counter);
    console.log('✅ Expected:', Math.floor(now / 30));
    
    // Test 4: TOTP generation
    console.log('\n4. Testing TOTP generation...');
    const result = await totp.generateTOTP(secret, now);
    console.log('✅ Generated TOTP:', result.otp);
    console.log('   Counter:', result.counter);
    console.log('   HMAC (hex):', result.hmac);
    console.log('   Truncated value:', result.truncatedValue);
    
    // Test 5: Consistency check (same input should produce same output)
    console.log('\n5. Testing consistency...');
    const result2 = await totp.generateTOTP(secret, now);
    console.log('✅ Consistency check:', result.otp === result2.otp ? 'PASS' : 'FAIL');
    
    // Test 6: Time window tolerance
    console.log('\n6. Testing time windows...');
    const prevResult = await totp.generateTOTP(secret, now - 30);
    const nextResult = await totp.generateTOTP(secret, now + 30);
    console.log('✅ Previous window (T-1):', prevResult.otp);
    console.log('✅ Current window (T):', result.otp);
    console.log('✅ Next window (T+1):', nextResult.otp);
    
    // Test 7: OTPAuth URL generation
    console.log('\n7. Testing OTPAuth URL...');
    const url = totp.generateOTPAuthURL(secret, 'test@example.com', 'Test Service');
    console.log('✅ OTPAuth URL:', url);
    console.log('   Contains secret:', url.includes('secret='));
    console.log('   Contains issuer:', url.includes('issuer=Test%20Service'));
    
    // Test 8: RFC 6238 test vector (if available)
    console.log('\n8. Testing with RFC 6238 test vector...');
    // Test vector: secret="12345678901234567890" (ASCII), time=59, expected=287082
    const testSecret = new TextEncoder().encode('12345678901234567890');
    const testResult = await totp.generateTOTP(testSecret, 59);
    console.log('✅ RFC test vector result:', testResult.otp);
    console.log('   Expected: 287082, Got:', testResult.otp);
    console.log('   Test vector match:', testResult.otp === '287082' ? 'PASS' : 'FAIL');
    
    console.log('\n🎉 TOTP Implementation Test Complete!');
    return {
        secretGeneration: true,
        base32Encoding: isEqual,
        timeCounter: counter === Math.floor(now / 30),
        totpGeneration: result.otp.length === 6,
        consistency: result.otp === result2.otp,
        urlGeneration: url.includes('otpauth://totp/'),
        rfcTestVector: testResult.otp === '287082'
    };
}

// Test storage functionality
function testStorageManager() {
    console.log('\n🗄️ Testing Storage Manager...');
    
    // Clear any existing data
    localStorage.removeItem('totp_secret');
    localStorage.removeItem('totp_used_codes');
    
    // Test secret storage
    const testSecret = new Uint8Array([1, 2, 3, 4, 5]);
    StorageManager.saveSecret('test@example.com', testSecret, 'Test Service');
    
    const retrieved = StorageManager.getSecret();
    console.log('✅ Secret storage test:', retrieved ? 'PASS' : 'FAIL');
    console.log('   Account:', retrieved?.account);
    console.log('   Issuer:', retrieved?.issuer);
    
    // Test used codes storage
    StorageManager.saveUsedCode('123456', Date.now());
    StorageManager.saveUsedCode('789012', Date.now());
    
    const usedCodes = StorageManager.getUsedCodes();
    console.log('✅ Used codes storage:', usedCodes.length === 2 ? 'PASS' : 'FAIL');
    console.log('   Stored codes:', usedCodes.map(c => c.code));
    
    // Test cleanup
    StorageManager.clearUsedCodes();
    const clearedCodes = StorageManager.getUsedCodes();
    console.log('✅ Used codes cleanup:', clearedCodes.length === 0 ? 'PASS' : 'FAIL');
    
    console.log('\n🎉 Storage Manager Test Complete!');
}

// Run all tests
async function runAllTests() {
    try {
        const totpResults = await testTOTPImplementation();
        testStorageManager();
        
        console.log('\n📊 Test Summary:');
        Object.entries(totpResults).forEach(([test, result]) => {
            console.log(`   ${test}: ${result ? '✅ PASS' : '❌ FAIL'}`);
        });
        
        const allPassed = Object.values(totpResults).every(r => r);
        console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'}`);
        
    } catch (error) {
        console.error('❌ Test execution failed:', error);
    }
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
    console.log('🚀 TOTP Test Suite Ready!');
    console.log('Run runAllTests() to execute all tests');
    
    // Uncomment to auto-run tests
    // runAllTests();
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testTOTPImplementation, testStorageManager, runAllTests };
}