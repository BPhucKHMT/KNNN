import { useState } from 'react';
import { toast } from 'react-toastify';

const useForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        toast.success("If this email is registered, a reset link has been sent!");
        setEmail("");
    };

    return {
        email,
        setEmail,
        handleSubmit
    };
};

export default useForgotPassword;
