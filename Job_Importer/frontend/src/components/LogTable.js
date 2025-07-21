"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Container,
  Button,
  Card,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import Cookies from "js-cookie";

export default function LogTable() {
  const router = useRouter();
  const token = Cookies.get('token');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const getTokenFromCookies = () => {
    return Cookies.get("token") || null;
  };

  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchLog = async () => {
    try {
      setLoading(true);
      const response = await api.get("log/getLogs", {
        params: { page, limit },
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      const respData = response.data;
      if (respData.success) {
        setLogs(respData.data);
        setTotalPages(respData.pagination.totalPages || 1);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLog();
    }
  }, [page, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Job Import Logs</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table
              striped
              bordered
              hover
              responsive
              className="mb-0 text-center"
            >
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Imported</th>
                  <th>New</th>
                  <th>Updated</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <tr key={i}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.totalFetched}</td>
                      <td>{log.totalImported}</td>
                      <td>{log.newJobs}</td>
                      <td>{log.updatedJobs}</td>
                      <td>{log.failedJobs?.length || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Pagination Buttons */}
      <Row className="mt-3 justify-content-between align-items-center">
        <Col xs="auto">
          <Button
            variant="outline-primary"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            ← Previous
          </Button>
        </Col>
        <Col className="text-center text-muted">
          Page {page} of {totalPages}
        </Col>
        <Col xs="auto" className="text-end">
          <Button
            variant="outline-primary"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next →
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
