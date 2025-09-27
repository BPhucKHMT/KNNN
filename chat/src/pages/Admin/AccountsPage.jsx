import React from 'react';
import AccountTable from '../../components/Table/AccountTable';
import '../../styles/Page/AccountsPage.scss'

const AccountsPage = () => {
    return (
        <div className="accounts-page-container">
            <h2 className="accounts-title">Quản lý tài khoản</h2>
            <AccountTable />
        </div>
    );
};

export default AccountsPage;
