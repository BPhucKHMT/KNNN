import React, { useState, useEffect } from 'react';
import '../../styles/Page/SemesterReportPage.scss';
import SemesterReportTable from '../../components/Table/SemesterReportTable';
import SemesterReportFilter from '../../components/Modal/SemesterReportFilter';
import reportService from '../../services/reportService';
import exportToExcel from '../../utils/exportToExcel';

const SemesterReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [reportMeta, setReportMeta] = useState({
    hocKy: '',
    namHoc: '',
    diemDat: null,
  });

  const [sortConfig, setSortConfig] = useState({ sortBy: null, order: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const fetchReport = async ({ tenHocKy, tenNamHoc }) => {
    try {
      const res = await reportService.getSemesterReport({
        tenHocKy,
        tenNamHoc,
        searchTerm: searchTerm.trim(),
        searchField,
        sortBy: sortConfig.sortBy,
        order: sortConfig.order
      });

      if (res.status === 200 && res.data.EC === 0) {
        const { ketQua, hocKy, namHoc, diemDat } = res.data.DT;
        setReportMeta({ hocKy, namHoc, diemDat });
        setReportData(ketQua || []);
      } else {
        alert(res.data.EM || 'Không thể lấy báo cáo học kỳ.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gọi API báo cáo.');
    }
  };

  // Tự fetch lại khi tìm kiếm hoặc sort
  useEffect(() => {
    if (reportMeta.hocKy && reportMeta.namHoc) {
      fetchReport({
        tenHocKy: reportMeta.hocKy,
        tenNamHoc: reportMeta.namHoc
      });
    }
  }, [searchTerm, searchField, sortConfig]);

  // Khi chọn lại năm học/học kỳ từ bộ lọc
  const handleFilterSubmit = ({ tenHocKy, tenNamHoc }) => {
    fetchReport({ tenHocKy, tenNamHoc });
  };

  const handleSort = (key) => {
    const order = (sortConfig.sortBy === key && sortConfig.order === 'asc') ? 'desc' : 'asc';
    setSortConfig({ sortBy: key, order });
  };

  const handleExport = () => {
    const exportData = reportData.map(item => ({
      'STT': item.stt,
      'Lớp': item.lop,
      'Sĩ số': item.siSo,
      'Số lượng đạt': item.soLuongDat,
      'Tỉ lệ': item.tiLe
    }));
    exportToExcel(exportData, 'BaoCaoHocKy.xlsx');
  };

  return (
    <div className="semesterreport-page-container">
      <div className="semesterreport-header">
        {reportMeta.hocKy && (
          <div className="semesterreport-title">
            <p>Báo cáo tổng kết học kỳ</p>
          </div>
        )}
        {!reportMeta.hocKy && (
          <div className="semesterreport-title">
            <p>Báo cáo tổng kết học kỳ</p>
          </div>
        )}
        <SemesterReportFilter onSubmit={handleFilterSubmit} />
      </div>

      <SemesterReportTable
        data={reportData}
        meta={reportMeta}
        sortConfig={sortConfig}
        onSort={handleSort}
        onSearchChange={setSearchTerm}
        onSearchFieldChange={setSearchField}
        searchTerm={searchTerm}
        searchField={searchField}
        onExportClick={handleExport}
      />
    </div>
  );
};

export default SemesterReportPage;
