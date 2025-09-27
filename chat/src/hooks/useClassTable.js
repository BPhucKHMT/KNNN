/* eslint-disable no-unused-vars */
// ClassTable dùng để hiển thị danh sách các lớp, có chức năng xóa và cập nhật thông tin lớp
import { useState, useEffect } from "react";
import useModal from "./useModal";
import { toast } from "react-toastify";
import { fetchAllClasses, createClass, updateCurrentClass, deleteClass, fetchAllGrades } from "../services/classService";
import { useCallback } from "react";

const useClassTable = () => {
  // Modal hooks
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();
  const [selectedClass, setSelectedClass] = useState(null);

  // Class list state
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalClasses, setTotalClasses] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const [gradesList, setGradesList] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  //Search 
  const [searchTerm, setSearchTerm] = useState("");
  //sort
  const [sortField, setSortField] = useState("MaLop");
  const [sortOrder, setSortOrder] = useState("asc");


  // Fetch all grades cho modal thêm lớp
  const fetchGrades = async () => {
    setLoadingGrades(true);
    try {
      const res = await fetchAllGrades();

      if (res?.data?.EC === 0) {
        setGradesList(res.data.DT || []);
      } else {
        setGradesList([]);
        toast.error(res?.data?.EM || "Lỗi khi tải danh sách khối");
      }
    } catch (error) {
      setGradesList([]);
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoadingGrades(false);
    }
  }

  const fetchClasses = useCallback(async (showErrorToast = true) => {
    setLoading(true);
    try {
      const res = await fetchAllClasses({
        search: searchTerm,
        page: currentPage,
        limit: currentLimit,
        sortField,
        sortOrder
      });
      if (res?.data?.EC === 0) {
        setTotalClasses(res.data.DT.totalRows || 0);
        setTotalPages(res.data.DT.totalPages || 0);
        setClassList(res.data.DT.classes || []);
      } else {
        setClassList([]);
      }
    } catch (error) {
      setClassList([]);
      if (showErrorToast) toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Pagination handler
  const handlePageClick = (event) => {
    const selected = +event.selected + 1;
    setCurrentPage(selected);
  };

  // Add a new class
  const handleAddClass = async (classData) => {
    try {
      const res = await createClass(classData);
      console.log("Check res", res)
      if (res?.data.EC === 0) {
        toast.success("Thêm lớp học thành công");
        await fetchClasses();
        addModal.close();
      } else if (res?.data.EC === 1) {
        toast.error(res?.data.EM || "Lớp học đã tồn tại");
      }
      else {
        toast.error(res?.data.EM || "Thêm lớp học thất bại");
      }
      return res;
    } catch (error) {
      // Backend trả về HTTP status 409 - Conflict nếu lớp đã tồn tại
      if (error?.response?.status === 409) {
        // toast.error(error?.response?.data?.EM || "Lớp học đã tồn tại");
        toast.error("Lớp học đã tồn tại. Bạn không thể thêm lớp học với tên này");
        return { data: { EC: 1, EM: error?.response?.data?.EM || "Lớp học đã tồn tại" } };
      }
      // Backend trả về HTTP status 500 - Internal Server Error nếu có lỗi khác
      console.error("Lỗi khi thêm lớp:", error);
      toast.error("Không thể kết nối đến máy chủ");
      return {
        data: { EC: -1, EM: "Không thể kết nối đến máy chủ" }
      };
    };
  }

  // Open update modal
  const handleOpenUpdateModal = (classItem) => {
    setSelectedClass(classItem);
    updateModal.open();
  };

  // Update class
  const handleUpdateClass = async (updatedData) => {
    if (!updatedData) return;
    try {
      const id = updatedData.MaLop;
      const classData = {
        className: updatedData.TenLop,
        classGrade: updatedData.MaKhoi,
      };
      const res = await updateCurrentClass(id, classData);
      if (res?.data.EC === 0) {
        toast.success("Cập nhật lớp thành công");
        await fetchClasses();
        updateModal.close();
        setSelectedClass(null);
      } else if (res?.data.EC === 1) {
        toast.error(res?.data.EM || "Lớp học đã tồn tại. Bạn không thể cập nhật lớp học với tên này");
      } else {
        toast.error(res?.EM || "Không thể cập nhật lớp");
      }
      return res;
    } catch (error) {
      if (error?.response?.status === 409) {
        // Nếu backend trả về HTTP status 409 - Conflict, có nghĩa là lớp đã tồn tại
        toast.error(error?.response?.data?.EM || "Lớp học đã tồn tại. Bạn không thể cập nhật lớp học với tên này");
        return { EC: 1, EM: error?.response?.data?.EM || " Lớp học đã tồn tại. Bạn không thể cập nhật lớp học với tên này" };
      }
      // Nếu có lỗi khác, backend sẽ trả về HTTP status 500 - Internal Server Error
      toast.error("Không thể kết nối đến máy chủ", error);
      return { EC: -1, EM: error?.response?.data?.EM || "Không thể kết nối đến máy chủ" };
    }
  };

  // Open delete modal
  const handleOpenDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    deleteModal.open();
  };

  // Delete class
  const handleDeleteClass = async (id) => {
    if (!id) return;
    try {
      const res = await deleteClass(id);
      if (res?.data.EC === 0) {
        toast.success("Xóa lớp thành công");
        await fetchClasses(false);
        deleteModal.close();
        setSelectedClass(null);
      } else if (res?.data.EC === 1) {
        if (res?.data.EM && res?.data.EM.toLowerCase().includes("ràng buộc")) {
          toast.error("Lớp học này đang có học sinh không thể xoá");
        } else {
          toast.error(res?.data.EM || "Lỗi khi xóa lớp học");
        }
      }
      return res;
    } catch (error) {
      // console.error("Lỗi khi xóa lớp:", error);
      console.log("Check error", error)
      toast.error("Không thể kết nối đến máy chủ");
      return { data: { EC: -1, EM: "Không thể kết nối đến máy chủ" } };
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  }

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  return {
    addModal,
    updateModal,
    deleteModal,
    selectedClass,
    classList,
    gradesList,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    handlePageClick,
    handleAddClass,
    handleOpenUpdateModal,
    handleUpdateClass,
    handleOpenDeleteModal,
    handleDeleteClass,
    fetchClasses,
    fetchGrades,
    handleSearchChange,
    searchTerm,
    sortField,
    sortOrder,
    handleSortChange,
  };
};

export default useClassTable;

