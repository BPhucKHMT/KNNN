import React from 'react';
import StudentTable from '../../components/Table/StudentTable';
import '../../styles/Page/StudentsPage.scss'

const StudentsPage = () => {
    return (
        <div className="students-page-container">
            <h2 className="students-title">Tiếp nhận học sinh</h2>
            <StudentTable />
        </div>
    );
};

export default StudentsPage;
