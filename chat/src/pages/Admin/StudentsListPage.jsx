import React from 'react';
import '../../styles/Page/StudentsListPage.scss'
import StudentListTable from '../../components/Table/StudentListTable';
//các import mới
import { useState, useEffect } from 'react';
import useStudentListPage from '../../hooks/useStudentListPage';
import '../../styles/FilterGroup.scss';
const StudentsListPage = () => {

    const { years, selectedYear, setSelectedYear, fetchYears } = useStudentListPage();
    const [selectedYearName, setSelectedYearName] = useState('');

    useEffect(() => {
        fetchYears();
    }, [])

    useEffect(() => {
    if (years.length > 0 && selectedYear) {
        const found = years.find(y => y.MaNamHoc == selectedYear);
        setSelectedYearName(found?.TenNamHoc || '');
    }
}, [years, selectedYear]);

    const handleYearChange = (e) => {
        const selectedId = e.target.value;
        setSelectedYear(selectedId);
        const found = years.find(y => y.MaNamHoc == selectedId);
        setSelectedYearName(found.TenNamHoc || '');
    };

    return (
        <div className="studentslist-page-container">
            <div className="studentslist-header">
                <h2 className="studentslist-title">Danh sách học sinh</h2>
                <div className="filter-group ">
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e)=>handleYearChange(e)}
                    >
                        {years && years.length > 0 && years.map((year, index) => {
                            return (
                                <option key={`year-${index}`} value={year.MaNamHoc}>
                                    {year.TenNamHoc}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <StudentListTable selectedYear={selectedYear} yearName ={selectedYearName} />
            {/* truyền id năm học vào đây */}
        </div>
    );
};

export default StudentsListPage;
