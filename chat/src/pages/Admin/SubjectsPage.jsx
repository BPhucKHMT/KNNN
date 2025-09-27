import React from 'react';
import SubjectTable from '../../components/Table/SubjectTable';
import '../../styles/Page/SubjectsPage.scss';
const SubjectsPage = () => {
    return (
        <div className="subjects-page-container">
            <h2 className="subjects-title">Danh sách môn học</h2>
            <SubjectTable />
        </div>
    );
};

export default SubjectsPage;