import '../../styles/Page/InfoPage.scss';
import { UserContext } from '../../context/UserContext';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword } from '../../services/userServices';
import { uploadAvatar } from '../../services/userServices';
const InfoPage = () => {
    const { user } = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    //avatar
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleChangePassword = (e, type) => {
        if (type === 'oldPassword') {
            setOldPassword(e.target.value);
        } else if (type === 'newPassword') {
            setNewPassword(e.target.value);
        } else if (type === 'confirmNewPassword') {
            setConfirmNewPassword(e.target.value);
        }
    }

    const CheckPassword = (oldPassword, newPassword, confirmNewPassword) => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin mật khẩu");
            return false;
        }
        else if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return false;
        }
        else if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return false;
        }
        return true;
    }

    const UpdatePassword = async () => {
        if (CheckPassword(oldPassword, newPassword, confirmNewPassword)) {
            let data = {
                TenDangNhap: user.account.username,
                MatKhauCu: oldPassword,
                MatKhauMoi: newPassword,
                XacNhanMatKhau: confirmNewPassword
            }
            let response = await changePassword(data);
            if (response && +response.data.EC === 0) {
                toast.success(response.data.EM);
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                toast.error(response.data.EM);
            }
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    const handleUploadAvatar = async () => {
        if (!avatarFile) {
            toast.error("Vui lòng chọn ảnh trước");
            return;
        }

        const formData = new FormData();
        formData.append("Avatar", avatarFile);
        formData.append("TenDangNhap", user.account.username);

        try {
            const response = await uploadAvatar(formData);
            if (response && response.data.EC === 0) {
                toast.success("Cập nhật avatar thành công");
            } else {
                toast.error(response.data.EM || "Lỗi cập nhật avatar");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật avatar:", error);
            toast.error("Lỗi kết nối máy chủ");
        }
    };

    return (
        <div className="info-page-container">
            <div className='info-card'>
                <h2>Thông tin cá nhân</h2>

                <div className="info-avatar">
                    <img
                        src={avatarPreview ? avatarPreview : `${user.account.Avatar}`}
                        alt="Avatar"
                        className="avatar-preview"
                    />
                    <div className="d-flex flex-column gap-3">
                        <input type="file" accept="image/*" onChange={handleAvatarChange} />
                        <button onClick={handleUploadAvatar} className="btn-primary ">Cập nhật avatar</button>
                    </div>
                </div>

                <div className="info-section">
                    <label>Email:</label>
                    <input type="text" placeholder="student@example.com" disabled value={user.account.username} />
                </div>

                <div className="info-section">
                    <label>Họ và tên:</label>
                    <input type="text" placeholder="Nguyễn Văn A" disabled value={user.account.HoTen} />
                </div>
            </div>
            <div className='info-card'>
                <h3>Đổi mật khẩu</h3>

                <div className="info-section">
                    <label>Mật khẩu hiện tại:</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => handleChangePassword(e, 'oldPassword')} />
                </div>

                <div className="info-section">
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => handleChangePassword(e, 'newPassword')}
                    />
                </div>

                <div className="info-section">
                    <label>Nhập lại mật khẩu mới:</label>
                    <input type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmNewPassword}
                        onChange={(e) => handleChangePassword(e, 'confirmNewPassword')}
                    />
                </div>

                <button className="btn-save" onClick={UpdatePassword}>Đổi mật khẩu</button>
            </div>
        </div>
    );
};

export default InfoPage;
