"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.resetPasswordController = exports.forgotPassword = exports.me = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.validated.body;
    const user = await (0, auth_service_1.registerUser)({ firstName, lastName, email, phone, password });
    const tokens = await (0, auth_service_1.issueTokens)(user.id, user.role);
    res.status(201).json({ user, ...tokens });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.validated.body;
    const user = await (0, auth_service_1.loginUser)(email, password);
    const tokens = await (0, auth_service_1.issueTokens)(user.id, user.role);
    res.json({ user, ...tokens });
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.validated.body;
    const tokens = await (0, auth_service_1.rotateRefreshToken)(refreshToken);
    res.json(tokens);
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const { refreshToken } = req.validated.body;
    await (0, auth_service_1.revokeRefreshToken)(refreshToken);
    res.status(204).send();
};
exports.logout = logout;
const me = async (req, res) => {
    res.json({ user: req.user });
};
exports.me = me;
const forgotPassword = async (req, res) => {
    const { email } = req.validated.body;
    const result = await (0, auth_service_1.createPasswordReset)(email);
    res.json({ sent: Boolean(result), token: result?.token });
};
exports.forgotPassword = forgotPassword;
const resetPasswordController = async (req, res) => {
    const { token, password } = req.validated.body;
    await (0, auth_service_1.resetPassword)(token, password);
    res.status(204).send();
};
exports.resetPasswordController = resetPasswordController;
const changePasswordController = async (req, res) => {
    const { currentPassword, newPassword } = req.validated.body;
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await (0, auth_service_1.changePassword)(req.user.id, currentPassword, newPassword);
    res.status(204).send();
};
exports.changePasswordController = changePasswordController;
