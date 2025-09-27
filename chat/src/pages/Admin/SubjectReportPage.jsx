import '../../styles/Page/SubjectReportPage.scss'
import axios from 'axios';
import SubjectReportFilters from '../../components/Modal/SubjectReportFilter';
import SubjectReportTable from '../../components/Table/SubjectReportTable';
import '../../styles/FilterGroup.scss';
import TableHeaderAction from '../../components/TableHeaderAction';
import '../../styles/Table.scss';
import reportService from '../../services/reportService';
import React, { useState, useEffect } from 'react';
import exportToExcel from '../../utils/exportToExcel';

const SubjectReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [reportMeta, setReportMeta] = useState({
    monHoc: '',
    hocKy: '',
    namHoc: '',
  });

  const [filters, setFilters] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    sortBy: null,
    order: 'asc',
  });

  useEffect(() => {
  if (!filters) return;
  const delayDebounce = setTimeout(() => {
    fetchReport(filters, searchTerm, searchField); // ✅ Truyền rõ ràng
  }, 300);
  return () => clearTimeout(delayDebounce);
}, [searchTerm, searchField]);



  const fetchReport = async (customFilters = filters, term = searchTerm, field = searchField) => {
  if (!customFilters) return;

  try {
    const res = await reportService.getSubjectReport({
      ...customFilters,
      searchTerm: term.trim(),
      searchField: field,
      sortBy: sortConfig.sortBy,
      order: sortConfig.order,
    });

    if (res.status === 200 && res.data.EC === 0) {
      const { ketQua, monHoc, hocKy, namHoc } = res.data.DT;
      setReportData(ketQua || []);
      setReportMeta({ monHoc, hocKy, namHoc });
    } else {
      alert('Không thể lấy báo cáo.');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi kết nối đến server.');
  }
};


  const handleFilterSubmit = (filterValues) => {
    setFilters(filterValues);
    setSortConfig({ sortBy: null, order: 'asc' });
    setSearchTerm('');
    setSearchField('all'); // reset tiêu chí tìm kiếm
    fetchReport(filterValues);
  };

  const handleSort = (key) => {
  const newOrder =
    sortConfig.sortBy === key && sortConfig.order === 'asc' ? 'desc' : 'asc';

  setSortConfig({ sortBy: key, order: newOrder });
  fetchReport(filters, searchTerm, searchField); // ✅ Thêm searchTerm + field
};


  const handleExport = () => {
    if (!reportData.length) return alert('Không có dữ liệu để xuất Excel.');

    const dataForExcel = reportData.map((item, index) => ({
      STT: index + 1,
      Lớp: item.lop,
      'Sĩ số': item.siSo,
      'Số lượng đạt': item.soLuongDat,
      'Tỉ lệ': item.tiLe,
    }));

    const fileName = `BCTKM_${reportMeta.monHoc}_${reportMeta.hocKy}_${reportMeta.namHoc}.xlsx`;
    exportToExcel(dataForExcel, fileName);
  };

  return (
    <div className="subjectreport-page-container">
      <div className='subjectreport-header'>
        <h2 className="studentslist-title">Báo cáo tổng kết môn</h2>
        <SubjectReportFilters onSubmit={handleFilterSubmit} />
      </div>

      <SubjectReportTable
  data={reportData}
  meta={reportMeta}
  onSort={handleSort}
  sortConfig={sortConfig}
  searchTerm={searchTerm}
  searchField={searchField}
  onSearchChange={setSearchTerm}
  onSearchFieldChange={setSearchField}
  onExportClick={handleExport}
/>

    </div>
  );
};

export default SubjectReportPage;
