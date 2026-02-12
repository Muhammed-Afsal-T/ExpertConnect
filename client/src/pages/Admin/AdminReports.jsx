import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AdminReports.module.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/booking/get-all-reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching reports", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* --- പുതിയ ബാക്ക് ബട്ടൺ --- */}
        <div className={styles.backBtn} onClick={() => navigate('/admin')}>
          <FaArrowLeft /> Back to Dashboard
        </div>

        <h2 className={styles.heading}>User Reports & Complaints</h2>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Expert Details</th>
                <th>Session Info</th>
                <th>Amount</th>
                <th>Report Message</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td>
                      <strong>{report.userId?.name}</strong><br />
                      <span className={styles.subText}>{report.userId?.email}</span>
                    </td>
                    <td>
                      <strong>{report.expertId?.name}</strong><br />
                      <span className={styles.subText}>{report.expertId?.specialization}</span>
                    </td>
                    <td>
                      {report.day}<br />
                      <span className={styles.timeLabel}>{report.slot.startTime} - {report.slot.endTime}</span>
                    </td>
                    <td>₹{report.amount}</td>
                    <td className={styles.reportCell}>
                      <div className={styles.reasonBox}>{report.report?.reason}</div>
                      {report.report?.reportedAt && (
                        <span className={styles.dateLabel}>
                          Reported on: {new Date(report.report.reportedAt).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminReports;