import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FC } from "react";
import { v4 } from "uuid";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";

type LogPricesProps = {
  zones: any[];
  planId: number;
  logEventPrices: any[];
  handlePriceChange: any;
};

const LogPrices: FC<LogPricesProps> = ({
  zones,
  logEventPrices,
  handlePriceChange,
  planId,
}) => {
  const columns: GridColDef[] = [
    {
      field: "Start_Datetime",
      headerName: "วันเริ่ม",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <DatePicker label="" dateTimeValue={params.value} setter={() => {}} />
        ) : (
          "ไม่ได้ระบุ"
        ),
    },
    {
      field: "End_Datetime",
      headerName: "วันที่สิ้นสุด",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <DatePicker label="" dateTimeValue={params.value} setter={() => {}} />
        ) : (
          "ไม่ได้ระบุ"
        ),
    },
    {
      field: "Plan_Price",
      headerName: "ราคา",
      width: 200,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <input
            disabled
            type="number"
            min="0"
            value={Number(params.value)}
            onChange={(e) =>
              handlePriceChange(params.row.id, "price", e.target.value)
            }
            style={{ width: "90%", color: "black", backgroundColor: "white" }}
          />
        );
      },
    },
    // {
    //   field: "delete",
    //   headerName: "",
    //   width: 120,
    //   sortable: false,
    //   resizable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <img
    //       src={deleteOnIcon}
    //       alt="delete-on"
    //       style={{ cursor: "pointer" }}
    //       onClick={() => removeZonePrice(params.row.id)}
    //     />
    //   ),
    // },
  ];
  return (
    <div className="price-section">
      <h3>ราคา ({zones[planId]?.prices?.length || 0})</h3>
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          getRowId={(_) => v4()}
          rows={logEventPrices}
          columns={columns}
          autoHeight
          hideFooterPagination
        />
      </div>

      <button type="button" className="add-price" onClick={() => {}}>
        + เพิ่มราคาบัตร
      </button>
    </div>
  );
};

export default LogPrices;
