import React from 'react';
import GradeTable from '../../components/Table/GradeTable';
import '../../styles/Page/GradesPage.scss'

const GradesPage = () => {
    return (
        <div className="grades-page-container">
            <h2 className="grades-title">Quản lý khối lớp</h2>
            <GradeTable />
        </div>
    );
};

export default GradesPage;
