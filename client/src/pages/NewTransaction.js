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
import { CalculatorOutlined, UserOutlined, ShoppingCartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useUser } from "../state/UserProvider";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const NewTransaction = () => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellerUserId, setSellerUserId] = useState("");

  const totalPrice =
    productPrice && quantity
      ? (parseFloat(productPrice) * parseInt(quantity)).toFixed(2)
      : "0.00";

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (sellerUserId.trim()) {
        setSellerLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/users/${sellerUserId}`);
          if (response.ok) {
            const sellerData = await response.json();
            setSellerInfo(sellerData);
          } else {
            setSellerInfo(null);
          }
        } catch {
          setSellerInfo(null);
        } finally {
          setSellerLoading(false);
        }
      } else {
        setSellerInfo(null);
      }
    };

    const timeoutId = setTimeout(fetchSellerInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [sellerUserId]);

  const handlePlaceOrder = async (values) => {
    if (!sellerInfo) {
      Modal.error({
        title: "Error",
        content: "Please enter a valid Seller User ID",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        productName: values.productName,
        productPrice: parseFloat(values.productPrice),
        quantity: parseInt(values.quantity),
        totalPrice: parseFloat(totalPrice),
        buyerUsername: user.username,
        buyerLocation: user.location,
        sellerUserId: sellerInfo._id,
        sellerUsername: sellerInfo.username,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setSuccessModalVisible(true);
        form.resetFields();
        setSellerUserId("");
        setSellerInfo(null);
      } else {
        throw new Error("Failed to place order");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ padding: "40px", background: "#f4f5f7", minHeight: "100vh" }}
    >
      <Card
        title={
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <Title level={3} style={{ margin: 0 }}>
              <ShoppingCartOutlined style={{ marginRight: 8 }} /> New Transaction
            </Title>
          </motion.div>
        }
        style={{
          maxWidth: 950,
          margin: "0 auto",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: "24px",
          background: "#ffffff",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePlaceOrder}
          initialValues={{ quantity: 1 }}
        >
          <Divider orientation="left">Product & Order Details</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="productName"
                label={<Text strong>Product Name</Text>}
                rules={[{ required: true, message: "Please enter product name" }]}
              >
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="productPrice"
                label={<Text strong>Product Price ($)</Text>}
                rules={[{ required: true, message: "Please enter product price" }]}
              >
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  prefix="$"
                  onChange={(e) => setProductPrice(e.target.value)}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label={<Text strong>Quantity</Text>}
                rules={[{ required: true, message: "Please enter quantity" }]}
              >
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  onChange={(e) => setQuantity(e.target.value)}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label={<Text strong>Total Price</Text>}>
                <Input
                  value={`$${totalPrice}`}
                  disabled
                  prefix={<CalculatorOutlined />}
                  style={{
                    fontWeight: "bold",
                    color: "#1890ff",
                    borderRadius: "8px",
                  }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Buyer Information</Divider>
          <Card size="small" bordered={false} style={{ marginBottom: 16, borderRadius: 12 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label={<Text strong><UserOutlined /> Username</Text>}>
                  <Text strong>{user?.username || "N/A"}</Text>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={<Text strong><EnvironmentOutlined /> Location</Text>}>
                  <Text strong>{user?.location || "N/A"}</Text>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Divider orientation="left">Seller Information</Divider>
          <Card size="small" bordered={false} style={{ borderRadius: 12 }}>
            <Form.Item
              label={<Text strong>Seller User ID</Text>}
              help="Enter the seller's User ID to find their information"
            >
              <Input
                value={sellerUserId}
                onChange={(e) => setSellerUserId(e.target.value)}
                placeholder="Enter seller's User ID"
                size="large"
              />
            </Form.Item>

            {sellerLoading && (
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                <Spin size="small" /> <Text type="secondary">Searching for seller...</Text>
              </div>
            )}

            {sellerInfo && !sellerLoading && (
              <Alert
                message={<span>Seller Found: <Text strong>{sellerInfo.username}</Text></span>}
                description={<span>Location: <Text strong>{sellerInfo.location || "N/A"}</Text></span>}
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {sellerUserId && !sellerInfo && !sellerLoading && (
              <Alert
                message="No user found with this User ID"
                description="Please check the User ID and try again"
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
          </Card>

          <Form.Item style={{ marginTop: 24 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!sellerInfo}
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
            ✅ Order Placed Successfully!
          </Title>
          <Text style={{ display: "block", textAlign: "center", marginTop: 10 }}>
            Waiting for seller approval.
          </Text>
        </Modal>
      </Card>
    </motion.div>
  );
};

export default NewTransaction;
