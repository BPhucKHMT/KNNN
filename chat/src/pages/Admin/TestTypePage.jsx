import React from 'react';
import '../../styles/Page/TestTypePage.scss'
import TestTypeTable from '../../components/Table/TestTypeTable';

const TestTypePage = () => {
    return (
        <div className="testtype-page-container">
            <h2 className="testtype-title">Loại kiểm tra</h2>
            <TestTypeTable />
        </div>
    );
};

export default TestTypePage;
