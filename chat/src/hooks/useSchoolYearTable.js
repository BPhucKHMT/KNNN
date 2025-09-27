import { useState, useEffect, useCallback } from "react";
import { fetchAllSchoolYears, deleteSchoolYear, createSchoolYear, updateSchoolYear } from "../services/schoolYearService";
import { toast } from "react-toastify";
import useModal from './useModal';

const useSchoolYearTable = () => {
  // Modal hooks
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();

  // Data hooks
  const [listSchoolYears, setListSchoolYears] = useState([]);

  // Pagination hooks
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(7);

  // Delete Modal
  const [dataModal, setDataModal] = useState({});

  // Modal update/create data
  const [dataModalSchoolYear, setDataModalSchoolYear] = useState({});

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sort
  const [sortField, setSortField] = useState("MaNamHoc");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSchoolYears = useCallback(async () => {
    let response = await fetchAllSchoolYears({
      search: searchTerm,
      page: currentPage,
      limit: currentLimit,
      sortField,
      sortOrder
    });
    if (response && response.data && response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setListSchoolYears(response.data.DT.schoolYears);
    } else {
      setListSchoolYears([]);
    }
  }, [currentPage, currentLimit, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleAddSchoolYear = async () => {
    addModal.open();
    setDataModalSchoolYear({});
  };

  const confirmAddSchoolYear = async (schoolYearData) => {
    try {
      const response = await createSchoolYear(schoolYearData);

      if (response.data.EC === 0) {
        toast.success(response.data.EM || "Thêm năm học thành công");
        await fetchSchoolYears();
        addModal.close();
      } else {
        toast.error(response.data.EM || "Năm học đã tồn tại");
      }
      return response;
    } catch (error) {
      console.error("Error adding school year:", error);
      return error.response || { data: { EC: -1, EM: "Lỗi khi thêm năm học" } };
    }
  };

  const handleDeleteSchoolYear = async (schoolYear) => {
    deleteModal.open();
    setDataModal(schoolYear);
  };

  const confirmDeleteSchoolYear = async () => {
    try {
      const response = await deleteSchoolYear(dataModal);

      // Handle success case
      if (response?.data?.EC === 0 || response?.data?.message === "Xóa năm học thành công") {
        toast.success(response.data?.EM || response.data?.message || "Xóa năm học thành công");
        await fetchSchoolYears();
        setDataModal({});
        deleteModal.close();
        return;
      }

      // Handle error - look for foreign key constraint error pattern
      const errorMsg = response?.data?.message || response?.data?.EM || "";

      if (errorMsg.includes("foreign key constraint fails")) {
        // Extract the table name from the error message
        const tableMatch = errorMsg.match(/`([^`]+)`\.`([^`]+)`/);
        const constraintMatch = errorMsg.match(/CONSTRAINT `([^`]+)`/);

        const tableName = tableMatch ? tableMatch[2] : "unknown";
        const constraintName = constraintMatch ? constraintMatch[1] : "unknown";

        toast.error(
          `Năm học này đang có báo cáo tổng kết môn nên không thể xoá`
        );
      } else {
        toast.error(errorMsg || "Lỗi khi xóa năm học");
      }
    } catch (error) {
      console.error("Lỗi khi xóa năm học:", error);

      // Check if the error is a foreign key constraint error
      const errorMsg = error.response?.data?.message || error.message || "";

      if (errorMsg.includes("foreign key constraint fails")) {
        // Extract the table name from the error message
        const tableMatch = errorMsg.match(/`([^`]+)`\.\`([^`]+)`/);
        const constraintMatch = errorMsg.match(/CONSTRAINT `([^`]+)`/);

        const tableName = tableMatch ? tableMatch[2] : "unknown";
        const constraintName = constraintMatch ? constraintMatch[1] : "unknown";

        toast.error(
          `Năm học này đang có báo cáo tổng kết môn nên không thể xoá`
        );
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
    }
  };

  const handleEditSchoolYear = (schoolYear) => {
    updateModal.open();
    setDataModalSchoolYear(schoolYear);
  };

  const confirmUpdateSchoolYear = async (schoolYearData) => {
    try {
      const response = await updateSchoolYear(schoolYearData.MaNamHoc, schoolYearData);
      if (response?.data?.EC === 0) {
        toast.success(response.data.EM || "Cập nhật năm học thành công");
        await fetchSchoolYears();
        updateModal.close();
        setDataModalSchoolYear({});
      } else {
        toast.error(response.data.EM || "Lỗi khi cập nhật năm học");
        updateModal.close();
        setDataModalSchoolYear({});
      }
    } catch (error) {
      const ec = error?.response?.data?.EC;
      const em = error?.response?.data?.EM;
      if (ec === 1) {
        toast.error(em || "Lỗi khi cập nhật năm học");
      }
      else if (ec === 2) {
        toast.error(em || "Lỗi khi cập nhật năm học");
      }
      else {
        toast.error("Không thể kết nối đến máy chủ");
      }
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return {
    addModal,
    updateModal,
    deleteModal,
    listSchoolYears,
    totalPages,
    currentPage,
    currentLimit,
    searchTerm,
    sortField,
    sortOrder,
    dataModal,
    dataModalSchoolYear,
    fetchSchoolYears,
    handlePageClick,
    handleAddSchoolYear,
    confirmAddSchoolYear,
    handleDeleteSchoolYear,
    confirmDeleteSchoolYear,
    handleEditSchoolYear,
    confirmUpdateSchoolYear,
    handleSearchChange,
    handleSortChange
  };
};

export default useSchoolYearTable;