# ioBroker Adapter Development with GitHub Copilot

**Version:** 0.4.0
**Template Source:** https://github.com/DrozmotiX/ioBroker-Copilot-Instructions

This file contains instructions and best practices for GitHub Copilot when working on ioBroker adapter development.

## Project Context

You are working on an ioBroker adapter. ioBroker is an integration platform for the Internet of Things, focused on building smart home and industrial IoT solutions. Adapters are plugins that connect ioBroker to external systems, devices, or services.

## Adapter-Specific Context
- **Adapter Name**: iobroker.fronius
- **Primary Function**: Fronius PV inverter integration with Datalogger Web (v2.0.4-1+), Datamanager (v3.0.3-1+), and Symo Gen24 support
- **Key Dependencies**: axios for HTTP API calls, he for HTML entity decoding
- **Configuration Requirements**: IP address, API version selection, polling intervals for real-time and archive data
- **Target Devices**: Fronius solar inverters with integrated data logging capabilities
- **API Integration**: RESTful API polling for solar production data, storage status, and power flow information
- **Data Types**: Real-time inverter data, historical archive data, device status, energy production metrics

## Testing

### Unit Testing
- Use Jest as the primary testing framework for ioBroker adapters
- Create tests for all adapter main functions and helper methods
- Test error handling scenarios and edge cases
- Mock external API calls and hardware dependencies
- For adapters connecting to APIs/devices not reachable by internet, provide example data files to allow testing of functionality without live connections
- Example test structure:
  ```javascript
  describe('AdapterName', () => {
    let adapter;
    
    beforeEach(() => {
      // Setup test adapter instance
    });
    
    test('should initialize correctly', () => {
      // Test adapter initialization
    });
  });
  ```

### Integration Testing

**IMPORTANT**: Use the official `@iobroker/testing` framework for all integration tests. This is the ONLY correct way to test ioBroker adapters.

**Official Documentation**: https://github.com/ioBroker/testing

#### Framework Structure
Integration tests MUST follow this exact pattern:

```javascript
const path = require('path');
const { tests } = require('@iobroker/testing');

// Define test coordinates or configuration
const TEST_COORDINATES = '52.520008,13.404954'; // Berlin
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Use tests.integration() with defineAdditionalTests
tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Test adapter with specific configuration', (getHarness) => {
            let harness;

            before(() => {
                harness = getHarness();
            });

            it('should configure and start adapter', function () {
                return new Promise(async (resolve, reject) => {
                    try {
                        harness = getHarness();
                        
                        // Get adapter object using promisified pattern
                        const obj = await new Promise((res, rej) => {
                            harness.objects.getObject('system.adapter.your-adapter.0', (err, o) => {
                                if (err) return rej(err);
                                res(o);
                            });
                        });
                        
                        if (!obj) {
                            return reject(new Error('Adapter object not found'));
                        }

                        // Configure adapter properties
                        Object.assign(obj.native, {
                            position: TEST_COORDINATES,
                            createCurrently: true,
                            createHourly: true,
                            createDaily: true,
                            // Add other configuration as needed
                        });

                        // Set the updated configuration
                        harness.objects.setObject(obj._id, obj);

                        console.log('✅ Step 1: Configuration written, starting adapter...');
                        
                        // Start adapter and wait
                        await harness.startAdapterAndWait();
                        
                        console.log('✅ Step 2: Adapter started');

                        // Wait for adapter to process data
                        const waitMs = 15000;
                        await wait(waitMs);

                        console.log('🔍 Step 3: Checking states after adapter run...');
                        
                        // Verify some basic states exist
                        const stateIds = ['info.connection'];
                        
                        for (const stateId of stateIds) {
                            const fullId = `${adapterShortName}.0.${stateId}`;
                            const state = await harness.states.getStateAsync(fullId);
                            
                            if (!state) {
                                console.log(`❌ Missing state: ${fullId}`);
                            } else {
                                console.log(`✅ Found state: ${fullId} = ${state.val}`);
                            }
                        }
                        
                        resolve();
                        
                    } catch (e) {
                        console.error('❌ Test failed with error:', e.message);
                        reject(e);
                    }
                });
            }).timeout(60000); // Allow sufficient time for slow APIs
        });
    }
});
```

#### Adapter-Specific Testing for Fronius

For the Fronius adapter, integration tests should cover:

