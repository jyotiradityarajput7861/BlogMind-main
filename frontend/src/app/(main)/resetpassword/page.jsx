'use client'
import React, { useRef, useState } from 'react'
import { Input } from "@nextui-org/react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { InputOtp } from "@heroui/input-otp";
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const [userData, setUserData] = useState(null);
    const [otpValue, setOtpValue] = React.useState("");
    const router = useRouter();

    const emailRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const sendMail = async () => {
        if (!emailRef.current.value) {
            toast.error("Please enter your email");
            return;
        }
        
        setLoading(true);
        setError(false);
        
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/` + emailRef.current.value);
            const data = res.data;
            setUserData(data);
            
            // Send OTP
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/util/send-otp`, {
                recipient: emailRef.current.value
            });
            
            toast.success('OTP sent to your email');
            setOtpSent(true);
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error('Email not found');
            } else {
                toast.error('Something went wrong');
                console.log(err);
            }
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    const verifyOTP = async () => {
        if (otpValue.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }
        
        setLoading(true);
        
        try {
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/util/verify-otp`, {
                email: emailRef.current.value,
                otp: otpValue
            });
            
            toast.success('OTP verified successfully');
            
            // Navigate to password update page with user ID
            if (userData && userData._id) {
                router.push('/updatepassword/' + userData._id);
            } else {
                toast.error('User data not found');
            }
        } catch (error) {
            console.log(error);
            toast.error('Invalid OTP or verification failed');
        } finally {
            setLoading(false);
        }
    }

    const MailIcon = (props) => {
        return (
            <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="1em"
                role="presentation"
                viewBox="0 0 24 24"
                width="1em"
                {...props}
            >
                <path
                    d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
                    fill="currentColor"
                />
            </svg>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive an OTP for password reset
                    </p>
                </div>
                
                <div className="mt-8 space-y-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Input
                                ref={emailRef}
                                isClearable
                                isRequired
                                className="max-w-xs"
                                placeholder="your.email@example.com"
                                label="Email"
                                type="email"
                                startContent={
                                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                isDisabled={loading || otpSent}
                            />
                            <button 
                                onClick={sendMail} 
                                disabled={loading}
                                className={`text-white px-4 py-2 rounded transition-all ${loading ? 
                                  'bg-gray-400 cursor-not-allowed' : 
                                  'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'}`}
                            >
                                {loading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                            </button>
                        </div>
                        
                        {otpSent && (
                            <div className="mt-6 flex flex-col items-center gap-4">
                                <p className="text-sm text-gray-600 mb-2">Enter the 6-digit OTP sent to your email</p>
                                                <InputOtp length={6} value={otpValue} color='secondary' onValueChange={setOtpValue} />
                <div className="text-small text-default-500">
                    OTP value: <span className="text-md font-medium">{otpValue}</span>
                </div>
                                
                                <button 
                                    onClick={verifyOTP} 
                                    disabled={loading || otpValue.length !== 6}
                                    className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        loading || otpValue.length !== 6 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP & Reset Password'}
                                </button>
                                
                                <div className="text-xs text-gray-500 mt-2">
                                    Didn&apos;t receive the OTP? <button 
                                        onClick={sendMail}
                                        className="text-blue-600 hover:text-blue-800"
                                        disabled={loading}
                                    >
                                        Resend
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => router.push('/')} 
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;