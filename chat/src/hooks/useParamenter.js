import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { updateParameter, getAllParameters } from '../services/paramenterService';
// Bỏ import liên quan đến năm học ra khỏi hook này

const useParamenterTable = () => {
    const [loading, setLoading] = useState(false);
    const [parameterList, setParameterList] = useState([]);

    const fetchParamenterList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllParameters();
            if (res?.data?.EC === 0) {
                setParameterList(res.data.DT || []);
            } else {
                setParameterList([]);
                toast.error(res?.data?.EM || "Lỗi khi tải danh sách tham số");
            }
        } catch (error) {
            console.error("Error fetching parameters:", error);
            setParameterList([]);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }, []); // useCallback với mảng rỗng

    useEffect(() => {
        fetchParamenterList();
    }, [fetchParamenterList]);

    const handleUpdateParamenter = async (parameterKey, data) => {
        setLoading(true);
        try {
            const res = await updateParameter(parameterKey, data);
            if (res?.data?.EC === 0) {
                toast.success(res?.data?.EM || "Cập nhật tham số thành công");
                // Fetch lại danh sách tham số để UI cập nhật 
            } else { 
                toast.error(res?.data?.EM || "Cập nhật tham số thất bại");
            }
            fetchParamenterList();
        } catch (error) {
            console.error("Error updating parameter:", error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        parameterList,
        handleUpdateParamenter,
    };
};

export default useParamenterTable;