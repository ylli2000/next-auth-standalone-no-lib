# Authentication System Planning

## Overview

We are going to build a production-ready authentication system with email/password, OAuth2, cookies, and session management capabilities. This system will provide secure, reliable authentication for our application.

## Authentication Components

### Core Authentication Features

- **Email/Password Authentication**
    - Sign Up New account with flow to create an profile
    - Forgot password link to send email with flow to reset password
    - Password policy enforcement
    - Email verification flow
    - Secure password hashing & salting using scrypt, it is a bit newer than bcrypt
    - Brute force protection with IP-based request rate limiting and IP blocking
- **OAuth2 Integration**
    - Support for major providers (Google(social), Microsoft(tech), Discord(social), Facebook (social), GitHub (tech))
    - Standardized OAuth2 flow implementation
    - JWT handling for OAuth tokens
    - Profile information mapping from providers
- **Session Management**
    - Secure HTTP-only cookies
    - Session expiration and renewal
    - Device tracking and management
    - Session invalidation on password change
    - Session invalidation on access revocation
- **Admin Panel Security Features**
    - Global Security Options
        - IP-based Rate limiting, and IP blocking duration
        - Email/password failed attempts allowed, retry interval
        - CSRF protection
        - Password policy
        - Email verification code expiration config
        - OAuth2 provider enable/disable config
        - OAuth2 provider individual MFA policy
    - User Management
        - Initial Setup
            - First time accessing promot wizard to create initial admin account
        - Listing Invitations
            - Create invitation button that sends invitation email with flow to create an profile
            - Invitation row to show email, created time, and expiration duration
            - Invitation row inline buttons to resend, delete invitation
        - Listing Users
            - User row to show contact info, created time, and status
            - User row inline bottons to edit, activate, deactivate, delete, revoke access
        - Email/Password Authentication vs OAuth2
            - User row to show authentication method column
            - Same email signed up with different authentication method should be considered as different users
    - Logging Interface
        - Authentication events logging
        - Suspicious activity detection logging, e.g. IP blocked, password brute force, etc.

## Technical Implementation

### Backend Implementation

- RESTful API endpoints for authentication flows
- Stateless JWT tokens for API authentication
- Database schema for user accounts and sessions
- Rate limiting middleware
- Security headers implementation

### Frontend Implementation

- Authentication state management
- Login/registration forms with validation
- OAuth provider button integration
- Session expiration handling
- Protected route implementation
- Admin Panel implementation

## User Data Storage

- Global settings
- User profile data
- Hashed credentials with salt
- Invitation data
- Session information
- Logs with authentication events, suspicious activity detection, password brute force, etc.
