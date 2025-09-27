import { useState, useEffect, useCallback } from 'react';
import { getClassListByNameAndYear, removeStudentFromClass, addStudentToClass, getStudentsOfClass} from '../services/classListService';
import { toast } from 'react-toastify';
import useModal from './useModal';
import { getAllParameters } from '../services/paramenterService';

import useDebounce from './useDebounce'; //Tránh fetch liên tục

const useClassListTable = (selectedYear, selectedClass, setParentStudentCount) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [classListId, setClassListId] = useState(null);
    //Search
    const [searchTerm, setSearchTerm] = useState('');
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10, // Số học sinh mỗi trang
    });        
    //Sort 
    const [sortField, setSortField] = useState('HoTen');
    const [sortOrder, setSortOrder] = useState('asc');
      
    const studentListModal = useModal();
    // Sử dụng debounce cho searchTerm để tối ưu
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Xóa học sinh khỏi danh sách lớp
    const deleteModal = useModal();
    const [dataModal, setDataModal] = useState(null);

    //New state cho sỉ số của lớp
    const [maxClassSize, setMaxClassSize] = useState(null);
    useEffect(() => {
        const fetchSystemParameters = async () => {
            try {
                const response = await getAllParameters();
                if (response.data && response.data.EC === 0) {
                    const params = response.data.DT;
                    const siSoToiDaParam = params.find(p => p.TenThamSo === 'SiSoToiDa');
                    if (siSoToiDaParam) {
                        setMaxClassSize(parseInt(siSoToiDaParam.GiaTri, 10));
                    } else {
                        toast.error("Không tìm thấy quy định về Sĩ số tối đa trong hệ thống.");
                        setMaxClassSize(40); // Đặt một giá trị mặc định an toàn
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải quy định hệ thống:", error);
                toast.error("Không thể tải quy định về sĩ số.");
                setMaxClassSize(40); // Đặt một giá trị mặc định an toàn khi có lỗi
            }
        };
        fetchSystemParameters();
    }, []); 

    //Lấy ID của danh sách lớp trước
    const fetchClassListData = useCallback(async (isInitialLoad = false) => {
        if (!selectedYear || !selectedClass) {
            setStudents([]);
            setClassListId(null);
            setPagination(p => ({ ...p, totalItems: 0, totalPages: 1, currentPage: 1 }));
            if (setParentStudentCount) setParentStudentCount(0);
            return;
        }

        setLoading(true);
        try {
            // Bước 1: Lấy thông tin lớp
            const classInfoResponse = await getClassListByNameAndYear(selectedClass, selectedYear);

            if (classInfoResponse.data && classInfoResponse.data.EC === 0 && classInfoResponse.data.DT.length > 0) {
                // CÓ LỚP, TIẾP TỤC LẤY HỌC SINH
                const classData = classInfoResponse.data.DT[0];
                const newClassId = classData.MaDanhSachLop;
                setClassListId(newClassId);
                if (setParentStudentCount) setParentStudentCount(classData.SiSo || 0);

                const studentResponse = await getStudentsOfClass(newClassId, {
                    page: pagination.currentPage,
                    limit: pagination.limit,
                    search: debouncedSearchTerm,
                    sortField,
                    sortOrder
                });

                if (studentResponse.data && studentResponse.data.EC === 0) {
                    const studentData = studentResponse.data.DT;
                    setStudents(studentData.students || []);
                    setPagination({
                        totalItems: studentData.totalItems,
                        totalPages: studentData.totalPages,
                        currentPage: studentData.currentPage,
                        limit: studentData.limit || 10,
                    });
                } else {
                    setStudents([]);
                    setPagination(p => ({ ...p, totalItems: 0, totalPages: 1, currentPage: 1 }));
                }

            } else {
                // CHƯA CÓ LỚP
                if (isInitialLoad) {
                    toast.warn(`Lớp ${selectedClass} - Năm học ${selectedYear} chưa được tạo.`);
                }
                setClassListId(null);
                setStudents([]);
                setPagination(p => ({ ...p, totalItems: 0, totalPages: 1, currentPage: 1 }));
                if (setParentStudentCount) setParentStudentCount(0);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.EM || 'Lỗi kết nối máy chủ.';
            if (isInitialLoad) toast.error(errorMessage);
            setClassListId(null);
            setStudents([]);
            setPagination(p => ({ ...p, totalItems: 0, totalPages: 1, currentPage: 1 }));
            if (setParentStudentCount) setParentStudentCount(0);
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedClass, pagination.currentPage, pagination.limit, debouncedSearchTerm, sortField, sortOrder, setParentStudentCount]);


    // useEffect ĐỂ GỌI API KHI CÁC THAM SỐ THAY ĐỔI 
    useEffect(() => {
        setPagination(p => ({ ...p, currentPage: 1 }));
    }, [debouncedSearchTerm, selectedYear, selectedClass]); // Thêm selectedYear/Class để reset trang khi đổi lớp/năm học

     useEffect(() => {
        fetchClassListData(true);
    }, [fetchClassListData]); // Dependency array chỉ còn hàm fetch chính

   const handleSearchChange = (value) => {
    setSearchTerm(value);       
    setCurrentPage(1);
};

const handleRemoveStudent = (maCT_DSL) => {
  setDataModal(maCT_DSL);     
  deleteModal.open();
};
    const confirmRemoveStudent = async (maCT_DSL) => {
        try {
            const response = await removeStudentFromClass(maCT_DSL);
            if (response.data && response.data.EC === 0) {
                toast.success(response.data.EM || 'Xóa học sinh thành công');
            } else {
                toast.error(response.data?.EM || 'Không thể xóa học sinh');
            }
            fetchClassListData();
        } catch (error) {
            console.log(error);
            // Nếu lỗi không thể xóa học sinh do còn tồn tại điểm
            if (error?.response?.data?.EC === 1 && error?.response?.data?.DT > 0) {
                toast.error(error?.response?.data?.EM || 'Không thể xóa học sinh do còn tồn tại điểm');
            }else{
                console.error('Error removing student:', error);
                toast.error('Lỗi kết nối máy chủ');
            }
        } finally {
            deleteModal.close();
        }
    };


const handleAddStudents = async (selectedStudentIds) => {
    if (!selectedStudentIds || !selectedStudentIds.length) {
        toast.warn('Vui lòng chọn học sinh.');
        return;
    }

    setLoading(true);
    studentListModal.close();

    try {
        // BƯỚC 1: LUÔN KIỂM TRA LẠI VỚI SERVER ĐỂ LẤY DỮ LIỆU MỚI NHẤT
        // Không được tin vào state `classListId` ở đây.
        // Giá trị của classListRespone bao gồm {}
        let classListResponse = await getClassListByNameAndYear(selectedClass, selectedYear).catch(() => null);
        
        // Lấy ID và sỉ số hiện tại từ kết quả vừa gọi
        let currentClassId = classListResponse?.data?.DT[0]?.MaDanhSachLop;
        let currentSize = classListResponse?.data?.DT[0]?.SiSo || 0;
        // Nếu chưa có danh sách lớp vẫn truyền TenLop và TenNamHoc cho BE
        const addPromises = selectedStudentIds.map(studentId =>
            addStudentToClass({ 
                MaDanhSachLop: currentClassId, 
                MaHocSinh: studentId ,
                TenLop: selectedClass,
                TenNamHoc: selectedYear
            }).catch(err => ({ error: err }))
        );
        let results = await Promise.all(addPromises);
        let successCount = 0;
        let errorMessages = [];
        results.forEach(result => {
           if (result && !result.error && result.data?.EC === 0) {
                successCount++;
            } else if (result && result.data?.EM) {
                errorMessages.push(result.data.EM);
            }
        });
        if(successCount >0 ){
            toast.success(`Đã thêm thành công ${successCount} học sinh.`);
        }

        if (errorMessages.length > 0) {
            // Nếu có lỗi, hiển thị thông báo lỗi
             errorMessages.forEach(msg => toast.error(msg));            
        } 
    } catch (error) {
        // Bắt tất cả các lỗi từ việc tạo lớp, kiểm tra sĩ số, v.v.
        toast.error(error.message || "Đã có lỗi nghiêm trọng xảy ra.");
        console.error("Lỗi trong quá trình thêm học sinh:", error);
    } finally {
        // BƯỚC 5: LUÔN FETCH LẠI DỮ LIỆU ĐỂ CẬP NHẬT GIAO DIỆN
        await fetchClassListData();
        setLoading(false);
    }
};   

 const handlePageChange = async (event) => {
    const page = event.selected + 1;
    setPagination(prev => ({ ...prev, currentPage: page }));
    // await fetchStudents();
 }

   const handleSortChange = (field) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    if (field === sortField) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

    return {
        students: students,
        loading,
        searchTerm,
        studentListModal,
        pagination,
        currentPage,
        deleteModal,
        dataModal,
        handleSearchChange,
        confirmRemoveStudent,
        handleAddStudents,
        handleRemoveStudent,
        handlePageChange,
        handleSortChange,
        fetchStudents: fetchClassListData,
        classListId,
        maxClassSize,
        

    };
};

export default useClassListTable;