```javascript
// Fronius-specific integration test example
tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Test Fronius adapter with mock configuration', (getHarness) => {
            let harness;

            before(() => {
                harness = getHarness();
            });

            it('should handle Fronius API configuration and mock data', async function() {
                // Mock Fronius inverter configuration
                const testConfig = {
                    ip: '192.168.1.100',
                    apiversion: '1',
                    baseurl: '/solar_api/v1/',
                    inverter: '1',
                    poll: '30',
                    pollarchive: '150',
                    requestType: 'http://'
                };

                const obj = await harness.objects.getObjectAsync('system.adapter.fronius.0');
                Object.assign(obj.native, testConfig);
                await harness.objects.setObjectAsync(obj._id, obj);

                // Test with test mode to avoid real API calls
                obj.native.testMode = true;
                await harness.objects.setObjectAsync(obj._id, obj);

                await harness.startAdapterAndWait();
                await new Promise(resolve => setTimeout(resolve, 15000));

                // Verify basic adapter functionality
                const connectionState = await harness.states.getStateAsync('fronius.0.info.connection');
                const lastSyncState = await harness.states.getStateAsync('fronius.0.info.lastsync');

                // In test mode, adapter should still create basic structure
                expect(connectionState).to.exist;
                expect(lastSyncState).to.exist;
            }).timeout(60000);
        });
    }
});
```

#### Testing Best Practices for Energy Adapters

- **Mock API Responses**: Use test mode or mock external inverter APIs
- **Timeout Handling**: Energy devices may have slow response times
- **Data Validation**: Test numeric ranges for power, voltage, current values
- **Connection States**: Verify proper connection status reporting
- **Historical Data**: Test archive data retrieval and processing
- **Error Recovery**: Test behavior when inverter is offline or unreachable

## Development Guidelines

### ioBroker Adapter Patterns
- Use `adapter.setState()` for setting state values with proper acknowledgment flags
- Implement `adapter.getState()` for reading current state values
- Use proper state roles: 'value.power', 'value.voltage', 'value.current' for energy data
- Create organized channel structure: `inverter.1.DC_POWER`, `storage.battery_level`
- Implement proper object definitions with units, min/max values for energy measurements

### Logging Best Practices
- Use appropriate log levels: `error`, `warn`, `info`, `debug`, `silly`
- Log API calls and responses at debug level: `adapter.log.debug('API Response: ' + JSON.stringify(data))`
- Log connection status changes at info level: `adapter.log.info('Connected to Fronius inverter')`
- Log configuration errors at error level: `adapter.log.error('Invalid IP address configuration')`

### Error Handling
- Implement try-catch blocks around all API calls
- Handle network timeouts gracefully with reconnection logic
- Set connection state to false on sustained errors
- Implement exponential backoff for API retry attempts
- Log meaningful error messages with context

### Resource Management
```javascript
// Proper cleanup in unload method
async unload(callback) {
  try {
    // Clear any running intervals
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.archiveInterval) {
      clearInterval(this.archiveInterval);
      this.archiveInterval = null;
    }
    
    // Clear any timeouts
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = undefined;
    }
    // Close connections, clean up resources
    callback();
  } catch (e) {
    callback();
  }
}
```

## Code Style and Standards

- Follow JavaScript/TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper resource cleanup in `unload()` method
- Use semantic versioning for adapter releases
- Include proper JSDoc comments for public methods

## CI/CD and Testing Integration

### GitHub Actions for API Testing
For adapters with external API dependencies, implement separate CI/CD jobs:

```yaml
# Tests API connectivity with demo credentials (runs separately)
demo-api-tests:
  if: contains(github.event.head_commit.message, '[skip ci]') == false
  
  runs-on: ubuntu-22.04
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run demo API tests
      run: npm run test:integration-demo
```

### CI/CD Best Practices
- Run credential tests separately from main test suite
- Use ubuntu-22.04 for consistency
- Don't make credential tests required for deployment
- Provide clear failure messages for API connectivity issues
- Use appropriate timeouts for external API calls (120+ seconds)

### Package.json Script Integration
Add dedicated script for credential testing:
```json
{
  "scripts": {
    "test:integration-demo": "mocha test/integration-demo --exit"
  }
}
```

### Practical Example: Complete API Testing Implementation
Here's a complete example based on lessons learned from the Discovergy adapter:

