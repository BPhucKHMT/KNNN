import { useState, useContext } from 'react';
import { toast } from 'react-toastify';

//đang sửa
import { loginUser } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const useLogin = () => {
  let Navigate = useNavigate(); //mới import 
  const { loginContext } = useContext(UserContext); // mới import
  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [objValidInput, setObjValidInput] = useState({
    isValidValueLogin: true,
    isValidPassword: true,
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    if (!valueLogin) {
      setObjValidInput({ ...objValidInput, isValidValueLogin: false });
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!password) {
      setObjValidInput({ ...objValidInput, isValidPassword: false });
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    let response = await loginUser(valueLogin, password);
    if (response.data && +response.data.EC === 0) {
      //sucess
      let groupWithPermissions = response.data.DT.groupWithPermissions;
      let username = response.data.DT.username;
      let token = response.data.DT.access_token;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithPermissions, username },
      };
      localStorage.setItem("jwt", token);
      loginContext(data); //login context 


      // Navigate("/admin/home"); // fix sau
      toast.success("Đăng nhập thành công");
      window.location.href = "/admin/home";

    }
    else {
      toast.error("Email hoặc mật khẩu không chính xác");
    }
    // if (response && response.data && +response.EC !== 0) {
    //   //error
    //   toast.error(response.data.EM);
    // }

  };

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return {
    valueLogin,
    password,
    objValidInput,
    setValueLogin,
    setPassword,
    handleLogin,
    handlePressEnter,
    showPassword,
    setShowPassword
  };
};

export default useLogin;
