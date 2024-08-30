import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FC } from "react";
import toast from "react-hot-toast";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import usePlanInfoStore from "../_hook/usePlanInfoStore";
import deleteOnIcon from "/delete-on.svg";
import { v4 } from "uuid";

type LogPricesProps = {
  zones: any[];
  planId: number;
};

const LogPrices: FC<LogPricesProps> = ({ zones, planId }) => {
  const state = usePlanInfoStore((state: any) => state);
  const {
    onAddLogEventPrice,
    onUpdateLogEventPrice,
    logEventPrices,
    onUpdatePrice,
    onDeleteLogEventPrice,
  } = state;

  function handleAddLogEventPrice() {
    try {
      const emptyLogEventPrice = {
        id: v4(),
        Start_Datetime: new Date(),
        End_Datetime: new Date(),
        Plan_Price: 0,
      };

      onAddLogEventPrice(emptyLogEventPrice);

      toast.success("เพิ่มราคาโซนสำเร็จ");
    } catch (error: any) {
      toast.error("ล้มเหลวระหว่างเพิ่มราคาโซน");
    }
  }

  function handleUpdateLogEventPriceStartTime(
    newStartTime: string,
    logEventPriceId: number
  ) {
    try {
      const newLogEventPrice = {
        ...logEventPrices.find((lve: any) => lve.id === logEventPriceId),
        Start_Datetime: newStartTime,
      };

      onUpdateLogEventPrice(newLogEventPrice);
    } catch (error: any) {
      toast.error("ล้มเหลวระหว่างอัพเดทเวลาเริ่ม");
    }
  }

  function handleUpdateLogEventPriceEndTime(
    newEndTime: string,
    logEventPriceId: number
  ) {
    try {
      const newLogEventPrice = {
        ...logEventPrices.find((lve: any) => lve.id === logEventPriceId),
        End_Datetime: newEndTime,
      };

      onUpdateLogEventPrice(newLogEventPrice);

      toast.success("อัพเดทเวลาสิ้นสุดสำเร็จ");
    } catch (error: any) {
      toast.error("ล้มเหลวระหว่างอัพเดทเวลาสิ้นสุด");
    }
  }

  function handleUpdatePrice(newPrice: number, logEventPriceId: string) {
    try {
      onUpdatePrice(newPrice, logEventPriceId);
    } catch (error: any) {
      toast.error("ล้มเหลวระหว่างอัพเดทราคา");
    }
  }

  function handleDeleteLogEventPrice(logEventPriceId: string) {
    try {
      onDeleteLogEventPrice(logEventPriceId);
      toast.success("ลบราคาโซนสำเร็จ");
    } catch (error: any) {
      toast.error("ล้มเหลวระหว่างลบราคาโซน");
    }
  }

  const columns: GridColDef[] = [
    {
      field: "Start_Datetime",
      headerName: "วันเริ่ม",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <DatePicker
          label=""
          dateTimeValue={params.value}
          setter={(newTime: string) => {
            handleUpdateLogEventPriceStartTime(newTime, params.row.id);
          }}
        />
      ),
    },
    {
      field: "End_Datetime",
      headerName: "วันที่สิ้นสุด",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <DatePicker
          label=""
          dateTimeValue={params.value}
          setter={(newTime: string) => {
            handleUpdateLogEventPriceEndTime(newTime, params.row.id);
          }}
        />
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
            type="number"
            min="0"
            value={Number(params.value)}
            onChange={(e) => {
              e.preventDefault();
              handleUpdatePrice(Number(e.target.value), params.row.id);
            }}
            style={{ width: "90%", color: "black", backgroundColor: "white" }}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={deleteOnIcon}
          alt="delete-on"
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleDeleteLogEventPrice(params.row.id);
          }}
        />
      ),
    },
  ];

  return (
    <div className="price-section">
      <h3>ราคา ({zones[planId]?.prices?.length || 0})</h3>
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.id}
          rows={logEventPrices}
          columns={columns}
          autoHeight
          hideFooterPagination
        />
      </div>

      <button
        type="button"
        className="add-price"
        onClick={handleAddLogEventPrice}
      >
        + เพิ่มราคาบัตร
      </button>
    </div>
  );
};

export default LogPrices;
