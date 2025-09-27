import React from 'react';
import '../../styles/Page/Login.scss';
import education from '../../assets/education.jpg';
import useLogin from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login1 = props => {
    const {
        valueLogin,
        password,
        showPassword,
        objValidInput,
        setValueLogin,
        setPassword,
        setShowPassword,
        handleLogin,
        handlePressEnter
    } = useLogin();

    return (
        <div className="login-container ">
            <div className="container">
                <div className="row">

                    <div className="main-content col-12 col-xl-4 d-flex flex-column gap-3 py-3 px-3">
                        <div className="brand d-flex justify-content-center align-items-center mb-2">
                            <img src={education} className="logo d-none d-sm-block" alt="student-icon" width="50" height="50" />
                            <h4>WEBSITE QUẢN LÝ HỌC SINH</h4>
                        </div>
                        <input
                            type="text"
                            className={objValidInput.isValidValueLogin ? "form-control" : "is-invalid form-control"}
                            placeholder="Email"
                            value={valueLogin}
                            onChange={(event) => setValueLogin(event.target.value)}
                        />
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={objValidInput.isValidPassword ? "form-control" : "is-invalid form-control"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                onKeyDown={handlePressEnter}
                            />
                            <span
                                className="toggle-password position-absolute me-3"
                                style={{ cursor: "pointer", top: "50%", right: "10px", transform: "translateY(-50%)" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>

                        </div>
                        <button className="btn btn-primary" onClick={handleLogin}>Đăng nhập</button>

                    </div>

                    <div className="main-image d-none d-xl-block col-xl-8 d-flex justify-content-center align-items-center">
                        <img alt=""
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

export default Login1;
