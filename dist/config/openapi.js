"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openapiSpec = void 0;
exports.openapiSpec = {
    openapi: "3.0.0",
    info: {
        title: "Express CRM API",
        version: "1.0.0",
        description: "CRM REST API for users, contacts, devis, and email messages with JWT authentication."
    },
    servers: [{ url: "/api" }],
    tags: [
        { name: "Auth", description: "Authentication and account operations" },
        { name: "Users", description: "User management" },
        { name: "Contacts", description: "Inbound contacts" },
        { name: "Devis", description: "Quote requests" },
        { name: "Emails", description: "Email sending and history" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    error: {
                        type: "object",
                        properties: {
                            code: { type: "string" },
                            message: { type: "string" },
                            details: { type: "object", nullable: true }
                        }
                    }
                }
            },
            AuthTokens: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                    expiresAt: { type: "string", format: "date-time" }
                }
            },
            User: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone: { type: "string", nullable: true },
                    role: { type: "string", enum: ["admin", "agent", "viewer"] },
                    isActive: { type: "boolean" },
                    isEmailVerified: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            Contact: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    source: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone: { type: "string" },
                    postalCode: { type: "string", nullable: true },
                    message: { type: "string" },
                    consent: { type: "boolean" },
                    status: { type: "string", enum: ["nouveau", "en_cours", "fermee"] },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            Devis: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    source: { type: "string" },
                    service: { type: "string" },
                    postalCode: { type: "string", nullable: true },
                    city: { type: "string", nullable: true },
                    timing: { type: "string", nullable: true },
                    localType: { type: "string", nullable: true },
                    propertyType: { type: "string", nullable: true },
                    rooms: { type: "string", nullable: true },
                    volume: { type: "string", nullable: true },
                    volumeEstimate: { type: "string", nullable: true },
                    floor: { type: "string", nullable: true },
                    elevator: { type: "boolean", nullable: true },
                    truckAccess: { type: "boolean", nullable: true },
                    surfaceArea: { type: "string", nullable: true },
                    message: { type: "string", nullable: true },
                    fullName: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone: { type: "string" },
                    consent: { type: "boolean" },
                    status: { type: "string", enum: ["nouveau", "traite", "gagne", "perdu"] },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            EmailMessage: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    to: { type: "string", format: "email" },
                    from: { type: "string", format: "email" },
                    subject: { type: "string" },
                    text: { type: "string", nullable: true },
                    html: { type: "string", nullable: true },
                    status: { type: "string", enum: ["queued", "sent", "failed"] },
                    error: { type: "string", nullable: true },
                    relatedContactId: { type: "string", format: "uuid", nullable: true },
                    relatedDevisId: { type: "string", format: "uuid", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                    sentAt: { type: "string", format: "date-time", nullable: true }
                }
            }
        }
    },
    paths: {
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                description: "Creates a new user account and returns tokens. Password must include upper, lower, and number with min length 8. Email must be unique.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["firstName", "lastName", "email", "password"],
                                properties: {
                                    firstName: { type: "string" },
                                    lastName: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string", nullable: true },
                                    password: { type: "string", format: "password" }
                                }
                            },
                            examples: {
                                valid: {
                                    summary: "Register example",
                                    value: {
                                        firstName: "Ada",
                                        lastName: "Lovelace",
                                        email: "ada@example.com",
                                        phone: "+33-600-000-000",
                                        password: "Secure123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: { $ref: "#/components/schemas/User" },
                                        accessToken: { type: "string" },
                                        refreshToken: { type: "string" },
                                        expiresAt: { type: "string", format: "date-time" }
                                    }
                                },
                                examples: {
                                    created: {
                                        summary: "Registration response",
                                        value: {
                                            user: {
                                                id: "b9e1a77a-2b5e-4e5d-a2c7-2d5743f9d0b1",
                                                firstName: "Ada",
                                                lastName: "Lovelace",
                                                email: "ada@example.com",
                                                phone: "+33-600-000-000",
                                                role: "agent",
                                                isActive: true,
                                                isEmailVerified: true,
                                                createdAt: "2026-01-29T10:00:00.000Z",
                                                updatedAt: "2026-01-29T10:00:00.000Z"
                                            },
                                            accessToken: "eyJ...",
                                            refreshToken: "rf_...",
                                            expiresAt: "2026-02-28T10:00:00.000Z"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "409": { description: "Email already registered", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
                }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                description: "Returns access and refresh tokens for a valid user.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", format: "password" }
                                }
                            },
                            examples: {
                                valid: {
                                    summary: "Login example",
                                    value: { email: "admin@example.com", password: "Admin1234" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: { $ref: "#/components/schemas/User" },
                                        accessToken: { type: "string" },
                                        refreshToken: { type: "string" },
                                        expiresAt: { type: "string", format: "date-time" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
                }
            }
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh tokens",
                description: "Rotates the refresh token and issues a new access token.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["refreshToken"],
                                properties: { refreshToken: { type: "string" } }
                            },
                            examples: { valid: { summary: "Refresh example", value: { refreshToken: "rf_..." } } }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "OK",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/AuthTokens" } } }
                    },
                    "401": { description: "Invalid refresh token", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
                }
            }
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout",
                description: "Revokes the provided refresh token.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["refreshToken"],
                                properties: { refreshToken: { type: "string" } }
                            },
                            examples: { valid: { summary: "Logout example", value: { refreshToken: "rf_..." } } }
                        }
                    }
                },
                responses: { "204": { description: "No content" } }
            }
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current user",
                description: "Returns the authenticated user extracted from the access token.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "OK",
                        content: { "application/json": { schema: { type: "object", properties: { user: { type: "object" } } } } }
                    },
                    "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
                }
            }
        },
        "/auth/forgot-password": {
            post: {
                tags: ["Auth"],
                summary: "Request password reset",
                description: "Creates a password reset token. Response includes token for testing.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } },
                            examples: { valid: { summary: "Forgot password", value: { email: "admin@example.com" } } }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { type: "object", properties: { sent: { type: "boolean" }, token: { type: "string", nullable: true } } },
                                examples: { success: { summary: "Reset token generated", value: { sent: true, token: "reset_..." } } }
                            }
                        }
                    }
                }
            }
        },
        "/auth/reset-password": {
            post: {
                tags: ["Auth"],
                summary: "Reset password",
                description: "Resets a password using a valid reset token.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["token", "password"],
                                properties: { token: { type: "string" }, password: { type: "string", format: "password" } }
                            },
                            examples: { valid: { summary: "Reset password", value: { token: "reset_...", password: "NewPass123" } } }
                        }
                    }
                },
                responses: { "204": { description: "No content" } }
            }
        },
        "/auth/change-password": {
            post: {
                tags: ["Auth"],
                summary: "Change password",
                description: "Changes password for the authenticated user.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["currentPassword", "newPassword"],
                                properties: {
                                    currentPassword: { type: "string", format: "password" },
                                    newPassword: { type: "string", format: "password" }
                                }
                            },
                            examples: { valid: { summary: "Change password", value: { currentPassword: "Admin1234", newPassword: "Better123" } } }
                        }
                    }
                },
                responses: { "204": { description: "No content" } }
            }
        },
        "/users": {
            get: {
                tags: ["Users"],
                summary: "List users",
                description: "Admin-only list of users.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/User" } } } },
                                examples: { list: { summary: "Users list", value: { items: [] } } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Users"],
                summary: "Create user",
                description: "Admin-only user creation.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["firstName", "lastName", "email", "password"],
                                properties: {
                                    firstName: { type: "string" },
                                    lastName: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string", nullable: true },
                                    role: { type: "string", enum: ["admin", "agent", "viewer"] },
                                    password: { type: "string", format: "password" }
                                }
                            },
                            examples: { valid: { summary: "Create user", value: { firstName: "Jane", lastName: "Doe", email: "jane@example.com", role: "agent", password: "Secure123" } } }
                        }
                    }
                },
                responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } }
            }
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get user",
                description: "Admin or agent can read users.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } }
            },
            patch: {
                tags: ["Users"],
                summary: "Update user",
                description: "Admin-only update.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    firstName: { type: "string" },
                                    lastName: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string", nullable: true },
                                    role: { type: "string", enum: ["admin", "agent", "viewer"] },
                                    isActive: { type: "boolean" }
                                }
                            },
                            examples: { update: { summary: "Update user", value: { isActive: false } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } }
            },
            delete: {
                tags: ["Users"],
                summary: "Delete user",
                description: "Admin-only deletion.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "204": { description: "No content" } }
            }
        },
        "/contacts": {
            get: {
                tags: ["Contacts"],
                summary: "List contacts",
                description: "Lists contacts with pagination, filters, and search.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
                    { name: "status", in: "query", schema: { type: "string", enum: ["nouveau", "en_cours", "fermee"] } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
                    { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } }
                ],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        items: { type: "array", items: { $ref: "#/components/schemas/Contact" } },
                                        page: { type: "integer" },
                                        limit: { type: "integer" },
                                        total: { type: "integer" }
                                    }
                                },
                                examples: { list: { summary: "Contacts list", value: { items: [], page: 1, limit: 20, total: 0 } } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Contacts"],
                summary: "Create contact",
                description: "Creates a contact entry (public endpoint).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["source", "name", "email", "phone", "message", "consent"],
                                properties: {
                                    source: { type: "string" },
                                    name: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string" },
                                    postalCode: { type: "string", nullable: true },
                                    message: { type: "string" },
                                    consent: { type: "boolean" },
                                    status: { type: "string", enum: ["nouveau", "en_cours", "fermee"] }
                                }
                            },
                            examples: {
                                valid: {
                                    summary: "Create contact",
                                    value: {
                                        source: "contact_form",
                                        name: "Jean Dupont",
                                        email: "jean@example.com",
                                        phone: "+33-620-000-000",
                                        postalCode: "75001",
                                        message: "Need information",
                                        consent: true,
                                        status: "nouveau"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } } } }
            }
        },
        "/contacts/{id}": {
            get: {
                tags: ["Contacts"],
                summary: "Get contact",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } } } }
            },
            patch: {
                tags: ["Contacts"],
                summary: "Update contact",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { type: "object" },
                            examples: { update: { summary: "Update contact", value: { status: "en_cours" } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } } } }
            },
            delete: {
                tags: ["Contacts"],
                summary: "Delete contact",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "204": { description: "No content" } }
            }
        },
        "/contacts/{id}/status": {
            patch: {
                tags: ["Contacts"],
                summary: "Update contact status",
                description: "Updates only the contact status.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["status"],
                                properties: { status: { type: "string", enum: ["nouveau", "en_cours", "fermee"] } }
                            },
                            examples: { update: { summary: "Update status", value: { status: "en_cours" } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } } } }
            }
        },
        "/devis": {
            get: {
                tags: ["Devis"],
                summary: "List devis",
                description: "Lists devis with pagination, filters, and search.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
                    { name: "status", in: "query", schema: { type: "string", enum: ["nouveau", "traite", "gagne", "perdu"] } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
                    { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } }
                ],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/Devis" } }, page: { type: "integer" }, limit: { type: "integer" }, total: { type: "integer" } } } } } } }
            },
            post: {
                tags: ["Devis"],
                summary: "Create devis",
                description: "Creates a devis request (public endpoint).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { type: "object" },
                            examples: {
                                valid: {
                                    summary: "Create devis",
                                    value: {
                                        source: "devis_form",
                                        service: "demenagement",
                                        postalCode: "75002",
                                        city: "Paris",
                                        timing: "next_month",
                                        localType: "apartment",
                                        propertyType: "residential",
                                        rooms: "3",
                                        volume: "20",
                                        volumeEstimate: "25",
                                        floor: "2",
                                        elevator: false,
                                        truckAccess: true,
                                        surfaceArea: "60",
                                        message: "Need a quote",
                                        fullName: "Marie Curie",
                                        email: "marie@example.com",
                                        phone: "+33-610-000-000",
                                        consent: true,
                                        status: "nouveau"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Devis" } } } } }
            }
        },
        "/devis/{id}": {
            get: {
                tags: ["Devis"],
                summary: "Get devis",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Devis" } } } } }
            },
            patch: {
                tags: ["Devis"],
                summary: "Update devis",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { type: "object" },
                            examples: { update: { summary: "Update devis", value: { status: "traite" } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Devis" } } } } }
            },
            delete: {
                tags: ["Devis"],
                summary: "Delete devis",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "204": { description: "No content" } }
            }
        },
        "/devis/{id}/status": {
            patch: {
                tags: ["Devis"],
                summary: "Update devis status",
                description: "Updates only the devis status.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["status"],
                                properties: { status: { type: "string", enum: ["nouveau", "traite", "gagne", "perdu"] } }
                            },
                            examples: { update: { summary: "Update status", value: { status: "gagne" } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Devis" } } } } }
            }
        },
        "/dashboard": {
            get: {
                tags: ["Users"],
                summary: "Dashboard stats",
                description: "Admin dashboard counts for contacts and devis.",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        contacts: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer" },
                                                byStatus: {
                                                    type: "object",
                                                    properties: {
                                                        nouveau: { type: "integer" },
                                                        en_cours: { type: "integer" },
                                                        fermee: { type: "integer" }
                                                    }
                                                }
                                            }
                                        },
                                        devis: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer" },
                                                byStatus: {
                                                    type: "object",
                                                    properties: {
                                                        nouveau: { type: "integer" },
                                                        traite: { type: "integer" },
                                                        gagne: { type: "integer" },
                                                        perdu: { type: "integer" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                examples: {
                                    stats: {
                                        summary: "Dashboard stats",
                                        value: {
                                            contacts: {
                                                total: 14,
                                                byStatus: { nouveau: 6, en_cours: 5, fermee: 3 }
                                            },
                                            devis: {
                                                total: 9,
                                                byStatus: { nouveau: 3, traite: 2, gagne: 2, perdu: 2 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/emails": {
            get: {
                tags: ["Emails"],
                summary: "List emails",
                description: "Lists email messages with pagination, filters, and search.",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
                    { name: "status", in: "query", schema: { type: "string", enum: ["queued", "sent", "failed"] } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
                    { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } }
                ],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/EmailMessage" } }, page: { type: "integer" }, limit: { type: "integer" }, total: { type: "integer" } } } } } } }
            },
            post: {
                tags: ["Emails"],
                summary: "Send email",
                description: "Sends an email via SMTP and stores send result.",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["to", "subject"],
                                properties: {
                                    to: { type: "string", format: "email" },
                                    from: { type: "string", format: "email" },
                                    subject: { type: "string" },
                                    text: { type: "string", nullable: true },
                                    html: { type: "string", nullable: true },
                                    relatedContactId: { type: "string", format: "uuid", nullable: true },
                                    relatedDevisId: { type: "string", format: "uuid", nullable: true }
                                }
                            },
                            examples: {
                                send: {
                                    summary: "Send email",
                                    value: {
                                        to: "contact@debarras-aurea.fr",
                                        subject: "Quote update",
                                        text: "Your quote is ready.",
                                        relatedDevisId: "b9e1a77a-2b5e-4e5d-a2c7-2d5743f9d0b1"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/EmailMessage" } } } } }
            }
        },
        "/emails/{id}": {
            get: {
                tags: ["Emails"],
                summary: "Get email",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/EmailMessage" } } } } }
            },
            patch: {
                tags: ["Emails"],
                summary: "Update email",
                description: "Admin-only manual status updates.",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { status: { type: "string", enum: ["queued", "sent", "failed"] } }
                            },
                            examples: { update: { summary: "Update email", value: { status: "failed" } } }
                        }
                    }
                },
                responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/EmailMessage" } } } } }
            },
            delete: {
                tags: ["Emails"],
                summary: "Delete email",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { "204": { description: "No content" } }
            }
        }
    }
};
