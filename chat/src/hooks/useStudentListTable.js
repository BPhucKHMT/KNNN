import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchStudentWithYear } from "../services/studentServices";
import ReactPaginate from "react-paginate";

const useStudentListTable = (selectedYear) => {
  const [listStudents, setListStudents] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(7);
  const [totalPages, setTotalPages] = useState(10);

  //search
  const [searchTerm, setSearchTerm] = useState("");

  //sort
  const [sortField, setSortField] = useState("MaHocSinh");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchStudents = async () => {
    try {
      let response = await fetchStudentWithYear(
        selectedYear,
        currentPage,
        currentLimit,
        searchTerm,
        sortField,
        sortOrder
      );
      console.log("check thử response data", response.data);
      if (response && response.data && response.data.EC === 0) {
        setListStudents(response.data.DT.students);
        setTotalPages(response.data.DT.totalPages);
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    console.log("Search term:", value);
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
    listStudents,
    handlePageClick,
    totalPages,
    fetchStudents,
    currentPage,
    searchTerm,
    handleSearchChange,
    handleSort,
    sortField,
    sortOrder,

  };
};

export default useStudentListTable;
