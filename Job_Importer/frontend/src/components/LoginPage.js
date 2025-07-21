"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "../css/loginPage.css";
import api from "../lib/api";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/loginByPassword", {
        userName,
        password,
      });

      const respData = response.data;
      if (respData.success) {
        Cookies.set('token', respData.token, { expires: 1 })
        alert("Login successful!");
        router.push("/logs");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Internal server error. Try after sometime."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={`p-0 loginWrapper`}>
      <Row className="g-0 vh-100">
        {/* Left Side - Form */}
        <Col
          md={6}
          className={`d-flex align-items-center justify-content-center formSection`}
        >
          <div className="w-75">
            <h2 className="mb-4 fw-bold border-bottom border-3 border-primary d-inline-block pb-1">
              Login
            </h2>

            <Form onSubmit={handleLogin}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="mb-3 text-end">
                <a href="#" className="text-decoration-none text-primary">
                  Forgot password?
                </a>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                style={{ backgroundColor: "#8000ff" }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Login"}
              </Button>

              <p className="text-center">
                Don’t have an account?{" "}
                <a href="#" className="text-primary text-decoration-none">
                  Signup now
                </a>
              </p>
            </Form>
          </div>
        </Col>

        {/* Right Side - Image + Text */}
        <Col md={6} className={`rightSection`}>
          <div className="text-white text-center px-4">
            <h2 className="fw-bold">Digital Job Importer</h2>
            <p className="fs-5">Login to know more</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
