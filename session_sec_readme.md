<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session-Based Authentication Security Issues</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #dc3545 0%, #6f42c1 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            padding: 30px;
        }
        
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 40px;
            font-size: 2.5em;
        }
        
        .threat-overview {
            background: #fff5f5;
            border: 3px solid #dc3545;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .threat-title {
            color: #dc3545;
            font-size: 1.8em;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .vulnerability {
            margin-bottom: 40px;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .critical { border-left-color: #dc3545; background: #fff5f5; }
        .high { border-left-color: #fd7e14; background: #fff8f0; }
        .medium { border-left-color: #ffc107; background: #fffdf7; }
        .low { border-left-color: #17a2b8; background: #f7fdff; }
        
        .vuln-title {
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .severity-badge {
            padding: 4px 12px;
            border-radius: 20px;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
        }
        
        .critical-badge { background: #dc3545; }
        .high-badge { background: #fd7e14; }
        .medium-badge { background: #ffc107; color: #333; }
        .low-badge { background: #17a2b8; }
        
        .attack-scenario {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .scenario-title {
            font-weight: 600;
            color: #495057;
            margin-bottom: 10px;
        }
        
        .attack-steps {
            list-style: none;
            padding: 0;
        }
        
        .attack-steps li {
            margin-bottom: 8px;
            padding-left: 25px;
            position: relative;
        }
        
        .attack-steps li:before {
            content: "➤";
            position: absolute;
            left: 0;
            color: #dc3545;
            font-weight: bold;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        .code-comment {
            color: #68d391;
        }
        
        .code-string {
            color: #fbb6ce;
        }
        
        .code-keyword {
            color: #90cdf4;
        }
        
        .code-danger {
            color: #fc8181;
            font-weight: bold;
        }
        
        .mitigation {
            background: #d4edda;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .mitigation-title {
            font-weight: 600;
            color: #155724;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .mitigation-list {
            list-style: none;
            padding: 0;
        }
        
        .mitigation-list li {
            margin-bottom: 8px;
            padding-left: 25px;
            position: relative;
        }
        
        .mitigation-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .comparison-table th,
        .comparison-table td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
        }
        
        .comparison-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        
        .risk-high { background: #f8d7da; color: #721c24; }
        .risk-medium { background: #fff3cd; color: #856404; }
        .risk-low { background: #d1ecf1; color: #0c5460; }
        
        .impact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .impact-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
        }
        
        .data-breach { border-color: #dc3545; background: #fff5f5; }
        .service-disruption { border-color: #fd7e14; background: #fff8f0; }
        .privacy-violation { border-color: #6f42c1; background: #faf8ff; }
        
        .impact-title {
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
        }
        
        .security-layers {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }
        
        .security-layer {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        
        .layer-number {
            background: #007bff;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .layer-content {
            flex: 1;
        }
        
        .layer-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .layer-description {
            color: #666;
            font-size: 0.9em;
        }
        
        .compromised { 
            border-left-color: #dc3545; 
            background: #fff5f5; 
        }
        
        .compromised .layer-number {
            background: #dc3545;
        }
        
        @media (max-width: 768px) {
            .impact-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 Session Security Vulnerabilities</h1>
        
        <!-- Threat Overview -->
        <div class="threat-overview">
            <div class="threat-title">
                ⚠️ Security Risks in Your Current Implementation
            </div>
            <p>While session-based authentication provides good security when properly implemented, your current audio hosting application has several vulnerabilities that could be exploited by attackers. These range from critical infrastructure issues to implementation flaws that could compromise user data and system integrity.</p>
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
                <strong>Risk Assessment:</strong> The combination of memory-based session storage, missing security headers, and lack of comprehensive input validation creates multiple attack vectors that could lead to complete system compromise.
            </div>
        </div>
        
        <!-- Session Hijacking -->
        <div class="vulnerability critical">
            <div class="vuln-title">
                🔓 Session Hijacking
                <span class="severity-badge critical-badge">CRITICAL</span>
            </div>
            
            <p><strong>Description:</strong> Attackers steal session cookies to impersonate legitimate users and gain unauthorized access to their accounts and audio files.</p>
            
            <div class="attack-scenario">
                <div class="scenario-title">Attack Scenario:</div>
                <ol class="attack-steps">
                    <li>User connects to public Wi-Fi (coffee shop, airport)</li>
                    <li>Attacker performs packet sniffing on unencrypted HTTP traffic</li>
                    <li>Session cookie (connect.sid) is captured from HTTP headers</li>
                    <li>Attacker uses stolen cookie to access victim's account</li>
                    <li>Attacker downloads, deletes, or modifies user's audio files</li>
                </ol>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Current vulnerable configuration</span>
app.use(session({
  secret: <span class="code-string">'audio-hosting-secret'</span>, <span class="code-comment">// Weak secret</span>
  cookie: { 
    secure: <span class="code-danger">false</span>, <span class="code-comment">// ❌ Allows HTTP transmission</span>
    httpOnly: <span class="code-keyword">true</span>, <span class="code-comment">// ✅ Good, but not enough</span>
    sameSite: <span class="code-danger">undefined</span> <span class="code-comment">// ❌ No CSRF protection</span>
  }
}));

<span class="code-comment">// Vulnerable cookie in HTTP response:</span>
Set-Cookie: connect.sid=s%3A123abc...; Path=/; HttpOnly
<span class="code-comment">// ❌ No Secure flag - can be transmitted over HTTP</span>
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Enable HTTPS and set secure: true for production</li>
                    <li>Implement SameSite='Strict' to prevent CSRF attacks</li>
                    <li>Use strong, randomly generated session secrets</li>
                    <li>Implement session fingerprinting (IP, User-Agent validation)</li>
                    <li>Set shorter session timeouts (2-4 hours instead of 24)</li>
                    <li>Regenerate session ID on privilege changes</li>
                </ul>
            </div>
        </div>
        
        <!-- Session Fixation -->
        <div class="vulnerability high">
            <div class="vuln-title">
                🔒 Session Fixation
                <span class="severity-badge high-badge">HIGH</span>
            </div>
            
            <p><strong>Description:</strong> Attackers force users to use a predetermined session ID, allowing them to hijack the session after the user logs in.</p>
            
            <div class="attack-scenario">
                <div class="scenario-title">Attack Scenario:</div>
                <ol class="attack-steps">
                    <li>Attacker obtains a valid session ID from your application</li>
                    <li>Attacker tricks user into using this session ID (malicious link)</li>
                    <li>User logs in with the predetermined session ID</li>
                    <li>Attacker now has access to the authenticated session</li>
                    <li>Attacker can access user's account and audio files</li>
                </ol>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Current vulnerable login implementation</span>
<span class="code-keyword">async</span> login(req, res) {
  <span class="code-keyword">const</span> { username, password } = req.body;
  
  <span class="code-comment">// Verify credentials...</span>
  <span class="code-keyword">const</span> user = <span class="code-keyword">await</span> verifyUser(username, password);
  
  <span class="code-comment">// ❌ VULNERABLE: Reuses existing session ID</span>
  req.session.userId = user.id;
  req.session.username = user.username;
  
  <span class="code-comment">// Session ID remains the same before and after login!</span>
  res.json({ message: <span class="code-string">'Login successful'</span>, user });
}
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Regenerate session ID on successful login</li>
                    <li>Destroy old session and create new one</li>
                    <li>Implement session validation checks</li>
                    <li>Use secure session ID generation</li>
                </ul>
            </div>
        </div>
        
        <!-- CSRF Attacks -->
        <div class="vulnerability high">
            <div class="vuln-title">
                🎯 Cross-Site Request Forgery (CSRF)
                <span class="severity-badge high-badge">HIGH</span>
            </div>
            
            <p><strong>Description:</strong> Malicious websites can make authenticated requests to your application on behalf of logged-in users without their knowledge.</p>
            
            <div class="attack-scenario">
                <div class="scenario-title">Attack Scenario:</div>
                <ol class="attack-steps">
                    <li>User logs into your audio hosting application</li>
                    <li>User visits a malicious website (while still logged in)</li>
                    <li>Malicious site contains hidden form targeting your API</li>
                    <li>Browser automatically sends session cookie with the request</li>
                    <li>Your server processes the request as legitimate</li>
                    <li>User's audio files are deleted without their knowledge</li>
                </ol>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Malicious website HTML</span>
&lt;form action=<span class="code-string">"http://localhost:5000/api/audio/123"</span> method=<span class="code-string">"POST"</span> style=<span class="code-string">"display:none"</span>&gt;
  &lt;input type=<span class="code-string">"hidden"</span> name=<span class="code-string">"_method"</span> value=<span class="code-string">"DELETE"</span>&gt;
&lt;/form&gt;
&lt;script&gt;
  <span class="code-comment">// Auto-submit form when page loads</span>
  document.forms[0].submit();
&lt;/script&gt;

<span class="code-comment">// Your server receives:</span>
<span class="code-comment">// DELETE /api/audio/123</span>
<span class="code-comment">// Cookie: connect.sid=s%3A123abc...</span>
<span class="code-comment">// ❌ Server processes as legitimate request!</span>
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Implement CSRF tokens for state-changing operations</li>
                    <li>Set SameSite='Strict' on session cookies</li>
                    <li>Verify Referer/Origin headers</li>
                    <li>Use double-submit cookie pattern</li>
                    <li>Require re-authentication for sensitive operations</li>
                </ul>
            </div>
        </div>
        
        <!-- Memory Store Vulnerabilities -->
        <div class="vulnerability critical">
            <div class="vuln-title">
                💾 Memory Store Vulnerabilities
                <span class="severity-badge critical-badge">CRITICAL</span>
            </div>
            
            <p><strong>Description:</strong> Using memory-based session storage creates multiple security and operational risks in production environments.</p>
            
            <div class="impact-grid">
                <div class="impact-card data-breach">
                    <div class="impact-title">🔓 Data Exposure</div>
                    <ul>
                        <li>Session data visible in memory dumps</li>
                        <li>No encryption of session data</li>
                        <li>Vulnerable to memory-based attacks</li>
                        <li>Process memory accessible to other processes</li>
                    </ul>
                </div>
                
                <div class="impact-card service-disruption">
                    <div class="impact-title">💥 Service Disruption</div>
                    <ul>
                        <li>All sessions lost on server restart</li>
                        <li>Memory leaks with abandoned sessions</li>
                        <li>Server crashes from memory exhaustion</li>
                        <li>No session persistence across deployments</li>
                    </ul>
                </div>
                
                <div class="impact-card privacy-violation">
                    <div class="impact-title">👤 Privacy Violations</div>
                    <ul>
                        <li>User sessions survive user logout attempts</li>
                        <li>No audit trail of session access</li>
                        <li>Impossible to revoke specific sessions</li>
                        <li>Session data might be swapped to disk</li>
                    </ul>
                </div>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Current vulnerable memory store</span>
app.use(session({
  <span class="code-comment">// ❌ No store specified = MemoryStore (development only)</span>
  secret: <span class="code-string">'audio-hosting-secret'</span>,
  resave: <span class="code-keyword">false</span>,
  saveUninitialized: <span class="code-keyword">false</span>
}));

<span class="code-comment">// Problems:</span>
<span class="code-comment">// 1. Sessions stored in plain JavaScript objects</span>
<span class="code-comment">// 2. No encryption or security</span>
<span class="code-comment">// 3. Vulnerable to memory inspection</span>
<span class="code-comment">// 4. Lost on any server restart</span>
<span class="code-comment">// 5. Memory leaks with long-running processes</span>
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Use Redis or database-backed session store</li>
                    <li>Encrypt session data at rest</li>
                    <li>Implement session cleanup and garbage collection</li>
                    <li>Set up monitoring for session store health</li>
                    <li>Use session store with built-in security features</li>
                </ul>
            </div>
        </div>
        
        <!-- Session Enumeration -->
        <div class="vulnerability medium">
            <div class="vuln-title">
                🔢 Session Enumeration
                <span class="severity-badge medium-badge">MEDIUM</span>
            </div>
            
            <p><strong>Description:</strong> Predictable or weak session IDs allow attackers to guess valid session tokens and gain unauthorized access.</p>
            
            <div class="attack-scenario">
                <div class="scenario-title">Attack Scenario:</div>
                <ol class="attack-steps">
                    <li>Attacker analyzes session ID patterns from multiple logins</li>
                    <li>Identifies predictable elements (timestamps, incremental counters)</li>
                    <li>Creates algorithm to generate likely session IDs</li>
                    <li>Brute forces session IDs against your application</li>
                    <li>Gains access to active user sessions</li>
                </ol>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Example of predictable session IDs (BAD)</span>
<span class="code-comment">// Pattern analysis from captured sessions:</span>
connect.sid=s%3A1639123456789.abc123
connect.sid=s%3A1639123456790.def456  <span class="code-comment">// ❌ Timestamp-based</span>
connect.sid=s%3A1639123456791.ghi789

<span class="code-comment">// Attacker can predict next session ID:</span>
<span class="code-keyword">const</span> nextTimestamp = Date.now();
<span class="code-keyword">const</span> predictedSession = <span class="code-string">`s%3A${nextTimestamp}.xxx123`</span>;

<span class="code-comment">// Current session secret (potentially weak)</span>
session({
  secret: <span class="code-string">'audio-hosting-secret'</span> <span class="code-comment">// ❌ Static, guessable</span>
});
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Use cryptographically strong session ID generation</li>
                    <li>Implement minimum 128-bit entropy for session IDs</li>
                    <li>Use multiple random secrets rotated regularly</li>
                    <li>Monitor for session enumeration attempts</li>
                    <li>Implement rate limiting on session validation</li>
                </ul>
            </div>
        </div>
        
        <!-- Concurrent Session Issues -->
        <div class="vulnerability medium">
            <div class="vuln-title">
                👥 Concurrent Session Vulnerabilities
                <span class="severity-badge medium-badge">MEDIUM</span>
            </div>
            
            <p><strong>Description:</strong> Lack of concurrent session management allows unlimited sessions per user, making it difficult to detect compromised accounts and control access.</p>
            
            <div class="attack-scenario">
                <div class="scenario-title">Attack Scenario:</div>
                <ol class="attack-steps">
                    <li>Attacker obtains user credentials (phishing, data breach)</li>
                    <li>Attacker logs in while user is still using the application</li>
                    <li>Both sessions remain active simultaneously</li>
                    <li>User doesn't notice unauthorized access</li>
                    <li>Attacker maintains persistent access alongside legitimate user</li>
                    <li>Attacker can monitor user activity and steal data</li>
                </ol>
            </div>
            
            <div class="code-block">
<span class="code-comment">// Current implementation allows unlimited sessions</span>
<span class="code-keyword">async</span> login(req, res) {
  <span class="code-comment">// ❌ No check for existing sessions</span>
  req.session.userId = user.id;
  res.json({ message: <span class="code-string">'Login successful'</span> });
  
  <span class="code-comment">// Result: User can have 10+ active sessions</span>
  <span class="code-comment">// - Original browser</span>
  <span class="code-comment">// - Mobile device</span>
  <span class="code-comment">// - Attacker's browser (undetected)</span>
  <span class="code-comment">// - Multiple compromised devices</span>
}

<span class="code-comment">// No session tracking or limits</span>
<span class="code-comment">// No way to force logout from other devices</span>
<span class="code-comment">// No visibility into active sessions</span>
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Mitigation Strategies</div>
                <ul class="mitigation-list">
                    <li>Implement maximum session limits per user (3-5 sessions)</li>
                    <li>Provide "logout from all devices" functionality</li>
                    <li>Display active sessions to users</li>
                    <li>Detect suspicious login patterns (location, device)</li>
                    <li>Force re-authentication for sensitive operations</li>
                    <li>Implement session monitoring and alerting</li>
                </ul>
            </div>
        </div>
        
        <!-- Defense in Depth -->
        <div class="vulnerability low">
            <div class="vuln-title">
                🏰 Lack of Defense in Depth
                <span class="severity-badge low-badge">LOW</span>
            </div>
            
            <p><strong>Description:</strong> Relying solely on session-based authentication without additional security layers creates single points of failure.</p>
            
            <div class="security-layers">
                <div class="security-layer compromised">
                    <div class="layer-number">1</div>
                    <div class="layer-content">
                        <div class="layer-title">Session Authentication (Current)</div>
                        <div class="layer-description">Only security layer - if compromised, entire system is vulnerable</div>
                    </div>
                </div>
                
                <div class="security-layer">
                    <div class="layer-number">2</div>
                    <div class="layer-content">
                        <div class="layer-title">Multi-Factor Authentication (Missing)</div>
                        <div class="layer-description">Second factor could prevent account takeover even with stolen sessions</div>
                    </div>
                </div>
                
                <div class="security-layer">
                    <div class="layer-number">3</div>
                    <div class="layer-content">
                        <div class="layer-title">IP/Device Validation (Missing)</div>
                        <div class="layer-description">Detect and block sessions from unusual locations or devices</div>
                    </div>
                </div>
                
                <div class="security-layer">
                    <div class="layer-number">4</div>
                    <div class="layer-content">
                        <div class="layer-title">Rate Limiting (Missing)</div>
                        <div class="layer-description">Prevent brute force attacks and automated abuse</div>
                    </div>
                </div>
            </div>
            
            <div class="mitigation">
                <div class="mitigation-title">🛡️ Additional Security Layers</div>
                <ul class="mitigation-list">
                    <li>Implement multi-factor authentication (TOTP, SMS)</li>
                    <li>Add device fingerprinting and validation</li>
                    <li>Implement comprehensive rate limiting</li>
                    <li>Add intrusion detection and monitoring</li>
                    <li>Use Web Application Firewall (WAF)</li>
                    <li>Implement behavioral analysis for anomaly detection</li>
                </ul>
            </div>
        </div>
        
        <!-- Impact Assessment -->
        <div class="threat-overview">
            <div class="threat-title">
                💥 Potential Impact Assessment
            </div>
            
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Vulnerability</th>
                        <th>Likelihood</th>
                        <th>Impact</th>
                        <th>Risk Level</th>
                        <th>Potential Damage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Session Hijacking</td>
                        <td class="risk-high">High</td>
                        <td class="risk-high">High</td>
                        <td class="risk-high">Critical</td>
                        <td>Complete account takeover, data theft</td>
                    </tr>
                    <tr>
                        <td>Session Fixation</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                        <td class="risk-high">High</td>
                        <td>Account compromise, unauthorized access</td>
                    </tr>
                    <tr>
                        <td>CSRF Attacks</td>
                        <td class="risk-high">High</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                        <td>Unauthorized actions, data manipulation</td>
                    </tr>
                    <tr>
                        <td>Memory Store Issues</td>
                        <td class="risk-high">High</td>
                        <td class="risk-high">High</td>
                        <td class="risk-high">Critical</td>
                        <td>Data loss, service disruption, privacy breach</td>
                    </tr>
                    <tr>
                        <td>Session Enumeration</td>
                        <td class="risk-low">Low</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-medium">Medium</td>
                        <td>Unauthorized access, account compromise</td>
                    </tr>
                    <tr>
                        <td>Concurrent Sessions</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-medium">Medium</td>
                        <td>Persistent unauthorized access, stealth attacks</td>
                    </tr>
                    <tr>
                        <td>Lack of Defense in Depth</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                        <td class="risk-medium">Medium</td>
                        <td>Amplified impact of other vulnerabilities</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Real-World Attack Examples -->
        <div class="vulnerability critical">
            <div class="vuln-title">
                🌍 Real-World Attack Examples
                <span class="severity-badge critical-badge">CRITICAL</span>
            </div>
            
            <div class="attack-scenario">
                <div class="scenario-title">Example 1: Coffee Shop Wi-Fi Attack</div>
                <div class="code-block">
<span class="code-comment">// Attacker sets up packet capture</span>
<span class="code-keyword">sudo</span> tcpdump -i wlan0 -A | grep <span class="code-string">"connect.sid"</span>

<span class="code-comment">// Captures user's session cookie over HTTP</span>
Cookie: connect.sid=s%3Aabcd1234-5678-90ef-ghij-klmnopqrstuv.xyz789

<span class="code-comment">// Attacker uses curl to hijack session</span>
curl -H <span class="code-string">"Cookie: connect.sid=s%3Aabcd1234-5678-90ef-ghij-klmnopqrstuv.xyz789"</span> \
     http://localhost:5000/api/audio

<span class="code-comment">// Result: Full access to victim's audio files</span>
                </div>
            </div>
            
            <div class="attack-scenario">
                <div class="scenario-title">Example 2: CSRF File Deletion Attack</div>
                <div class="code-block">
<span class="code-comment">// Malicious website HTML</span>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Free Music Downloads&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Click here for free music!&lt;/h1&gt;
  
  <span class="code-comment">&lt;!-- Hidden malicious form --&gt;</span>
  &lt;form id=<span class="code-string">"malicious"</span> action=<span class="code-string">"http://localhost:5000/api/audio/123"</span> method=<span class="code-string">"POST"</span>&gt;
    &lt;input type=<span class="code-string">"hidden"</span> name=<span class="code-string">"_method"</span> value=<span class="code-string">"DELETE"</span>&gt;
  &lt;/form&gt;
  
  &lt;script&gt;
    <span class="code-comment">// Auto-submit when user clicks anywhere</span>
    document.onclick = <span class="code-keyword">function</span>() {
      document.getElementById(<span class="code-string">'malicious'</span>).submit();
    };
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;

<span class="code-comment">// Result: User's audio file deleted without their knowledge</span>
                </div>
            </div>
            
            <div class="attack-scenario">
                <div class="scenario-title">Example 3: Session Fixation Attack</div>
                <div class="code-block">
<span class="code-comment">// Step 1: Attacker gets valid session ID</span>
curl http://localhost:5000/api/auth/check
<span class="code-comment">// Response includes: Set-Cookie: connect.sid=KNOWN_SESSION_ID</span>

<span class="code-comment">// Step 2: Attacker sends victim malicious link</span>
<span class="code-string">"Hey, check out this cool audio app!"</span>
http://localhost:3000?session=KNOWN_SESSION_ID

<span class="code-comment">// Step 3: Victim logs in with predetermined session</span>
<span class="code-comment">// POST /api/auth/login (using KNOWN_SESSION_ID)</span>

<span class="code-comment">// Step 4: Attacker uses same session ID</span>
curl -H <span class="code-string">"Cookie: connect.sid=KNOWN_SESSION_ID"</span> \
     http://localhost:5000/api/audio
<span class="code-comment">// Result: Access to victim's authenticated session</span>
                </div>
            </div>
        </div>
        
        <!-- Comprehensive Security Roadmap -->
        <div class="mitigation">
            <div class="mitigation-title">🗺️ Comprehensive Security Roadmap</div>
            
            <h4>Phase 1: Critical Fixes (Week 1)</h4>
            <div class="code-block">
<span class="code-comment">// 1. Implement HTTPS and secure cookies</span>
app.use(session({
  secret: process.env.SESSION_SECRET, <span class="code-comment">// Strong random secret</span>
  resave: <span class="code-keyword">false</span>,
  saveUninitialized: <span class="code-keyword">false</span>,
  cookie: {
    secure: process.env.NODE_ENV === <span class="code-string">'production'</span>, <span class="code-comment">// HTTPS only</span>
    httpOnly: <span class="code-keyword">true</span>,
    sameSite: <span class="code-string">'strict'</span>, <span class="code-comment">// CSRF protection</span>
    maxAge: 2 * 60 * 60 * 1000 <span class="code-comment">// 2 hours</span>
  }
}));

<span class="code-comment">// 2. Implement session regeneration</span>
<span class="code-keyword">async</span> login(req, res) {
  <span class="code-comment">// Verify credentials first...</span>
  
  <span class="code-keyword">const</span> oldSessionId = req.session.id;
  req.session.regenerate((err) => {
    <span class="code-keyword">if</span> (err) <span class="code-keyword">return</span> res.status(500);
    
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.loginTime = <span class="code-keyword">new</span> Date();
    
    console.log(<span class="code-string">`Session regenerated: ${oldSessionId} -> ${req.session.id}`</span>);
    res.json({ message: <span class="code-string">'Login successful'</span> });
  });
}

<span class="code-comment">// 3. Switch to Redis session store</span>
<span class="code-keyword">const</span> RedisStore = <span class="code-keyword">require</span>(<span class="code-string">'connect-redis'</span>)(session);
<span class="code-keyword">const</span> redis = <span class="code-keyword">require</span>(<span class="code-string">'redis'</span>);

<span class="code-keyword">const</span> redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

app.use(session({
  store: <span class="code-keyword">new</span> RedisStore({ client: redisClient }),
  <span class="code-comment">// ... other options</span>
}));
            </div>
            
            <h4>Phase 2: Enhanced Security (Week 2)</h4>
            <div class="code-block">
<span class="code-comment">// 1. CSRF Protection</span>
<span class="code-keyword">const</span> csrf = <span class="code-keyword">require</span>(<span class="code-string">'csurf'</span>);
<span class="code-keyword">const</span> csrfProtection = csrf({ cookie: <span class="code-keyword">true</span> });

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

<span class="code-comment">// 2. Rate Limiting</span>
<span class="code-keyword">const</span> rateLimit = <span class="code-keyword">require</span>(<span class="code-string">'express-rate-limit'</span>);

<span class="code-keyword">const</span> loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, <span class="code-comment">// 15 minutes</span>
  max: 5, <span class="code-comment">// 5 attempts per window</span>
  message: <span class="code-string">'Too many login attempts, try again later'</span>,
  standardHeaders: <span class="code-keyword">true</span>,
  legacyHeaders: <span class="code-keyword">false</span>
});

app.use(<span class="code-string">'/api/auth/login'</span>, loginLimiter);

<span class="code-comment">// 3. Session Activity Tracking</span>
<span class="code-keyword">const</span> trackActivity = (req, res, next) => {
  <span class="code-keyword">if</span> (req.session.userId) {
    <span class="code-keyword">const</span> now = <span class="code-keyword">new</span> Date();
    <span class="code-keyword">const</span> lastActivity = req.session.lastActivity;
    
    <span class="code-comment">// Check for suspicious time gaps</span>
    <span class="code-keyword">if</span> (lastActivity && (now - lastActivity) > (4 * 60 * 60 * 1000)) {
      req.session.destroy();
      <span class="code-keyword">return</span> res.status(401).json({ message: <span class="code-string">'Session expired'</span> });
    }
    
    req.session.lastActivity = now;
  }
  next();
};
            </div>
            
            <h4>Phase 3: Advanced Protection (Week 3)</h4>
            <div class="code-block">
<span class="code-comment">// 1. Concurrent Session Management</span>
<span class="code-keyword">const</span> activeSessions = <span class="code-keyword">new</span> Map(); <span class="code-comment">// userId -> Set of sessionIds</span>

<span class="code-keyword">async</span> login(req, res) {
  <span class="code-comment">// After credential verification...</span>
  
  <span class="code-keyword">const</span> userId = user.id;
  <span class="code-keyword">const</span> maxSessions = 3;
  
  <span class="code-keyword">if</span> (!activeSessions.has(userId)) {
    activeSessions.set(userId, <span class="code-keyword">new</span> Set());
  }
  
  <span class="code-keyword">const</span> userSessions = activeSessions.get(userId);
  
  <span class="code-keyword">if</span> (userSessions.size >= maxSessions) {
    <span class="code-comment">// Force logout oldest session</span>
    <span class="code-keyword">const</span> oldestSession = userSessions.values().next().value;
    <span class="code-keyword">await</span> destroySession(oldestSession);
    userSessions.delete(oldestSession);
  }
  
  req.session.regenerate((err) => {
    req.session.userId = userId;
    userSessions.add(req.session.id);
    res.json({ message: <span class="code-string">'Login successful'</span> });
  });
}

<span class="code-comment">// 2. Device Fingerprinting</span>
<span class="code-keyword">const</span> generateFingerprint = (req) => {
  <span class="code-keyword">const</span> crypto = <span class="code-keyword">require</span>(<span class="code-string">'crypto'</span>);
  <span class="code-keyword">const</span> components = [
    req.headers[<span class="code-string">'user-agent'</span>],
    req.headers[<span class="code-string">'accept-language'</span>],
    req.headers[<span class="code-string">'accept-encoding'</span>],
    req.ip
  ].join(<span class="code-string">'|'</span>);
  
  <span class="code-keyword">return</span> crypto.createHash(<span class="code-string">'sha256'</span>).update(components).digest(<span class="code-string">'hex'</span>);
};

<span class="code-keyword">const</span> validateFingerprint = (req, res, next) => {
  <span class="code-keyword">if</span> (req.session.userId) {
    <span class="code-keyword">const</span> currentFingerprint = generateFingerprint(req);
    
    <span class="code-keyword">if</span> (req.session.fingerprint && 
        req.session.fingerprint !== currentFingerprint) {
      console.log(<span class="code-string">`Suspicious activity: fingerprint mismatch for user ${req.session.userId}`</span>);
      req.session.destroy();
      <span class="code-keyword">return</span> res.status(401).json({ message: <span class="code-string">'Session invalid'</span> });
    }
    
    <span class="code-keyword">if</span> (!req.session.fingerprint) {
      req.session.fingerprint = currentFingerprint;
    }
  }
  next();
};
            </div>
            
            <h4>Phase 4: Monitoring & Alerting (Week 4)</h4>
            <div class="code-block">
<span class="code-comment">// 1. Security Event Logging</span>
<span class="code-keyword">const</span> winston = <span class="code-keyword">require</span>(<span class="code-string">'winston'</span>);

<span class="code-keyword">const</span> securityLogger = winston.createLogger({
  level: <span class="code-string">'info'</span>,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    <span class="code-keyword">new</span> winston.transports.File({ 
      filename: <span class="code-string">'security.log'</span>,
      level: <span class="code-string">'warn'</span> 
    })
  ]
});

<span class="code-keyword">const</span> logSecurityEvent = (event, details) => {
  securityLogger.warn({
    event,
    details,
    timestamp: <span class="code-keyword">new</span> Date().toISOString()
  });
};

<span class="code-comment">// 2. Anomaly Detection</span>
<span class="code-keyword">const</span> detectAnomalies = (req, res, next) => {
  <span class="code-keyword">if</span> (req.session.userId) {
    <span class="code-keyword">const</span> suspicious = [];
    
    <span class="code-comment">// Check for rapid requests</span>
    <span class="code-keyword">const</span> now = Date.now();
    <span class="code-keyword">const</span> lastRequest = req.session.lastRequestTime || 0;
    <span class="code-keyword">if</span> (now - lastRequest < 100) { <span class="code-comment">// Less than 100ms</span>
      suspicious.push(<span class="code-string">'rapid_requests'</span>);
    }
    
    <span class="code-comment">// Check for unusual IP changes</span>
    <span class="code-keyword">if</span> (req.session.lastIP && req.session.lastIP !== req.ip) {
      suspicious.push(<span class="code-string">'ip_change'</span>);
    }
    
    <span class="code-keyword">if</span> (suspicious.length > 0) {
      logSecurityEvent(<span class="code-string">'suspicious_activity'</span>, {
        userId: req.session.userId,
        flags: suspicious,
        ip: req.ip,
        userAgent: req.headers[<span class="code-string">'user-agent'</span>]
      });
    }
    
    req.session.lastRequestTime = now;
    req.session.lastIP = req.ip;
  }
  next();
};

<span class="code-comment">// 3. Real-time Security Monitoring</span>
<span class="code-keyword">const</span> monitorSessions = () => {
  setInterval(<span class="code-keyword">async</span> () => {
    <span class="code-keyword">const</span> activeSessionCount = <span class="code-keyword">await</span> getActiveSessionCount();
    <span class="code-keyword">const</span> suspiciousActivityCount = <span class="code-keyword">await</span> getSuspiciousActivityCount();
    
    <span class="code-keyword">if</span> (suspiciousActivityCount > 10) {
      logSecurityEvent(<span class="code-string">'high_suspicious_activity'</span>, {
        count: suspiciousActivityCount,
        activeSessions: activeSessionCount
      });
      
      <span class="code-comment">// Alert administrators</span>
      <span class="code-keyword">await</span> sendSecurityAlert(<span class="code-string">'High suspicious activity detected'</span>);
    }
  }, 60000); <span class="code-comment">// Check every minute</span>
};

monitorSessions();
            </div>
        </div>
        
        <!-- Summary -->
        <div class="threat-overview">
            <div class="threat-title">
                🎯 Security Summary & Recommendations
            </div>
            
            <p><strong>Current Risk Level: HIGH</strong> - Your application has multiple critical vulnerabilities that could lead to complete system compromise.</p>
            
            <h4>Immediate Actions Required:</h4>
            <ul class="mitigation-list">
                <li><strong>Switch to HTTPS</strong> - Enable SSL/TLS and set secure cookies</li>
                <li><strong>Implement Redis Store</strong> - Replace memory store immediately</li>
                <li><strong>Add Session Regeneration</strong> - Prevent session fixation attacks</li>
                <li><strong>Enable CSRF Protection</strong> - Add CSRF tokens to all forms</li>
                <li><strong>Implement Rate Limiting</strong> - Prevent brute force attacks</li>
            </ul>
            
            <h4>Long-term Security Improvements:</h4>
            <ul class="mitigation-list">
                <li>Multi-factor authentication for sensitive operations</li>
                <li>Comprehensive session monitoring and alerting</li>
                <li>Device fingerprinting and anomaly detection</li>
                <li>Regular security audits and penetration testing</li>
                <li>Incident response plan for security breaches</li>
            </ul>
            
            <div style="background: #dc3545; color: white; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <strong>⚠️ Critical Warning:</strong> Do not deploy this application to production without addressing the critical vulnerabilities. The current implementation could result in complete data compromise, user privacy violations, and potential legal liability.
            </div>
        </div>
    </div>
</body>
</html>