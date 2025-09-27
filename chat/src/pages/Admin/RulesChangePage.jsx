import React, { useState, useEffect, useContext, useCallback } from "react";
import "../../styles/Page/RulesChangePage.scss";
import TableHeaderAction from "../../components/TableHeaderAction";
import useParamenterTable from "../../hooks/useParamenter";
import "../../styles/FilterGroup.scss";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify"; // Đảm bảo đã cài toastify
import {
  getAllSchoolYear,
  createSchoolYear,
} from "../../services/paramenterService";

const PARAMS = [
  { key: "TuoiToiThieu", label: "Số tuổi tối thiểu" },
  { key: "TuoiToiDa", label: "Số tuổi tối đa" },
  { key: "DiemToiThieu", label: "Số điểm tối thiểu" },
  { key: "DiemToiDa", label: "Số điểm tối đa" },
  { key: "DiemDat", label: "Điểm đạt" },
  { key: "DiemQuaMon", label: "Điểm đạt môn" },
  { key: "SiSoToiDa", label: "Sĩ số" },
];

const RulesChangePage = () => {
  const { user } = useContext(UserContext);
  const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];
  const canUpdate = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/paramenter/update"
  );

  const canCreateYear = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/year/create"
  );
  const {
    loading: paramsLoading,
    parameterList,
    handleUpdateParamenter,
  } = useParamenterTable();

  const initialValues = PARAMS.reduce((acc, param) => {
    acc[param.key] = "";
    return acc;
  }, {});
  const [values, setValues] = useState(initialValues);
  const [yearList, setYearList] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [loadingYears, setLoadingYears] = useState(false);

  const fetchYears = useCallback(async () => {
    setLoadingYears(true);
    try {
      const res = await getAllSchoolYear();
      if (res && Array.isArray(res.data.data)) {
        setYearList(res.data.data || []);
      } else {
        toast.error("Lỗi khi tải danh sách năm học");
      }
    } catch (error) {
      console.error("Error fetching school years:", error);
    } finally {
      setLoadingYears(false);
    }
  }, []);

  // Fetch năm học khi component mount
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  // Cập nhật giá trị tham số khi danh sách thay đổi
  useEffect(() => {
    const newValues = {};
    PARAMS.forEach((param) => {
      const found = parameterList.find((item) => item.TenThamSo === param.key);
      newValues[param.key] = found ? found.GiaTri : "";
    });
    setValues(newValues);
  }, [parameterList]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    if (!canUpdate) {
      toast.warning("Bạn không có quyền thay đổi quy định.");
      return;
    }
    handleUpdateParamenter(key, { GiaTri: values[key] });
  };

  // Hàm xử lý thêm năm học mới
  const handleAddNewYear = async () => {
    if (!canCreateYear) {
      toast.warning("Bạn không có quyền thêm năm học mới.");
      return;
    }
    const trimmedYear = newYear.trim();
    if (!trimmedYear) {
      toast.error("Vui lòng nhập tên năm học.");
      return;
    }

    try {
      const res = await createSchoolYear({ TenNamHoc: trimmedYear });
      if (res?.data?.EC === 0) {
        toast.success(res.data.EM);
        setNewYear(""); // Xóa input
        fetchYears(); // Tải lại danh sách năm học để cập nhật dropdown
      } else if (res?.data?.EC === 1) {
        toast.error(res.data.EM);
      } else {
        toast.error("Lỗi khi tạo năm học: " + res.data.EM);
      }
    } catch (error) {
      console.error("Error creating school year:", error);
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  const {
    TuoiToiThieu,
    TuoiToiDa,
    DiemToiThieu,
    DiemToiDa,
    DiemDat,
    DiemQuaMon,
    SiSoToiDa,
  } = values;

  return (
    <div className="ruleschange-page-container">
      <div className="ruleschange-card full">
        <h3>Danh sách năm học đã có</h3>
        <div className="filter-group">
          <select>
            <option value="">-- Chọn năm học --</option>
            {yearList.map((year) => (
              <option key={year.MaNamHoc} value={year.TenNamHoc}>
                {year.TenNamHoc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt số tuổi</h3>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Số tuổi tối thiểu</label>
            <div className="input-group">
              <input
                type="number"
                value={TuoiToiThieu}
                onChange={(e) => handleChange("TuoiToiThieu", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("TuoiToiThieu")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
          <div className="half">
            <label>Số tuổi tối đa</label>
            <div className="input-group">
              <input
                type="number"
                value={TuoiToiDa}
                onChange={(e) => handleChange("TuoiToiDa", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("TuoiToiDa")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt số điểm</h3>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Số điểm tối thiểu</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemToiThieu}
                onChange={(e) => handleChange("DiemToiThieu", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("DiemToiThieu")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
          <div className="half">
            <label>Số điểm tối đa</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemToiDa}
                onChange={(e) => handleChange("DiemToiDa", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("DiemToiDa")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Điểm đạt</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemDat}
                onChange={(e) => handleChange("DiemDat", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("DiemDat")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
          <div className="half">
            <label>Điểm đạt môn</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemQuaMon}
                onChange={(e) => handleChange("DiemQuaMon", e.target.value)}
                disabled={!canUpdate || paramsLoading}
              />
              <button
                onClick={() => handleSave("DiemQuaMon")}
                disabled={!canUpdate || paramsLoading}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt sĩ số</h3>
        <div className="single-input">
          <label>Sĩ số</label>
          <div className="input-group">
            <input
              type="number"
              value={SiSoToiDa}
              onChange={(e) => handleChange("SiSoToiDa", e.target.value)}
              disabled={!canUpdate || paramsLoading}
            />
            <button
              onClick={() => handleSave("SiSoToiDa")}
              disabled={!canUpdate || paramsLoading}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesChangePage;
