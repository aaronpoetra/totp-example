// Test script to verify Algorithm Breakdown section functionality
// This script tests if the initializeAlgorithmSteps function is called properly

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'totp-demo.html'), 'utf8');

// Create a DOM environment
const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
});

const { window } = dom;
const { document } = window;

// Mock localStorage for testing
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => JSON.stringify({
            account: 'test@example.com',
            secret: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
            issuer: 'Test App'
        })),
        setItem: jest.fn(),
        removeItem: jest.fn()
    },
    writable: true
});

// Test function
async function testAlgorithmBreakdown() {
    console.log('Testing Algorithm Breakdown section...');
    
    try {
        // Check if algorithmSteps div exists
        const algorithmSteps = document.getElementById('algorithmSteps');
        if (!algorithmSteps) {
            throw new Error('algorithmSteps div not found');
        }
        
        console.log('✓ algorithmSteps div found');
        
        // Check initial state (should be empty)
        console.log('Initial content:', algorithmSteps.innerHTML.length > 0 ? 'Has content' : 'Empty');
        
        // Simulate switching to authenticator tab
        if (typeof window.startAuthenticatorUpdates === 'function') {
            console.log('✓ startAuthenticatorUpdates function found');
            
            // Call the function
            await window.startAuthenticatorUpdates();
            
            // Check if content was added
            setTimeout(() => {
                const hasContent = algorithmSteps.innerHTML.length > 0;
                console.log('After startAuthenticatorUpdates:', hasContent ? 'Has content' : 'Still empty');
                
                if (hasContent) {
                    console.log('✅ SUCCESS: Algorithm Breakdown section is working!');
                    console.log('Content preview:', algorithmSteps.innerHTML.substring(0, 200) + '...');
                } else {
                    console.log('❌ FAILED: Algorithm Breakdown section is still empty');
                }
            }, 1000);
        } else {
            console.log('❌ startAuthenticatorUpdates function not found');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAlgorithmBreakdown();