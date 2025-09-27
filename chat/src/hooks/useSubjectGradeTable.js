import { useState, useEffect, useCallback } from "react";
import subjectGradeService from "../services/subjectGradeService";
import { toast } from "react-toastify";
import _, { set } from "lodash";

const useSubjectGradeTable = (filters) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [testTypes, setTestTypes] = useState([]);
  const [addTestTypeModalOpen, setAddTestTypeModalOpen] = useState(false);

  //New state cho chức năng tìm kiếm + phân trang + sort
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: 'HoTen', order: 'ASC' });


  // Fetch test types from DB
  useEffect(() => {
    subjectGradeService.getTests().then(res => {
      //Giả sử API trả về toàn bộ loại kiểm tra
      if (Array.isArray(res.data?.data)) setTestTypes(res.data.data);
    });
  }, []);

  // useEffect(() => {
  //   if (!filters || !filters.class || !filters.semester || !filters.year || !filters.subject) {
  //     setGrades([]);
  //     setError("Vui lòng chọn đầy đủ bộ lọc để xem bảng điểm.");
  //     return;
  //   }

    const fetchData = useCallback(async () => {
      if (!filters || !filters.class || !filters.semester || !filters.year || !filters.subject) {
        setGrades([]);
        setError("Vui lòng chọn đầy đủ bộ lọc để xem bảng điểm.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const params = {
          tenLop: filters.class,
          tenHocKy: filters.semester,
          tenNamHoc: filters.year,
          tenMonHoc: filters.subject,
          page: currentPage,
          limit: limit,
          search: searchTerm,
          sortField: sortConfig.field,
          sortOrder: sortConfig.order
        }
        
        const res = await subjectGradeService.getSubjectSummary(params);
        if (res?.data?.EC === 0 && res?.data?.DT?.EC === -1) {
          setGrades([]);
          setError(res.data.DT.EM || "Lỗi khi truy vấn dữ liệu");
          return;
        }
        if (res?.data?.EC === 0 && res.data.DT?.DT) {
          const {count, rows} = res.data.DT.DT.DiemChiTiet;
          setGrades(
            rows.map((item) => ({
              id: item.MaHocSinh,
              name: item.HoTen,
              diemTP: item.DiemTP || [],
              diemTB: item.DiemTB,
            }))
          );
          setTotalPages(Math.ceil(count/limit));
          if(rows.length === 0 ){
            setError("Không có dữ liệu điểm");
          }
        } 
        else {
            setGrades([]);
            setError("Chưa có dữ liệu điểm cho lớp/môn học này");
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
        setGrades([]);
        setError("Không thể kết nối đến máy chủ");
      } finally {
        setLoading(false);
      }
    },[filters.class, filters.semester, filters.year, filters.subject, currentPage, limit, searchTerm, sortConfig.field, sortConfig.order, refreshFlag]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handleSort = (field) => {
    setSortConfig(current => {
      const isAsc = current.field === field && current.order === 'ASC';
      return { field, order: isAsc ? 'DESC' : 'ASC' };
    });
    setCurrentPage(1);
  };

  const openEditModal = (student) => {
    setCurrentTarget(student);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentTarget(null);
  };
  const openAddModal = (student) => {
    setCurrentTarget(student);
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
    setCurrentTarget(null);
  };
  const openDeleteModal = (student) => {
    setCurrentTarget(student);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentTarget(null);
  };



  // Dynamic addGrade
  const addGrade = async (data) => {
    try {
      const filledScores = testTypes
        .filter(type => data.DiemTP?.[type.TenLoaiKiemTra] !== "" && data.DiemTP?.[type.TenLoaiKiemTra] !== null && data.DiemTP?.[type.TenLoaiKiemTra] !== undefined)
        .map(type => ({
          LoaiKiemTra: type.TenLoaiKiemTra,
          Diem: data.DiemTP[type.TenLoaiKiemTra]
        }));

      const payload = {
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };

      const res = await subjectGradeService.addScore(payload);

      if (res?.data?.EC === 0) {
        toast.success("Thêm điểm thành công");
        closeAddModal();
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể thêm điểm");
      }
    } catch (error) {
      console.error("Error adding score:", error);
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  // Dynamic updateGrade
  const updateGrade = async (data) => {
    try {
      const filledScores = testTypes
        .filter(type => data.DiemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra && d.Diemmoi !== "" && d.Diemmoi !== null && d.Diemmoi !== undefined))
        .map(type => ({
          LoaiKiemTra: type.TenLoaiKiemTra,
          Diemmoi: data.DiemTP.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)?.Diemmoi
        }));

      const payload = {
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };

      const res = await subjectGradeService.editScore(payload);

      if (res?.data?.EC !== 0) {
        toast.error(res?.data?.EM || "Không thể cập nhật điểm");
        return;
      }
      
      toast.success("Cập nhật điểm thành công");
      closeEditModal();
      setRefreshFlag(f => f + 1);
    } catch (error) {
      console.error("Error updating score:", error);
      if (!error.response || !error.response.data) {
        toast.error("Không thể kết nối đến máy chủ");
      }
    }
  };

  const removeGrade = async (data) => {
    try {
      const payload = {
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: data.DiemTP
      };

      const res = await subjectGradeService.deleteScore(payload);

      if (res?.data?.EC === 0) {
        toast.success("Xóa điểm thành công");
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể xóa điểm");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

const openAddTestTypeModal = () => {
  setAddTestTypeModalOpen(true);
};

const closeAddTestTypeModal = () => {
  setAddTestTypeModalOpen(false);
};

const addTestType = async (testTypeData) => {
  try {
    const res = await subjectGradeService.createTestType(testTypeData);

    if (res?.data?.message && res.data.message.includes("thành công")) {
      toast.success(res.data.message);

      const testTypesRes = await subjectGradeService.getTests();
      if (Array.isArray(testTypesRes.data?.data)) {
        setTestTypes(testTypesRes.data.data);
      }

      return true;
    } else {

      toast.error(res?.data?.message || "Không thể thêm loại kiểm tra");
      return false;
    }
  } catch (error) {

    console.error("Error adding test type:", error);

    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Không thể kết nối đến máy chủ");
    }

    return false;
  }
};

const refreshTestTypes = async () => {
  try {
    const res = await subjectGradeService.getTests();
    if (Array.isArray(res.data?.data)) {
      setTestTypes(res.data.data);
    }
  } catch (error) {
    console.error("Error refreshing test types:", error);
  }
};

  return {
    grades, loading,  error, currentTarget, searchTerm,
    editModalOpen,  addModalOpen, deleteModalOpen,
    openEditModal, closeEditModal,  openAddModal, 
    closeAddModal,  openDeleteModal,  closeDeleteModal,
    addGrade, updateGrade, removeGrade,
    testTypes, currentPage, totalPages, sortConfig,
    handleSort, handlePageChange, handleSearchChange,
    openAddTestTypeModal, closeAddTestTypeModal,
    addTestType, refreshTestTypes, addTestTypeModalOpen
  };
};

export default useSubjectGradeTable;