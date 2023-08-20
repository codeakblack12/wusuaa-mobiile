export type LoginFormData = {
    email: string;
    password: string;
    platform: string;
};

export type UpdateProfileFormData = {
    email: string;
    firstName: string;
    lastName: string;
};

export type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    cNewPassword: string;
};

export type ForgotPasswordFormData = {
    email: string;
};