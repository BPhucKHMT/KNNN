import React from 'react';
import DecentralizationTable from '../../components/Table/DecentralizationTable';
import '../../styles/Page/DecentralizationPage.scss'

const DecentralizationPage = () => {
    return (
        <div className="decentralization-page-container">
            <h2 className="decentralization-title">Quản lý phân quyền</h2>
            <DecentralizationTable />
        </div>
    );
};

export default DecentralizationPage;
