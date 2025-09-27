/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import SubjectGradeTable from '../../components/Table/SubjectGradeTable';
import reportService from '../../services/reportService';
import '../../styles/Page/SubjectGradesPage.scss';
import '../../styles/FilterGroup.scss';
const SubjectGradesPage = () => {
    const [filters, setFilters] = useState({
        year: '',
        class: '',
        subject: '',
        semester: ''
    });
    const [options, setOptions] = useState({
        namHoc: [],
        lop: [],
        monHoc: [],
        hocKy: [],
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await reportService.getOptions();
                if (res.data && res.data.EC === 0) {
                    setOptions(res.data.DT);
                    // Set default filters to first available option
                    setFilters({
                        year: res.data.DT.namHoc[0]?.value || '',
                        class: res.data.DT.lop[0]?.value || '',
                        subject: res.data.DT.monHoc[0]?.value || '',
                        semester: res.data.DT.hocKy[0]?.value || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching options:', err);
            }
        };
        fetchOptions();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="subjectgrades-page-container">
            <div className="subjectgrades-header">
                <h2 className="subjectgrades-title">Bảng điểm môn học</h2>
                <div className="filter-group">
                    <select value={filters.year} onChange={e => handleFilterChange('year', e.target.value)}>
                        {options.namHoc.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <select value={filters.class} onChange={e => handleFilterChange('class', e.target.value)}>
                        {options.lop.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <select value={filters.subject} onChange={e => handleFilterChange('subject', e.target.value)}>
                        {options.monHoc.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <select value={filters.semester} onChange={e => handleFilterChange('semester', e.target.value)}>
                        {options.hocKy.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <SubjectGradeTable filters={filters} />
        </div>
    );
};

export default SubjectGradesPage;