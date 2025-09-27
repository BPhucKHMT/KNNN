import React from 'react';
import SchoolYearTable from '../../components/Table/SchoolYearTable';
import '../../styles/Page/SchoolYearsPage.scss';

const SchoolYearsPage = () => {
    return (
        <div className="schoolyears-page-container">
            <h2 className="schoolyears-title">Quản lý năm học</h2>
            <SchoolYearTable />
        </div>
    );
};

export default SchoolYearsPage;