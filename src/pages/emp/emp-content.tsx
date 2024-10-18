import React, { useState } from "react";
import {
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import Header from "../common/header";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Container, Grid, Box, Typography, Avatar } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";

import {
  selectedColor,
  Event_PublicY,
  Event_PublicN,
  // Event_Status1,
  // Event_Status2,
  // Event_Status3,
  // Event_Status13,
} from "../../lib/util";

dayjs.extend(buddhistEra);

const formatEventTime = (dateTime: string | null) => {
  if (!dateTime) return "ยังไม่ระบุ";
  return dayjs(dateTime)
    .subtract(7, "hour")
    .locale("th")
    .format("D/M/BBBB HH:mm");
};

const AllEventContent: React.FC = () => {
  // const [currentPage, setCurrentPage] = useState(1);

  const { data: events } = useFetchEventList({
    eventId: null,
  });

  return (
    <div
      className="all-events-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="" />

      <div
        style={{
          color: "black",
          display: "flex",
          justifyContent: "center",
          height: "60vh",
          alignItems: "center",
        }}
      >
        กำลังพัฒนา......
      </div>
    </div>
  );
};

export default AllEventContent;
