"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.forgotPassword = forgotPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const JWT_SECRET = process.env.JWT_SECRET || 'evision_enterprise_jwt_secret_2026_super_secure_key';
async function register(req, res) {
    try {
        const { name, email, phone, password, city, state, evModel } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required.' }
            });
        }
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' }
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.default.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                passwordHash,
                city: city || null,
                state: state || null,
                evModel: evModel || null,
                role: 'USER'
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    city: user.city,
                    state: user.state,
                    evModel: user.evModel
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to register account at this time.' }
        });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_INPUT', message: 'Email and password are required.' }
            });
        }
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' }
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    city: user.city,
                    state: user.state,
                    evModel: user.evModel
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'An error occurred while logging in.' }
        });
    }
}
async function getMe(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' }
            });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                city: true,
                state: true,
                evModel: true,
                preferredLanguage: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' }
            });
        }
        return res.status(200).json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Unable to retrieve user profile.' }
        });
    }
}
async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: { code: 'USER_NOT_FOUND', message: 'No registered user found with that email address.' }
        });
    }
    // Simulated verification dispatch
    return res.status(200).json({
        success: true,
        data: { message: `A password reset link has been dispatched to ${email}.` }
    });
}
