const fs = require('fs');
const assert = require('assert');

console.log('Loading student.json...');
const testCases = JSON.parse(fs.readFileSync('student.json', 'utf8'));

let passed = 0;
let failed = 0;

testCases.forEach((data, index) => {
    console.log(`\n--- Running Test Case ${index + 1}: ${data.testCase} ---`);
    
    // Form field validations based on HTML parameters
    const isUsernameValid = typeof data.username === 'string' && data.username.trim().length > 0;
    const isEmailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email);
    const isPhoneValid = typeof data.phone === 'string' && data.phone.length === 10 && /^\d+$/.test(data.phone);
    const validBranches = ['CSE', 'CSE(AI)'];
    const isBranchValid = validBranches.includes(data.branch);
    const isPasswordValid = typeof data.password === 'string' && data.password.trim().length > 0;

    const actualValidity = isUsernameValid && isEmailValid && isPhoneValid && isBranchValid && isPasswordValid;

    console.log(`Input -> User: '${data.username}', Email: '${data.email}', Phone: '${data.phone}', Branch: '${data.branch}'`);
    console.log(`Expected Valid: ${data.expectedValid} | Calculated Valid: ${actualValidity}`);

    try {
        assert.strictEqual(actualValidity, data.expectedValid, `Test Case Failed: '${data.testCase}'`);
        console.log('✅ Result: PASS');
        passed++;
    } catch (err) {
        console.error('❌ Result: FAIL ->', err.message);
        failed++;
    }
});

console.log(`\n====================================`);
console.log(`Summary: ${passed} Passed, ${failed} Failed out of ${testCases.length} tests.`);
console.log(`====================================`);

if (failed > 0) {
    process.exit(1); // Fails the Jenkins pipeline execution
}