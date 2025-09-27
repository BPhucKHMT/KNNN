import { Outlet } from 'react-router-dom';
import Taskbar from '../../components/Taskbar/Taskbar';
import Header from '../../components/Header';

const AdminPage = () => {
    return (
        <>
            <Header />
            <div className="flex min-h-screen">
                <Taskbar />
                <div className="flex-1 p-4 bg-gray-100">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminPage;
