import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import "./zone-price-form.css";
import deleteOffIcon from '../../../public/delete-off.svg';
import deleteOnIcon from '../../../public/delete-on.svg';

const ZonePriceForm = ({ zones, handleSave }) => {
  const [expandedZone, setExpandedZone] = useState<number | null>(null);
  const [prices, setPrices] = useState([
    { id: 1, startDate: "16/06/2024", startTime: "10:00 PM", endDate: "16/06/2024", endTime: "10:00 PM", price: "2500.00" },
  ]);
  const [tableInputMethod, setTableInputMethod] = useState("");

  const handleExpandZone = (zoneId: number) => {
    setExpandedZone(expandedZone === zoneId ? null : zoneId);
  };

  const handlePriceChange = (id: number, field: string, value: string) => {
    const newPrices = prices.map((price) =>
      price.id === id ? { ...price, [field]: value } : price
    );
    setPrices(newPrices);
  };

  const addPrice = () => {
    setPrices([
      ...prices,
      { id: prices.length + 1, startDate: "", startTime: "", endDate: "", endTime: "", price: "" },
    ]);
  };

  const removePrice = (id: number) => {
    setPrices(prices.filter((price) => price.id !== id));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", width: 90, sortable: false, resizable: false, disableColumnMenu: true },
    {
      field: "startDate",
      headerName: "วันเริ่ม",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="date"
          value={params.value}
          onChange={(e) => handlePriceChange(params.row.id, "startDate", e.target.value)}
          style={{ width: "90%" }}
        />
      ),
    },
    {
      field: "startTime",
      headerName: "เวลาเริ่ม",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="time"
          value={params.value}
          onChange={(e) => handlePriceChange(params.row.id, "startTime", e.target.value)}
          style={{ width: "90%" }}
        />
      ),
    },
    {
      field: "endDate",
      headerName: "วันที่สิ้นสุด",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="date"
          value={params.value}
          onChange={(e) => handlePriceChange(params.row.id, "endDate", e.target.value)}
          style={{ width: "90%" }}
        />
      ),
    },
    {
      field: "endTime",
      headerName: "เวลาที่สิ้นสุด",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="time"
          value={params.value}
          onChange={(e) => handlePriceChange(params.row.id, "endTime", e.target.value)}
          style={{ width: "90%" }}
        />
      ),
    },
    {
      field: "price",
      headerName: "ราคา",
      width: 150,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="number"
          min="0"
          value={params.value}
          onChange={(e) => handlePriceChange(params.row.id, "price", e.target.value)}
          style={{ width: "90%", color  : "black" ,backgroundColor: "white" }}
        />
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 90,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        params.row.id === 1 ? (
          <img src={deleteOffIcon} alt="delete-off" />
        ) : (
          <img
            src={deleteOnIcon}
            alt="delete-on"
            style={{ cursor: "pointer" }}
            onClick={() => removePrice(params.row.id)}
          />
        )
      ),
    },
  ];

  return (
    <div className="zone-price-form-container">
      <div style={{ paddingTop: "30px" }} className="form-section">
        <div className="zone-select-container">
          <label>เลือก ZONE GROUP</label>
          <select className="zone-select">
            <option value="">ผังร้านคุณเอก</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.name}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {zones.map((zone) => (
        <div key={zone.id} className="zone-section">
          <div className="zone-header" onClick={() => handleExpandZone(zone.id)}>
            <span>
              {zone.id}. {zone.name}
            </span>
            <span>{zone.description}</span>
          </div>
          <Collapse in={expandedZone === zone.id} timeout="auto" unmountOnExit>
            <div className="zone-content">
              <div className="ticket-layout">
                <div className="empty-image">
                  <span>Image Placeholder</span>
                </div>
                <div className="ticket-details">
                  <div className="ticket-type">
                    <label>TICKET TYPE*</label>
                    <select className="ticket-type-select">
                      <option value="โต๊ะ">โต๊ะ</option>
                      <option value="เก้าอี้">เก้าอี้</option>
                      <option value="โซฟา">โซฟา</option>
                      <option value="ห้อง">ห้อง</option>
                      <option value="คน">คน</option>
                    </select>
                  </div>
                  <div className="ticket-amount">
                    <div className="ticket-amount-row">
                      <label>จำนวนบัตร/โซน*</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="จำนวนบัตร/โซน*"
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </div>
                    <div className="ticket-amount-row">
                      <label>จำนวนที่นั่ง/ตั๋ว</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="จำนวนที่นั่ง/ตั๋ว"
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="price-section">
                <h3>ราคา ({prices.length})</h3>
                <div style={{ height: 'auto', width: '100%' }}>
                  <DataGrid
                    rows={prices}
                    columns={columns}
                    pageSize={prices.length}
                    autoHeight
                    disableSelectionOnClick
                    hideFooterPagination
                  />
                </div>
                <button type="button" className="add-price" onClick={addPrice}>+ เพิ่มราคาบัตร</button>
              </div>
              <div className="table-input-method-section">
                <label>ระบุเลขโต๊ะ/ที่*</label>
                <select
                  value={tableInputMethod}
                  onChange={(e) => setTableInputMethod(e.target.value)}
                  className="table-input-method-select"
                >
                  <option value="1">คีย์เลขโต๊ะได้เอง</option>
                  <option value="2">รันจาก XX ถึง XX - (1-40)</option>
                  <option value="3">นำหน้าด้วย Plan name ต่อด้วย รันจาก XX ถึง XX - (โต๊ะโซนสีเขียว 1- โต๊ะโซนสีเขียว 40)</option>
                  <option value="4">ใส่อักษรนำหน้า ต่อด้วย รันจาก XX ถึง XX ([?] 1- [?] 40)</option>
                  <option value="5">ไม่ระบุเลขโต๊ะ</option>
                </select>
              </div>
            </div>
          </Collapse>
        </div>
      ))}
      <div className="form-section" style={{ height: "500px" }}>
        <button type="button" onClick={handleSave}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default ZonePriceForm;
