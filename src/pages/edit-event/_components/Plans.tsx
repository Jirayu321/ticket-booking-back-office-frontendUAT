import { CircularProgress } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FC } from "react";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { useEditZonePriceStore } from "../_hook/useEditZonePriceStore";
import { Price, ZoneData } from "../type";
import PlanList from "./PlanList";
import deleteOnIcon from "/delete-on.svg";
import dayjs from "dayjs";

type PlanProps = {
  filteredPlans: any[];
};

const Plans: FC<PlanProps> = ({ filteredPlans }) => {
  const { setZoneData, removeZonePrice, addZonePrice, zones } =
    useEditZonePriceStore();

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  const handlePriceChange = (
    zoneId: number,
    priceId: number,
    field: keyof Price,
    value: any
  ) => {
    const zone = zones[zoneId];
    if (zone) {
      const updatedPrices = zone.prices.map((price) =>
        price.id === priceId ? { ...price, [field]: value } : price
      );
      setZoneData(zoneId, { prices: updatedPrices });
    }
  };

  const handleInputChange = (
    zoneId: number,
    field: keyof ZoneData,
    value: any
  ) => {
    setZoneData(zoneId, { [field]: value });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ลำดับ",
      width: 120,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "startDate",
      headerName: "วันเริ่ม",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className="form-section form-section-inline">
          <DateTimePickerComponent
            controlledValue={params.value ? dayjs(params.value) : null}
            onChange={(date) =>
              handlePriceChange(
                params.row.id,
                "startDate",
                date ? date.toISOString() : ""
              )
            }
            label="Select Start Date & Time"
          />
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "วันที่สิ้นสุด",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className="form-section form-section-inline">
          <DateTimePickerComponent
            controlledValue={params.value ? dayjs(params.value) : null}
            onChange={(date) =>
              handlePriceChange(
                params.row.id,
                "endDate",
                date ? date.toISOString() : ""
              )
            }
            label="Select End Date & Time"
          />
        </div>
      ),
    },
    {
      field: "price",
      headerName: "ราคา",
      width: 200,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="number"
          min="0"
          value={params.value}
          onChange={(e) =>
            handlePriceChange(params.row.id, "price", e.target.value)
          }
          style={{ width: "90%", color: "black", backgroundColor: "white" }}
        />
      ),
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
          onClick={() => removeZonePrice(params.row.id)}
        />
      ),
    },
  ];

  if (isLoadingTicketTypes) return <CircularProgress />;

  return <PlanList plans={filteredPlans} onSetZoneData={setZoneData} />;
};

export default Plans;
