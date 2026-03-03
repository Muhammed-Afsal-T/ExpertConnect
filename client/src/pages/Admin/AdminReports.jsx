import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AdminReports.module.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    fetchReports(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const fetchReports = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://expertconnect-backend-3hhu.onrender.com/api/v1/booking/get-all-reports?page=${currentPage}&limit=20`);
      if (res.data.success) {
        setReports(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.log("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate('/admin')}>
          <FaArrowLeft /> Back to Dashboard
        </div>

        <h2 className={styles.heading}>Reports & Complaints</h2>
        
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
                    <td data-label="User">
                      <div className={styles.dataWrapper}>
                        <strong>{report.userId?.name}</strong>
                        <span className={styles.subText}>{report.userId?.email}</span>
                      </div>
                    </td>
                    <td data-label="Expert">
                      <div className={styles.dataWrapper}>
                        <strong>{report.expertId?.name}</strong>
                        <span className={styles.subText}>{report.expertId?.specialization}</span>
                      </div>
                    </td>
                    <td data-label="Session">
                      <div className={styles.dataWrapper}>
                        <span>{report.day}</span>
                        <span className={styles.timeLabel}>{report.slot.startTime} - {report.slot.endTime}</span>
                      </div>
                    </td>
                    <td data-label="Amount">₹{report.amount}</td>
                    <td data-label="Message" className={styles.reportCell}>
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
          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Prev</button>
              <span className={styles.pageInfo}>Page <strong>{page}</strong> of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminReports;