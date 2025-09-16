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
} from "antd";
import {
  CalculatorOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useUser } from "../state/UserProvider";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const NewTransaction = () => {
  const { user } = useUser();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ padding: "40px", background: "#f9f9fb", minHeight: "100vh" }}
    >
      <Card
        title={
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Title level={3} style={{ margin: 0 }}>
              <CalculatorOutlined style={{ marginRight: 8 }} /> New Transaction
            </Title>
          </motion.div>
        }
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "24px",
          background: "#ffffff",
        }}
      >
        <Form form={form} layout="vertical" onFinish={handlePlaceOrder} initialValues={{ quantity: 1 }}>
          <Divider orientation="left">Product & Order Details</Divider>
          <Row gutter={20}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="productName"
                label={<Text strong>Product Name</Text>}
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="productPrice"
                label={<Text strong>Product Price ($)</Text>}
                rules={[{ required: true, message: "Please enter product price" }]}
              >
                <Input type="number" step="0.01" placeholder="0.00" prefix="$" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="quantity"
                label={<Text strong>Quantity</Text>}
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
                        borderRadius: 12,
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      <Text strong style={{ fontSize: 16, color: "#389e0d" }}>
                        <CalculatorOutlined /> Total: ${total}
                      </Text>
                    </Card>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Seller Information</Divider>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card size="small" bordered style={{ borderRadius: 12 }}>
                <Text strong><UserOutlined /> Username: </Text> {user?.username || "N/A"}
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small" bordered style={{ borderRadius: 12 }}>
                <Text strong><EnvironmentOutlined /> Location: </Text> {user?.location || "N/A"}
              </Card>
            </Col>
          </Row>

          <Divider orientation="left">Buyer Information</Divider>
          <Card size="small" bordered={false} style={{ borderRadius: 12, background: "#fafafa" }}>
            <Form.Item
              label={<Text strong>Buyer Username</Text>}
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
                <Spin size="small" /> <Text type="secondary">Searching for buyer...</Text>
              </div>
            )}

            {buyerInfo && !buyerLoading && !isSameUser && (
              <Alert
                message={<span>Buyer Found: <Text strong>{buyerInfo.username}</Text></span>}
                description={<span>Location: <Text strong>{buyerInfo.location || "N/A"}</Text></span>}
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
                  borderRadius: "12px",
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
  );
};

export default NewTransaction;
