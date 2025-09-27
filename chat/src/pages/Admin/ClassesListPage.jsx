import React from "react";
import ClassListTable from "../../components/Table/ClassListTable";
import useClassesListPage from "../../hooks/useClassesListPage";
import "../../styles/Page/ClassesListPage.scss";
import "../../styles/FilterGroup.scss";

const ClassesListPage = () => {
  const {
    years,
    classes,
    selectedYear,
    selectedClass,
    studentCount,
    loading,
    handleYearChange,
    handleClassChange,
    setStudentCount,
  } = useClassesListPage();

  return (
    <div className="classeslist-page-container">
      <div className="classeslist-header">
        <h2 className="classeslist-title">Danh sách lớp</h2>
        <div className="filter-group">
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            disabled={loading || years.length === 0}
          >
            {years.length > 0 ? (
              years.map((year, index) => (
                <option key={year.MaNamHoc || index} value={year.TenNamHoc}>
                  {year.TenNamHoc}
                </option>
              ))
            ) : (
              <option value="">Không có năm học</option>
            )}
          </select>
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            disabled={loading || classes.length === 0}
          >
            {classes.length > 0 ? (
              classes.map((cls, index) => (
                <option key={cls.MaLop || index} value={cls.TenLop}>
                  {cls.TenLop}
                </option>
              ))
            ) : (
              <option value="">Không có lớp học</option>
            )}
          </select>
          {/* <input type="text" value={`Sĩ số: ${studentCount}`} readOnly /> */}
        </div>
      </div>
      <ClassListTable
        selectedYear={selectedYear}
        selectedClass={selectedClass}
        setStudentCount={setStudentCount}
      />
    </div>
  );
};

export default ClassesListPage;
