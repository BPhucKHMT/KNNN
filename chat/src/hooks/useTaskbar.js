import { useState } from 'react';
//import 4/6/2025
import { logoutUser } from '../services/userServices';
import { useNavigate } from 'react-router-dom'; 
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const useTaskbar = () => {

//   //ẩn hiện ui ( chưa xong )
   const {isAvailable} = useContext(UserContext);
   

  const [expandedMenus, setExpandedMenus] = useState({
    classManagement: false,
    subjectManagement: false,
    reportManagement: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const Navigate = useNavigate();
  const {   logoutContext} = useContext(UserContext);
  const handleLogout = async () =>{
    let response = await logoutUser(); // clear cookie
    localStorage.removeItem('jwt') //clear storage
    logoutContext();//clear user
    if(response && +response.data.EC === 0){
        toast.success("Đăng xuất thành công");
        console.log("Đăng xuất thành công");
        Navigate('/')
    }else{
      toast.error(data.EM)
    }
  }

  return {
    expandedMenus,
    toggleMenu,
    handleLogout,
    isAvailable
  };
};

export default useTaskbar;
