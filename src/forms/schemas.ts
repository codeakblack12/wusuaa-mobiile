import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const UpdateProfileSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

export const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("First name is required"),
  newPassword: yup.string()
  .min(8, ({min}) => `Password must be at least ${min} characters`)
  .required('Password is required'),
  cNewPassword: yup.string()
  .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
  .required('Confirm password is required'),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
});
