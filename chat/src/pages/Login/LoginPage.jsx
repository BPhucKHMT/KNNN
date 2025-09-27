import React from 'react';
import '../../styles/Page/Login.scss';
import education from '../../assets/education.jpg';
import useLogin from '../../hooks/useLogin';

const LoginPage = () => {
    const { valueLogin, password, objValidInput, setValueLogin, setPassword, handleLogin, handlePressEnter } = useLogin();

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="container">
                <div className="col">
                    <div className="Welcome mx-auto mb-5 col-12 col-sm-12 text-center">
                        <span className="brand">Welcome , Log into your account</span>
                    </div>
                    <div className="main-content mx-auto mb-5 col-12 col-sm-8 col-xl-4 d-flex flex-column gap-3 py-3 px-3">
                        <div className="brand d-flex justify-content-center align-items-center mb-2">
                            <img src={education} className="logo d-none d-sm-block" alt="student-icon" width="50" height="50" />
                            <h4>WEBSITE QUẢN LÝ HỌC SINH</h4>
                        </div>
                        <input
                            type="text"
                            className={objValidInput.isValidValueLogin ? "form-control" : "is-invalid form-control"}
                            placeholder="Email address or your phone number"
                            value={valueLogin}
                            onChange={(event) => setValueLogin(event.target.value)}
                        />
                        <input
                            type="password"
                            className={objValidInput.isValidPassword ? "form-control" : "is-invalid form-control"}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={(event) => handlePressEnter(event)}
                        />

                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>

                        <span className="text-center">
                            <a className="forgot-password" href="#">
                                Forgot your password?
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
