import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Typography,
  Divider,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import {
  CalculatorOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../state/UserProvider";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const { Title, Text } = Typography;

const NewTransaction = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [buyerUsername, setBuyerUsername] = useState("");
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const fetchBuyer = async () => {
      if (buyerUsername.trim()) {
        setBuyerLoading(true);
        try {
          const token = localStorage.getItem("userToken");
          const response = await fetch(
            `http://localhost:5000/api/users/username/${buyerUsername}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.ok) {
            const buyerData = await response.json();
            setBuyerInfo(buyerData);
          } else if (response.status === 401) {
            logout();
            message.error("Session expired. Please log in again.");
            navigate("/login", { replace: true });
            setBuyerInfo(null);
          } else {
            setBuyerInfo(null);
          }
        } catch {
          setBuyerInfo(null);
        } finally {
          setBuyerLoading(false);
        }
      } else {
        setBuyerInfo(null);
      }
    };
    const timeoutId = setTimeout(fetchBuyer, 500);
    return () => clearTimeout(timeoutId);
  }, [buyerUsername]);

  const handlePlaceOrder = async (values) => {
    if (!buyerInfo) {
      Modal.error({
        title: "Error",
        content: "Please enter a valid Buyer Username",
      });
      return;
    }

    if (buyerInfo.username === user.username) {
      Modal.error({
        title: "Error",
        content: "You cannot create a transaction with your own username.",
      });
      return;
    }

    setLoading(true);

    try {
      const productPriceNum = parseFloat(values.productPrice);
      const quantityNum = parseInt(values.quantity);
      const orderData = {
        productName: values.productName,
        productPrice: productPriceNum,
        quantity: quantityNum,
        sellerUserId: user._id,
        sellerUsername: user.username,
        buyerUserId: buyerInfo._id,
        buyerUsername: buyerInfo.username,
        buyerLocation: buyerInfo.location,
      };

      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setSuccessModalVisible(true);
        form.resetFields();
        setBuyerUsername("");
        setBuyerInfo(null);
      } else if (response.status === 401) {
        logout();
        message.error("Session expired. Please log in again.");
        navigate("/login", { replace: true });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }
    } catch {
      Modal.error({
        title: "Error",
        content: "Failed to place order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isSameUser = buyerInfo && buyerInfo.username === user.username;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="group relative overflow-hidden" onMouseMove={handleMouseMove} style={{ background: "radial-gradient(circle at top left, rgba(16,185,129,0.14), transparent 30%), linear-gradient(135deg, #0B1A13 0%, #050D0A 55%, #000000 100%)", minHeight: "100vh" }}>
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          padding: "40px",
        }}
      >
      <Card
        title={
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }}>
            <Title level={3} style={{ margin: 0, color: "#fff" }}>
              <CalculatorOutlined style={{ marginRight: 8, color: "#86efac" }} /> New Transaction
            </Title>
          </motion.div>
        }
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: "40px",
          boxShadow: "0 30px 120px rgba(0,0,0,0.35)",
          padding: "24px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          color: "#fff",
        }}
      >
        <Form form={form} layout="vertical" onFinish={handlePlaceOrder} initialValues={{ quantity: 1 }}>
          <Divider orientation="left" style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.1)" }}>Product & Order Details</Divider>
          <Row gutter={20}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="productName"
                label={<Text strong style={{ color: "#fff" }}>Product Name</Text>}
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="productPrice"
                label={<Text strong style={{ color: "#fff" }}>Product Price ($)</Text>}
                rules={[{ required: true, message: "Please enter product price" }]}
              >
                <Input type="number" step="0.01" placeholder="0.00" prefix="$" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="quantity"
                label={<Text strong style={{ color: "#fff" }}>Quantity</Text>}
                rules={[{ required: true, message: "Please enter quantity" }]}
              >
                <Input type="number" min="1" placeholder="1" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item shouldUpdate>
                {() => {
                  const values = form.getFieldsValue(["productPrice", "quantity"]);
                  const total =
                    values.productPrice && values.quantity
                      ? (parseFloat(values.productPrice) * parseInt(values.quantity)).toFixed(2)
                      : "0.00";
                  return (
                    <Card
                      size="small"
                      style={{
                        borderRadius: 28,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      <Text strong style={{ fontSize: 16, color: "#86efac" }}>
                        <CalculatorOutlined /> Total: ${total}
                      </Text>
                    </Card>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.1)" }}>Seller Information</Divider>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card size="small" bordered style={{ borderRadius: 28, background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}>
                <Text strong style={{ color: "#fff" }}><UserOutlined /> Username: </Text> {user?.username || "N/A"}
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" bordered style={{ borderRadius: 28, background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}>
                <Text strong style={{ color: "#fff" }}><EnvironmentOutlined /> Location: </Text> {user?.location || "N/A"}
              </Card>
            </Col>
          </Row>

          <Divider orientation="left" style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.1)" }}>Buyer Information</Divider>
          <Card size="small" bordered={false} style={{ borderRadius: 28, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Form.Item
              label={<Text strong style={{ color: "#fff" }}>Buyer Username</Text>}
              help="Enter the buyer's username"
              style={{ marginBottom: 12 }}
            >
              <Input
                value={buyerUsername}
                onChange={(e) => setBuyerUsername(e.target.value)}
                placeholder="Enter buyer's username"
                size="large"
              />
            </Form.Item>

            {buyerLoading && (
              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <Spin size="small" /> <Text style={{ color: "#cbd5e1" }}>Searching for buyer...</Text>
              </div>
            )}

            {buyerInfo && !buyerLoading && !isSameUser && (
              <Alert
                message={<span style={{ color: "#fff" }}>Buyer Found: <Text strong style={{ color: "#fff" }}>{buyerInfo.username}</Text></span>}
                description={<span style={{ color: "#cbd5e1" }}>Location: <Text strong style={{ color: "#fff" }}>{buyerInfo.location || "N/A"}</Text></span>}
                type="success"
                showIcon
                style={{ marginTop: 12 }}
              />
            )}

            {isSameUser && (
              <Alert
                message="Invalid Buyer"
                description="You cannot create a transaction with your own username"
                type="error"
                showIcon
                style={{ marginTop: 12 }}
              />
            )}

            {buyerUsername && !buyerInfo && !buyerLoading && (
              <Alert
                message="No user found"
                description="Please check the username and try again"
                type="error"
                showIcon
                style={{ marginTop: 12 }}
              />
            )}
          </Card>

          <Form.Item style={{ marginTop: 32 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!buyerInfo || isSameUser}
                size="large"
                style={{
                  width: "100%",
                  borderRadius: "9999px",
                  height: "50px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Place Order
              </Button>
            </motion.div>
          </Form.Item>
        </Form>

          <Modal
          open={successModalVisible}
          onOk={() => setSuccessModalVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setSuccessModalVisible(false)}>
              Close
            </Button>,
          ]}
          centered
        >
          <Title level={4} style={{ color: "#52c41a", textAlign: "center" }}>
            <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            Order Placed Successfully!
          </Title>
          <Text style={{ display: "block", textAlign: "center", marginTop: 10 }}>
            Waiting for buyer approval.
          </Text>
        </Modal>
      </Card>
      </motion.div>
    </div>
  );
};

export default NewTransaction;
