import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllSchoolYear } from '../services/paramenterService';
import { getAllClasses } from '../services/classService';

//Xử lý danh sách lớp khi người dùng chọn lớp và năm học
const useClassesListPage = () => {
    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const yearResponse = await getAllSchoolYear();
            const classResponse = await getAllClasses();

            if (yearResponse?.data && Array.isArray(yearResponse.data.data)) {
                    const schoolYears = yearResponse.data.data || [];
                    // Sắp xếp năm học mới nhất lên đầu (cải thiện UX)
                    const sortedYears = schoolYears.sort((a, b) => b.TenNamHoc.localeCompare(a.TenNamHoc));
                    setYears(sortedYears);
                    // Tự động chọn năm học mới nhất làm mặc định
                    if (sortedYears.length > 0) {
                        setSelectedYear(sortedYears[0].TenNamHoc);
                    }
                } else {
                    toast.error(yearResponse?.data?.EM || 'Không thể tải danh sách năm học');
                }

           // Xử lý API lớp học
                if (classResponse?.data?.EC === 0) {
                    // Vì không có phân trang, backend trả về trực tiếp mảng dữ liệu trong DT
                    const classData = classResponse.data.DT || [];
                    setClasses(classData);
                    // Tự động chọn lớp đầu tiên làm mặc định
                    if (classData.length > 0) {
                        setSelectedClass(classData[0].TenLop);
                    }
                } else {
                    toast.error(classResponse?.data?.EM || 'Không thể tải danh sách lớp');
                }

        } catch (error) {
            console.error('Error fetching class lists:', error);
            toast.error('Error fetching class lists');
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const handleClassChange = (value) => {
        setSelectedClass(value);
    };

    return {
        years,
        classes,
        selectedYear,
        selectedClass,
        studentCount,
        loading,
        handleYearChange,
        handleClassChange,
        setStudentCount
    };
};

export default useClassesListPage;