import React from 'react';
import ClassTable from '../../components/Table/ClassTable';
import '../../styles/Page/ClassesPage.scss'

const ClassesPage = () => {
    return (
        <div className="classes-page-container">
            <h2 className="classes-title">Quản lý lớp học</h2>
            <ClassTable />
        </div>
    );
};

export default ClassesPage;
