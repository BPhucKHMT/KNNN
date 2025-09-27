import React from 'react';
import '../../styles/Page/HomePage.scss';
import dashboardImage from '../../assets/dashboard.webp';

const HomePage = () => {
    return (
        <div className="home-page-container">
            <div className="home-content-wrapper">
                <div className="home-text">
                    <h1>🎓 Chào mừng đến với Hệ thống Quản lý Học sinh</h1>
                    <p>
                        Quản lý học sinh, lớp học, điểm số và nhiều hơn nữa một cách hiệu quả.
                        Khám phá ngay bảng điều khiển và các chức năng tiện lợi!
                    </p>
                </div>
                <div className="home-image">
                    <img src={dashboardImage} alt="Dashboard Illustration" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
