import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventManagement.css";
import "./DataReport.css";

function DataReport() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchVolunteers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/datareport/report`);
    setVolunteers(res.data.volunteers || []);
    return res.data.volunteers || [];
  };

  const fetchEvents = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/datareport/event_report`);
    setEvents(res.data.events || []);
    return res.data.events || [];
  };

  React.useEffect(() => {
    fetchVolunteers();
    fetchEvents();
  }, []);

  const handleNavToVolMatching = () => {
    navigate("/adminMatching");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleExportCSV = () => {
    if (!volunteers.length) return;
    const headers = ["Name", "Email", "City", "State", "Preferences", "Event History"];
    const rows = volunteers.map(v => [
      `"${v.full_name}"`,
      `"${v.email}"`,
      `"${v.city}"`,
      `"${v.state}"`,
      `"${v.preferences}"`,
      `"${(v.event_history && v.event_history.length > 0 ? v.event_history.join("; ") : "None")}"`
    ]);
    const csvContent =
      [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "volunteer_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!volunteers.length) return;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Volunteer Data Report", 10, 10);

    // Prepare table data
    const headers = [["Name", "Email", "City", "State", "Preferences", "Event History"]];
    const rows = volunteers.map(v => [
      v.full_name,
      v.email,
      v.city,
      v.state,
      v.preferences,
      v.event_history && v.event_history.length > 0 ? v.event_history.join(", ") : "None"
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
      styles: { fontSize: 10, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 182, 246] },
      columnStyles: {
        0: { cellWidth: 35 }, // Name
        1: { cellWidth: 45 }, // Email
        2: { cellWidth: 20 }, // City
        3: { cellWidth: 15 }, // State
        4: { cellWidth: 40 }, // Preferences
        5: { cellWidth: 40 }  // Event History
      }
    });

    doc.save("volunteer_report.pdf");
  };

  const handleExportEventCSV = () => {
    if (!events.length) return;
    const headers = [
      "Event Name", "City", "State", "Date", "Urgency", "Max Volunteers", "Volunteers Signed Up"
    ];
    const rows = events.map(e => [
      `"${e.event_name}"`,
      `"${e.city}"`,
      `"${e.state}"`,
      `"${e.event_date ? e.event_date.split("T")[0] : ""}"`,
      `"${e.urgency}"`,
      `"${e.max_volunteers}"`,
      `"${(e.volunteers && e.volunteers.length > 0 ? e.volunteers.join("; ") : "None")}"`
    ]);
    const csvContent =
      [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportEventPDF = async () => {
    if (!events.length) return;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Event Data Report", 10, 10);

    const headers = [["Event Name", "City", "State", "Date", "Urgency", "Max Volunteers", "Volunteers Signed Up"]];
    const rows = events.map(e => [
      e.event_name,
      e.city,
      e.state,
      e.event_date ? e.event_date.split("T")[0] : "",
      e.urgency,
      e.max_volunteers,
      e.volunteers && e.volunteers.length > 0 ? e.volunteers.join(", ") : "None"
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
      styles: { fontSize: 10, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 182, 246] },
      columnStyles: {
        0: { cellWidth: 35 }, // Event Name
        1: { cellWidth: 25 }, // City
        2: { cellWidth: 15 }, // State
        3: { cellWidth: 20 }, // Date
        4: { cellWidth: 20 }, // Urgency
        5: { cellWidth: 25 }, // Max Volunteers
        6: { cellWidth: 50 }  // Volunteers Signed Up
      }
    });

    doc.save("event_report.pdf");
  };

  return (
    <div className="emp-container">
      <div className="emp-sidebar">
        <div className="emp-sidebar-links">
            <div className="emp-sidebar-link" onClick={() => navigate("/eventManagement")}>Events</div>
          <div className="emp-sidebar-link" onClick={handleNavToVolMatching}>Volunteer Matching</div>
          <div className="emp-sidebar-link active">Data Report</div>
        </div>
        <div className="emp-logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="emp-main">
        <h2>Volunteer Data Report</h2>
        <div className="dr-actions">
          <button className="dr-btn" onClick={handleExportCSV}>Export CSV</button>
          <button className="dr-btn" onClick={handleExportPDF}>Export PDF</button>
        </div>
        <table className="dr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>State</th>
              <th>Preferences</th>
              <th>Event History</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, idx) => (
              <tr key={idx}>
                <td>{v.full_name}</td>
                <td>{v.email}</td>
                <td>{v.city}</td>
                <td>{v.state}</td>
                <td>{v.preferences}</td>
                <td>
                  {v.event_history && v.event_history.length > 0
                    ? v.event_history.join(", ")
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{marginTop: "48px"}}>Event Data Report</h2>
        <div className="dr-actions">
          <button className="dr-btn" onClick={handleExportEventCSV}>Export CSV</button>
          <button className="dr-btn" onClick={handleExportEventPDF}>Export PDF</button>
        </div>
        <table className="dr-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>City</th>
              <th>State</th>
              <th>Date</th>
              <th>Urgency</th>
              <th>Max Volunteers</th>
              <th>Volunteers Signed Up</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={idx}>
                <td>{e.event_name}</td>
                <td>{e.city}</td>
                <td>{e.state}</td>
                <td>{e.event_date ? e.event_date.split("T")[0] : ""}</td>
                <td>{e.urgency}</td>
                <td>{e.max_volunteers}</td>
                <td>
                  {e.volunteers && e.volunteers.length > 0
                    ? e.volunteers.join(", ")
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataReport;