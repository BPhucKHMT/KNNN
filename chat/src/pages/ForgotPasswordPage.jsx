import React from 'react';
import '../styles/Page/Login.scss';
import education from '../assets/education.jpg';
import useForgotPassword from '../hooks/useForgotPassword';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const { email, setEmail, handleSubmit } = useForgotPassword();

    return (
        <div className="login-container">
            <div className="container">
                <div className="row">
                    <div className="main-content col-12 col-xl-4 d-flex flex-column gap-3 py-3 px-3">
                        <div className="brand d-flex justify-content-center align-items-center mb-2">
                            <img src={education} className="logo d-none d-sm-block" alt="education-icon" width="50" height="50" />
                            <h4>Đặt lại mật khẩu</h4>
                        </div>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập địa chỉ email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Gửi link đặt lại mật khẩu
                        </button>

                        <span className="text-center">
                            <Link className="forgot-password" to="/">
                                Trở về đăng nhập
                            </Link>
                        </span>
                    </div>

                    <div className="main-image d-none d-xl-block col-xl-8 d-flex justify-content-center align-items-center">
                        <img
                            alt=""
                            loading="lazy"
                            src="https://ddasf3j8zb8ok.cloudfront.net/new-website/images/cp-form-pic.svg"
                            className="img-fluid"
                            width="100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
