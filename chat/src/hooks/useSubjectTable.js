import { fetchAllSubject, deleteSubject, createSubject, updateCurrentSubject } from "../services/subjectServices";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useModal from './useModal';
import { useCallback } from "react";

const useSubjectTable = () => {
    //Modal hooks
    const addModal = useModal();
    const updateModal = useModal();
    const deleteModal = useModal();
    //Data hooks
    const [listSubjects, setListSubjects] = useState([]);
    //Pagination hooks
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [currentLimit, setCurrentLimit] = useState(7);
    //Delete Modal
    const [dataModal, setDataModal] = useState({});
    //modal update/create user
    const [dataModalSubject, setDataModalSubject] = useState({}); // truyền dữ liệu vào modal
    //search
    const [searchTerm, setSearchTerm] = useState("");
    //sort
    const [sortField, setSortField] = useState("MaMonHoc");
    const [sortOrder, setSortOrder] = useState("asc");


    const fetchSubjects = useCallback(async () => {
        let response = await fetchAllSubject({
            search: searchTerm,
            page: currentPage,
            limit: currentLimit,
            sortField,
            sortOrder
        });
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListSubjects(response.data.DT.subjects); //set danh sách môn học
        } else {
            setListSubjects([]); // nếu không có dữ liệu, set danh sách môn học là mảng rỗng
        }
    }, [currentPage, currentLimit, searchTerm, sortField, sortOrder]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    }

    const handleAddSubject = async () => {
        addModal.open(); // mở modal
        setDataModalSubject({}); // reset dữ liệu trong modal
    }

    const confirmAddSubject = async (subjectData) => {
        try {
            let response = await createSubject(subjectData);
            if (response.data.EC === 0) {
                toast.success(response.data.EM);
                console.log("Thêm thành công");
                await fetchSubjects();
                addModal.close();
            } else if (response.data.EC === 1) {
                // Nếu môn học đã tồn tại, hiển thị thông báo lỗi
                toast.error(response.data.EM || "Môn học đã tồn tại");
            }
            return response;
        } catch (error) {
            // HTTP status 409 - Conflict nếu môn học đã tồn tại
            if (error?.response?.status === 409) {
                toast.error("Môn học đã tồn tại");
                return { data: { EC: error.data.EC, EM: error.data.EM } };
            }
            // Nếu có lỗi khác, hiển thị thông báo lỗi chung
            toast.error("Lỗi khi thêm môn học");
            return { data: { EC: -1, EM: "Lỗi khi thêm môn học" } };
        }
    }

    const handleDeleteSubject = async (subject) => {
        deleteModal.open(); // mở modal
        setDataModal(subject); // truyền dữ liệu vào modal
    }

    const confirmDeleteSubject = async () => {
        try {
            let response = await deleteSubject(dataModal);
            if (response?.data?.EC === 0) {
                toast.success("Xóa môn học thành công");
                await fetchSubjects(); // cập nhật lại danh sách môn học
                setDataModal({}); // reset dữ liệu trong modal
                deleteModal.close(); // đóng modal
            }
            else if (response?.data?.EC === 1) {
                //Nếu lỗi do ràng buộc khóa ngoại
                if (response?.data?.EM && response?.data?.EM.toLowerCase().includes("ràng buộc")) {
                    toast.error("Môn học này đang có bảng điểm nên không thể xoá");
                }
                // toast.error(response?.data?.EM || "Môn học không tồn tại");
            } else {
                toast.error(response?.data?.EM || "Lỗi khi xóa môn học");
            }
        } catch (error) {
            console.error("Lỗi khi xóa môn học:", error);
            toast.error("Lỗi khi xóa môn học");
        }
    };


    const handleEditSubject = (subject) => {
        updateModal.open(); // mở modal
        setDataModalSubject(subject); // truyền dữ liệu vào modal
    };

    const confirmUpdateSubject = async (subjectData) => {
        try {
            let response = await updateCurrentSubject(subjectData);
            if (response && response.data && response.data.EC === 0) {
                toast.success(response.data.EM || "Cập nhật thành công");
                await fetchSubjects();
                setDataModalSubject({}); // reset dữ liệu trong modal
                updateModal.close();
                setDataModalSubject({}); // reset dữ liệu trong modal
            } else if (response.data.EC === 1) {
                //Trường hợp trả về API 200 nhưng là lỗi logic
                toast.error(response?.data?.EM || "Có lỗi khi cập nhật môn học");
            }
            return response.data;
        } catch (error) {
            // HTTP status 409 - Conflict nếu môn học đã tồn tại
            if (error?.response?.status === 409) {
                const errorMessage = error?.response?.data?.EM || "Môn học đã tồn tại";
                toast.error(errorMessage);
                return { data: { EC: error.response.data.EC, EM: errorMessage } };
            }
            // Nếu có lỗi khác, hiển thị thông báo lỗi chung
            else if (error?.response?.status === 400) {
                const errorMessage = error?.response?.data?.EM || "Dữ liệu không hợp lệ";
                // toast.error(errorMessage);
                return { data: { EC: error.response.data.EC, EM: errorMessage } };
            }
            toast.error("Lỗi khi cập nhật môn học");
            return { data: { EC: -1, EM: "Lỗi khi cập nhật môn học" } };
        }
    }
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
    }
    return {
        addModal,
        updateModal,
        deleteModal,
        listSubjects,
        totalPages,
        currentPage,
        currentLimit,
        searchTerm,
        sortField,
        sortOrder,
        dataModal,
        dataModalSubject,
        fetchSubjects,
        handleDeleteSubject,
        confirmDeleteSubject,
        handleEditSubject,
        handleSearchChange,
        handlePageClick,
        handleSortChange,
        handleAddSubject,
        confirmAddSubject,
        confirmUpdateSubject,
    }
};
export default useSubjectTable;
