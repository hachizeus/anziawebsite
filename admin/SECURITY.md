# Admin Panel Security Guide

## Overview

This document provides instructions for securing the admin panel of the Real Estate Website. Follow these steps to ensure your admin panel is protected against common security threats.

## Security Features

The admin panel includes the following security features:

- **JWT with Short Expiry**: Access tokens expire after 15 minutes
- **Refresh Token Rotation**: Refresh tokens are rotated on each use
- **HTTP-Only Cookies**: Refresh tokens are stored in HTTP-only cookies
- **CSRF Protection**: All admin routes are protected against CSRF attacks
- **Brute Force Protection**: Login attempts are limited and tracked
- **IP Blocking**: Automatic temporary IP blocking after multiple failed attempts
- **Content Security Policy**: Prevents XSS attacks
- **Security Monitoring**: Detects and logs suspicious activities
- **Secure Routes**: Protected routes with permission checks

## Installation

1. Generate security environment variables:

```bash
cd backend
node scripts/generateSecurityEnv.js
```

2. Update your `.env` file with the generated values.

3. Configure security settings in `.security.config`.

## Security Best Practices

### Server Configuration

1. **Enable HTTPS**: Always use HTTPS in production.
2. **Set Up Firewall**: Restrict access to admin panel by IP if possible.
3. **Regular Updates**: Keep all dependencies updated.

### Authentication

1. **Strong Passwords**: Require strong passwords (min 12 characters, mixed case, numbers, symbols).
2. **2FA**: Enable two-factor authentication for all admin users.
3. **Session Management**: Implement automatic session timeout.

### Monitoring

1. **Security Logs**: Regularly review security logs.
2. **Alerts**: Set up alerts for suspicious activities.
3. **Auditing**: Conduct regular security audits.

## Security Configuration

Edit the `.security.config` file to customize security settings:

```
# Authentication
AUTH_TOKEN_EXPIRY=900  # 15 minutes in seconds
AUTH_REFRESH_TOKEN_EXPIRY=604800  # 7 days in seconds
AUTH_MAX_LOGIN_ATTEMPTS=10
AUTH_LOCKOUT_DURATION=3600  # 1 hour in seconds
```

## Emergency Response

In case of a security incident:

1. **Isolate**: Disconnect the affected systems.
2. **Investigate**: Determine the scope and impact.
3. **Remediate**: Fix vulnerabilities and restore from clean backups.
4. **Report**: Document the incident and notify affected parties if required.

## Contact

For security concerns or questions, contact the security team at support@Anzia Electronics .co.ke