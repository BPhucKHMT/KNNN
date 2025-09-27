/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import useModal from "./useModal";
import { toast } from "react-toastify";
import {
    fetchAllGrades,
    createGrade,
    updateGrade,
    deleteGrade,
} from "../services/gradeService";

const useGradeTable = () => {
    const addModal = useModal();
    const updateModal = useModal();
    const deleteModal = useModal();
    const [selectedGrade, setSelectedGrade] = useState(null);

    const [gradeList, setGradeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalGrades, setTotalGrades] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(7);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("TenKhoi");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchGrades = useCallback(async (showErrorToast = true) => {
        setLoading(true);
        try {
            const res = await fetchAllGrades({
                search: searchTerm,
                page: currentPage,
                limit: currentLimit,
                sortField,
                sortOrder,
            });

            if (res?.data?.EC === 0) {
                const data = res.data.DT;
                setTotalGrades(data.totalItems || 0);
                setTotalPages(data.totalPages || 0);
                setGradeList(data.grades || []);
            } else {
                setGradeList([]);
                if (showErrorToast) toast.error(res.data.EM || "Không thể tải dữ liệu khối lớp");
            }
        } catch (error) {
            setGradeList([]);
            if (showErrorToast) toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage, currentLimit, sortField, sortOrder]);

    useEffect(() => {
        fetchGrades();
    }, [fetchGrades]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (field) => {
        if (field === sortField) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const handleAddGrade = async (data) => {
        try {
            const res = await createGrade({
                GradeName: data.GradeName,
            });

            if (res?.data?.EC === 0) {
                toast.success("Thêm khối lớp thành công");
                await fetchGrades();
                addModal.close();
            } else {
                toast.error(res.data.EM || "Thêm khối lớp thất bại");
            }
            return res;
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            return { data: { EC: -1, EM: "Không thể kết nối đến máy chủ" } };
        }
    };


    const handleOpenUpdateModal = (gradeItem) => {
        setSelectedGrade(gradeItem);
        updateModal.open();
    };

    const handleUpdateGrade = async (updatedData) => {
        if (!updatedData) return;
        try {
            const id = updatedData.MaKhoi;
            const res = await updateGrade(id, { GradeName: updatedData.TenKhoi });

            if (res?.data?.EC === 0) {
                toast.success("Cập nhật khối lớp thành công");
                await fetchGrades();
                updateModal.close();
                setSelectedGrade(null);
            } else {
                toast.error(res.data.EM || "Cập nhật khối lớp thất bại");
            }
            return res;
        } catch (error) {
            const ec = error?.response?.data?.EC;
            const em = error?.response?.data?.EM;
            if (ec === 1) {
                toast.error(em || "Không tìm thấy khối hoặc lỗi khác");
            } else if (ec === 2) {
                toast.error(
                    em ||
                    "Không thể xóa khối vì đang được tham chiếu ở bảng khác. Vui lòng xóa hoặc cập nhật dữ liệu liên quan trước."
                );
            } else {
                toast.error("Không thể kết nối đến máy chủ");
            }
            deleteModal.close();

        }
    };

    const handleOpenDeleteModal = (gradeItem) => {
        setSelectedGrade(gradeItem);
        deleteModal.open();
    };

    const handleDeleteGrade = async (id) => {
        if (!id) return;
        try {
            const res = await deleteGrade(id);
            if (res?.data?.EC === 0) {
                toast.success(res.data.EM || "Xóa khối thành công");
                await fetchGrades();
                deleteModal.close();
            } else {
                toast.error(res?.data?.EM || "Xóa khối thất bại");
                deleteModal.close();
            }
            return res;
        } catch (error) {
            if (error?.response?.data?.EC === 1) {
                toast.error(error?.response?.data?.EM || "Không tìm thấy khối hoặc lỗi khác");
            } else if (error?.response?.data?.EC === 2) {
                toast.error(
                    "Khối lớp này đang có lớp học nên không thể xoá"
                );
            } else {
                toast.error("Không thể kết nối đến máy chủ");
            }
            deleteModal.close();
        }
    };

    return {
        addModal,
        updateModal,
        deleteModal,
        selectedGrade,
        gradeList,
        loading,
        currentPage,
        totalPages,
        setCurrentPage,
        handlePageClick,
        handleAddGrade,
        handleOpenUpdateModal,
        handleUpdateGrade,
        handleOpenDeleteModal,
        handleDeleteGrade,
        fetchGrades,
        handleSearchChange,
        searchTerm,
        sortField,
        sortOrder,
        handleSortChange,
    };
};

export default useGradeTable;
