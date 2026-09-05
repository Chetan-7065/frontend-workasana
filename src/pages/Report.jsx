import useFetch from "../useFetch";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export default function Report() {
  const {
    data: lastWeekReportData,
  } = useFetch("https://backend-workasana-ruby.vercel.app/report/last-week");
  console.log(lastWeekReportData)
  const {
    data: pendingTaskReportData,
  } = useFetch("https://backend-workasana-ruby.vercel.app/report/pending");
  console.log(pendingTaskReportData)
  const {
    data: closedTaskReportData,
  } = useFetch("https://backend-workasana-ruby.vercel.app/report/closed-tasks");
  console.log(closedTaskReportData)
  const {
    data: tasksData,
  } = useFetch("https://backend-workasana-ruby.vercel.app/task");
 
  // const data =  pendingTaskReportData
  //         ? pendingTaskReportData.map((item) => item.totalTimePending)
  //         : []
      

  const totalWorkAll = tasksData ? tasksData.length : 0;
  const totalLastWeekCompleted = lastWeekReportData
    ? lastWeekReportData.length
    : 0;
    const remainingWork = Math.max(0, totalWorkAll - totalLastWeekCompleted);
   
  const maxPendingDays = pendingTaskReportData ?  Math.max(...pendingTaskReportData.map((item) => item.totalTimePending), 0) : 6
  const maxCompletedTask = closedTaskReportData.byOwners ?  Math.max(...closedTaskReportData.byOwners.map((item) => item.totalCompleted), 0) : 6
  // const maxCompletedTaskByTeam = closedTaskReportData.byTeam ?  Math.max(...closedTaskReportData.byTeam.map((item) => item.totalCompleted), 0) : 6

  const isZeroCompleted = totalLastWeekCompleted === 0;

  const pieData = {
    labels: isZeroCompleted
      ? ["No Work Completed Last Week", "Remaining Work"]
      : ["Completed Last Week", "Other/Remaining Work"],
    datasets: [
      {
        data: isZeroCompleted
          ? [0, totalWorkAll || 1] // Keep a minimal slice visible if total is 0
          : [totalLastWeekCompleted, remainingWork],
        backgroundColor: isZeroCompleted
          ? ["#e5e7eb", "#cbd5e1"] // Subtle neutral grays when 0
          : ["#10b981", "#3b82f6"], // Emerald green and bright blue
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            if (isZeroCompleted && context.dataIndex === 0) {
              return " Completed Last Week: 0% (0 tasks)";
            }
            const percentage = ((value / totalWorkAll) * 100).toFixed(1);
            return ` ${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // --- Chart 2 Configuration ---
  const barData = {
    labels: pendingTaskReportData
      ? pendingTaskReportData.map((item) => item.status)
      : [],
    datasets: [
      {
        label: "Pending Work (Days)",
        data: pendingTaskReportData
          ? pendingTaskReportData.map((item) => item.totalTimePending)
          : [],
        backgroundColor: '#8b5cf6', // Amber/Orange
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} days pending`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Status",
          font: { weight: "bold" },
        },
         grid: {
          display: false, 
        },
      },
      y: {
        title: {
          display: true,
          text: "Pending Work (Days)",
          font: { weight: "bold" },
        },
        beginAtZero: true,
        max: maxPendingDays + 2, 
        ticks: {
          stepSize: 1, 
          precision: 0, 
        },
        grid: {
          display: false,
        },
      },
    },
  };


  // --- Chart 3 Configuration ---
  const teamsBarData = {
    labels: closedTaskReportData.byTeam
      ? closedTaskReportData.byTeam.map((item) => item.team)
      : [],
    datasets: [
      {
        label: "Tasks Completed",
        data: closedTaskReportData.byTeam
          ? closedTaskReportData.byTeam.map((item) => item.totalCompleted)
          : [],
        backgroundColor: "#f43f5e", // Amber/Orange
        borderRadius: 6,
      },
    ],
  };

  const teamsBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} tasks completed`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Teams",
          font: { weight: "bold" },
        },
         grid: {
          display: false, 
        },
      },
      y: {
        title: {
          display: true,
          text: "Completed Task ",
          font: { weight: "bold" },
        },
        beginAtZero: true,
        max: maxCompletedTask + 2, 
        ticks: {
          stepSize: 1, 
          precision: 0, 
        },
        grid: {
          display: false,
        },
      },
    },
  };


  // --- Chart 4 Configuration ---
  const ownersBarData = {
    labels: closedTaskReportData.byOwners
      ? closedTaskReportData.byOwners.map((item) => item.owner)
      : [],
    datasets: [
      {
        label: "Tasks Completed",
        data: closedTaskReportData.byOwners
          ? closedTaskReportData.byOwners.map((item) => item.totalCompleted)
          : [],
        backgroundColor: "#f59e0b", // Amber/Orange
        borderRadius: 6,
      },
    ],
  };

  const ownersBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} tasks completed`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Owners",
          font: { weight: "bold" },
        },
         grid: {
          display: false, 
        },
      },
      y: {
        title: {
          display: true,
          text: "Completed Task ",
          font: { weight: "bold" },
        },
        beginAtZero: true,
        max: maxCompletedTask + 2, 
        ticks: {
          stepSize: 1, 
          precision: 0, 
        },
        grid: {
          display: false,
        },
      },
    },
  };

  
  return (
    <>
      <div
        style={{
          width: "100%", // Takes full available width
          maxWidth: "1800px",
          marginBlock: "10px",
          marginInline: "5px",
          padding: "24px",
          fontFamily: "sans-serif",
        }}
      >
        <h2 className="fw-bold text-dark"
          style={{
            // fontSize: "24px",
            // fontWeight: "bold",
            marginBottom: "24px",
            color: "#1e293b",
          }}
        >
          Work Progress & Pending Days Report
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "50px",
            width: "100%",
          }}
        >
          {/* Chart 1 Card */}
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "4px",
                color: "#334155",
              }}
            >
              Work Completed Last Week vs Total
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Overall progress across all active projects
            </p>

            <div style={{ height: "300px", position: "relative" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>

            {/* Fallback indicator banner for 0 data */}
            {isZeroCompleted && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                ⚠️ No work was completed in the last week (0% progress).
              </div>
            )}
          </div>

          {/* Chart 2 Card */}
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "4px",
                color: "#334155",
              }}
            >
              Pending Tasks Duration
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Total days of work pending per status
            </p>

            <div style={{ height: "300px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "50px",
            width: "100%",
          }}
        >
          {/* Chart 3 Card */}
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "4px",
                color: "#334155",
              }}
            >
             Teams Tasks 
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Total tasks completed by owners
            </p>

            <div style={{ height: "300px" }}>
              <Bar data={teamsBarData} options={teamsBarOptions} />
            </div>
          </div>


          {/* Chart 4 Card */}
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "4px",
                color: "#334155",
              }}
            >
             Owners Tasks 
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Total tasks completed by owners
            </p>

            <div style={{ height: "300px" }}>
              <Bar data={ownersBarData} options={ownersBarOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
