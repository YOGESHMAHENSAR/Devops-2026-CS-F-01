import React, { useState } from 'react'
import {useFormik} from "formik";
import * as Yup from "Yup";
import { TextField, Button, Typography, Stack, Alert, Link, Divider} from '@mui/material';
import GoogleAuthButton from './GoogleAuthButton.jsx';
import {login, signup} from "../api/auth.js"

const loginSchema = Yup.object({
    email: Yup.string().email("Enter valid Email").required("Email is required field"),
    password: Yup.string().required("Password is required!"),
})

const signUpSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Enter valid Email").required("Email is required field"),
    password: Yup.string().min(6, "Password must be of 6 character long!").required("Password is required!"),
})

export default function CredentialsForms({role, onBack, onAuthSuccess}) {
    let [mode, setMode] = useState("login");
    let [serverError, SetServerError] = useState("")

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: mode === "login" ? loginSchema : signUpSchema,
        enableReinitialize: true,
        onSubmit:
            async (value, {setSubmitting}) => {
                SetServerError("");
                const payload = {...value, role};
                // console.log("payload is:", payload);
                const {ok, body} = mode === "login" ? await login(payload): await signup(payload);
                setSubmitting(false);

                if(!ok){
                    SetServerError(body.message || "Something went wrong, Please try again Later!");
                    return;
                }
                // console.log("body is :", body);
                // console.log("token is :", body.token);
                localStorage.setItem('token', body.token);
                localStorage.setItem('user', JSON.stringify(body.user));
                onAuthSuccess(body.user);
            }
    })
    return (
        <Stack spacing={2}>
            {/* for google btn */}
            <GoogleAuthButton role={role} onAuthSuccess={onAuthSuccess} onError={SetServerError} />

            <Divider>or</Divider> 

            <Button onClick={onBack} size="small" sx={{ alignSelf: 'flex-start' }}>
                ← Change role
            </Button>
        
            <Typography variant="h5" color="primary.main">
                {mode === 'login' ? 'Log in' : 'Create account'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                as {role === 'jobseeker' ? 'professional' : 'recruiter'}
            </Typography>
        
            <form onSubmit={formik.handleSubmit} noValidate>
                <Stack spacing={2}>
                {mode === 'signup' && (
                    <TextField
                        name="name"
                        label="Full name"
                        fullWidth
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                )}
        
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
        
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
        
                {serverError && <Alert severity="error">{serverError}</Alert>}
        
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
                </Button>
                </Stack>
            </form>
        
            <Link
                component="button"
                type="button"
                variant="body2"
                style={{marginBottom: '1rem', textDecoration: 'none'}}
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                sx={{ color: 'secondary.main' }}
            >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </Link>
        </Stack>
    );
}