#### test/integration-demo.js
```javascript
const path = require("path");
const { tests } = require("@iobroker/testing");

// Helper function to encrypt password using ioBroker's encryption method
async function encryptPassword(harness, password) {
    const systemConfig = await harness.objects.getObjectAsync("system.config");
    
    if (!systemConfig || !systemConfig.native || !systemConfig.native.secret) {
        throw new Error("Could not retrieve system secret for password encryption");
    }
    
    const secret = systemConfig.native.secret;
    let result = '';
    for (let i = 0; i < password.length; ++i) {
        result += String.fromCharCode(secret[i % secret.length].charCodeAt(0) ^ password.charCodeAt(i));
    }
    
    return result;
}

// Run integration tests with demo credentials
tests.integration(path.join(__dirname, ".."), {
    defineAdditionalTests({ suite }) {
        suite("API Testing with Demo Credentials", (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it("Should connect to API and initialize with demo credentials", async () => {
                console.log("Setting up demo credentials...");
                
                if (harness.isAdapterRunning()) {
                    await harness.stopAdapter();
                }
                
                const encryptedPassword = await encryptPassword(harness, "demo_password");
                
                await harness.changeAdapterConfig("your-adapter", {
                    native: {
                        username: "demo@provider.com",
                        password: encryptedPassword,
                        // other config options
                    }
                });

                console.log("Starting adapter with demo credentials...");
                await harness.startAdapter();
                
                // Wait for API calls and initialization
                await new Promise(resolve => setTimeout(resolve, 60000));
                
                const connectionState = await harness.states.getStateAsync("your-adapter.0.info.connection");
                
                if (connectionState && connectionState.val === true) {
                    console.log("✅ SUCCESS: API connection established");
                    return true;
                } else {
                    throw new Error("API Test Failed: Expected API connection to be established with demo credentials. " +
                        "Check logs above for specific API errors (DNS resolution, 401 Unauthorized, network issues, etc.)");
                }
            }).timeout(120000);
        });
    }
});
```

### Fronius-Specific API Testing
For the Fronius adapter, create API tests that:
- Test both API version 0 and 1 endpoints
- Verify device discovery functionality (inverters, meters, storage)
- Test real-time data polling and archive data retrieval
- Handle offline/unreachable inverter scenarios
- Validate power flow calculations and energy measurements

## JSON Config (Admin 5 Interface)

### Basic Structure
For modern ioBroker adapters, use JSON configuration instead of HTML:

```json
{
  "type": "panel",
  "items": {
    "ip": {
      "type": "text",
      "label": "IP address of Fronius inverter",
      "tooltip": "Enter the IP address of your Fronius inverter"
    },
    "poll": {
      "type": "number",
      "label": "Polling interval (seconds)",
      "min": 10,
      "max": 300,
      "default": 30
    }
  }
}
```

### Dynamic Configuration
Implement dynamic configuration updates:

```javascript
// In adapter main code
adapter.on('message', (obj) => {
    if (obj.command === 'getDeviceInfo') {
        // API call to get device information
        performDeviceDiscovery(obj.message, (result) => {
            adapter.sendTo(obj.from, obj.command, result, obj.callback);
        });
    }
});
```

## Specific Fronius Adapter Patterns

### API Version Handling
```javascript
// Handle both API v0 and v1
const apiEndpoint = apiver === 1 
    ? `${requestType}${ip}${baseurl}GetInverterRealtimeData.cgi?Scope=System`
    : `${requestType}${ip}${baseurl}GetInverterRealtimeData.fcgi`;
```

### Data Processing Patterns
```javascript
// Process Fronius API response structure
function processInverterData(data) {
    if (data && data.Body && data.Body.Data) {
        const inverterData = data.Body.Data;
        
        // Handle multiple inverters
        Object.keys(inverterData).forEach(inverterId => {
            const inverter = inverterData[inverterId];
            
            // Set power values with proper units
            adapter.setState(`inverter.${inverterId}.PAC`, {
                val: inverter.PAC ? inverter.PAC.Value : 0,
                ack: true
            });
            
            // Handle status codes
            adapter.setState(`inverter.${inverterId}.StatusCode`, {
                val: inverter.DeviceStatus ? inverter.DeviceStatus.StatusCode : 0,
                ack: true
            });
        });
    }
}
```

### Connection Management
```javascript
// Implement proper connection monitoring
let connectionLost = false;
let retryCount = 0;
const maxRetries = 3;

function checkConnection() {
    axios.get(apiEndpoint)
        .then(response => {
            if (connectionLost) {
                adapter.log.info('Connection to Fronius inverter restored');
                connectionLost = false;
                retryCount = 0;
            }
            adapter.setState('info.connection', true, true);
        })
        .catch(error => {
            retryCount++;
            if (!connectionLost) {
                adapter.log.warn(`Lost connection to Fronius inverter: ${error.message}`);
                connectionLost = true;
            }
            
            if (retryCount >= maxRetries) {
                adapter.setState('info.connection', false, true);
            }
        });
}
```