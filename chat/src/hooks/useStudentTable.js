import { fetchAllStudent, deleteStudent } from "../services/studentServices";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useModal from "./useModal";
import { set } from "lodash";

const useStudentTable = () => {
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();

  const [listStudents, setListStudents] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(7);
  const [totalPages, setTotalPages] = useState(10);

  //Delete Modal
  const [dataModal, setDataModal] = useState({});

  //modal update/create user
  const [dataModalStudent, setDataModalStudent] = useState({}); // truyền dữ liệu vào modal

  //search
  const [searchTerm, setSearchTerm] = useState("");

  //sort
  const [sortField, setSortField] = useState("MaHocSinh");
  const [sortOrder, setSortOrder] = useState("asc");

  

  const fetchStudents = async () => {
    let response = await fetchAllStudent(currentPage, currentLimit,searchTerm , sortField, sortOrder);
    if (response && response.data && response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setListStudents(response.data.DT.users); //set danh sách học sinh
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteStudent = async (user) => {
    deleteModal.open();
    setDataModal(user);
  };

  const confirmDeleteStudent = async () => {
    let response = await deleteStudent(dataModal);
    if (response && +response.data.EC === 0) {
      toast.success(response.data.EM);
      await fetchStudents();
      deleteModal.close();
    } else if (
      response?.data.EC === 1 && 
      response?.data?.DT?.foreignTable) 
    {
      toast.error(`${response.data.EM}.\nVui lòng xóa hoặc cập nhật các dữ liệu liên quan ở bảng "${response.data.DT.foreignTable}" trước khi xóa học sinh này.`);
      deleteModal.close();
    }  else {
      toast.error(response.data.EM || "Xóa học sinh thất bại");
      deleteModal.close();
    }
  };

  const handleEditStudent = (student) => {
    updateModal.open(); // mở modal
    setDataModalStudent(student); // truyền dữ liệu vào modal
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };


  const handleSort = (field) => {
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
    listStudents,
    currentPage,
    totalPages,
    fetchStudents,
    handlePageClick,
    handleDeleteStudent,
    confirmDeleteStudent,
    handleEditStudent,
    dataModalStudent,
    dataModal,
    searchTerm,
    handleSearchChange ,
    handleSort,
    sortField,
    sortOrder,
  };
};
export default useStudentTable;
