import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Spin,
  Alert,
  Typography,
  Divider,
  Button,
  Row,
  Col,
  Statistic,
  Tabs,
  Space,
  Badge,
  message,
  Modal,
} from "antd";
import {
  SyncOutlined,
  ShoppingOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useUser } from "../state/UserProvider";

const { Title, Text } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const createAPIClient = () => {
  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      message.error("Authentication required. Please log in again.");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleResponse = async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("userToken");
      message.error("Session expired. Please log in again.");
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const fetchWithTimeout = (url, options = {}, timeout = 8000) =>
    Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
    ]);

  return {
    getUserTransactions: async () => handleResponse(await fetchWithTimeout(`${API_BASE_URL}/transactions/user`, { headers: getAuthHeaders() })),
    getTransactionById: async (id) => handleResponse(await fetchWithTimeout(`${API_BASE_URL}/transactions/${id}`, { headers: getAuthHeaders() })),
    updateTransactionStatus: async (transactionId, status) =>
      handleResponse(await fetchWithTimeout(`${API_BASE_URL}/transactions/${transactionId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })),
  };
};

export default function MyTransactions() {
  const { user } = useUser() || {};
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiClient] = useState(() => createAPIClient());

  const fetchTransactions = async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      let data = await apiClient.getUserTransactions();
      if (activeTab === "buying") data = data.filter(t => t.buyerUsername === user.username);
      if (activeTab === "selling") data = data.filter(t => t.sellerUsername === user.username);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load transactions");
      message.error(err.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [user, activeTab]);

  const handleRefresh = () => { setRefreshing(true); fetchTransactions(); };
  const handleTabChange = (key) => { setActiveTab(key); setLoading(true); };

  const handleStatusUpdate = async (transactionId, newStatus) => {
    try { await apiClient.updateTransactionStatus(transactionId, newStatus); message.success("Transaction status updated"); fetchTransactions(); }
    catch (err) { console.error(err); message.error(err.message || "Failed to update transaction"); }
  };

  const viewTransactionDetails = async (transactionId) => {
    try { const transaction = await apiClient.getTransactionById(transactionId); setSelectedTransaction(transaction); setModalVisible(true); }
    catch (err) { console.error(err); message.error(err.message || "Failed to load transaction details"); }
  };

  const totalSpent = transactions.filter(t => t.buyerUsername === user?.username).reduce((sum, t) => sum + (t.totalPrice || t.productPrice || 0), 0);
  const totalEarned = transactions.filter(t => t.sellerUsername === user?.username).reduce((sum, t) => sum + (t.totalPrice || t.productPrice || 0), 0);
  const pendingTransactions = transactions.filter(t => t.status === "pending").length;

  const columns = [
    { title: "Product", dataIndex: "productName", key: "productName", render: (text, record) => <Button type="link" onClick={() => viewTransactionDetails(record._id || record.id)} style={{ padding: 0 }}><Text strong>{text || "Unknown Product"}</Text></Button> },
    { title: "Price", dataIndex: "productPrice", key: "productPrice", render: price => `$${price || 0}` },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", render: q => q || 1 },
    { title: "Total", dataIndex: "totalPrice", key: "totalPrice", render: (total, record) => <Text type="success">${total || (record.productPrice || 0) * (record.quantity || 1)}</Text> },
    { title: "Counterparty", key: "counterparty", render: (_, record) => record.buyerUsername === user?.username ? `Seller: ${record.sellerUsername || "Unknown Seller"}` : `Buyer: ${record.buyerUsername || "Unknown Buyer"}` },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: date => date ? new Date(date).toLocaleDateString() : "Unknown" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (status, record) => {
        const isBuyer = record.buyerUsername === user?.username;
        let color = status === "completed" ? "green" : status === "cancelled" ? "red" : "orange";
        let icon = status === "completed" ? <CheckCircleOutlined /> : status === "cancelled" ? <CloseCircleOutlined /> : null;
        return <Space>
          <Tag color={color} icon={icon}>{(status || "pending").toUpperCase()}</Tag>
          {activeTab === "buying" && status === "pending" && isBuyer &&
            <Button size="small" type="primary" onClick={() => handleStatusUpdate(record._id || record.id, "completed")}>Complete</Button>}
        </Space>;
      }
    }
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}><Spin size="large" /></div>;

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={2}>My Transactions</Title></Col>
        <Col><Button icon={<SyncOutlined />} loading={refreshing} onClick={handleRefresh}>Refresh</Button></Col>
      </Row>

      {error && <Alert
        message="Error"
        description={<div><p>{error}</p><p style={{ marginTop: 10, fontSize: 12 }}><ExclamationCircleOutlined /> Check backend server</p></div>}
        type="error"
        showIcon
        closable
        onClose={() => setError(null)}
        style={{ marginBottom: 16 }}
      />}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Total Transactions" value={transactions.length} prefix={<SyncOutlined />} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Total Spent" value={totalSpent} precision={2} valueStyle={{ color: "#cf1322" }} prefix="$" /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Total Earned" value={totalEarned} precision={2} valueStyle={{ color: "#3f8600" }} prefix="$" /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card><Statistic title="Pending" value={pendingTransactions} valueStyle={{ color: "#faad14" }} /></Card></Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
        { key: "all", label: "All Transactions" },
        { key: "buying", label: <span>Buying <Badge count={transactions.filter(t => t.buyerUsername === user?.username).length} offset={[8, -2]} /></span> },
        { key: "selling", label: <span>Selling <Badge count={transactions.filter(t => t.sellerUsername === user?.username).length} offset={[8, -2]} /></span> }
      ]}/>

      <Card style={{ marginTop: 16 }}>
        {transactions.length > 0 ? (
          <Table columns={columns} dataSource={transactions.map((t, i) => ({ ...t, key: t._id || t.id || i }))} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <ShoppingOutlined style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }} />
            <p>No transactions found</p>
            {error ? <Button type="primary" onClick={handleRefresh} style={{ marginTop: 16 }}>Try Again</Button> : <p style={{ color: "#999" }}>Your transactions will appear here</p>}
          </div>
        )}
      </Card>

      <Modal title="Transaction Details" open={modalVisible} onCancel={() => setModalVisible(false)} footer={[<Button key="close" onClick={() => setModalVisible(false)}>Close</Button>]} width={600}>
        {selectedTransaction && (
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>Product:</strong> {selectedTransaction.productName || "Unknown"}</p>
              <p><strong>Price:</strong> ${selectedTransaction.productPrice || 0}</p>
              <p><strong>Quantity:</strong> {selectedTransaction.quantity || 1}</p>
              <p><strong>Total:</strong> ${selectedTransaction.totalPrice || 0}</p>
            </Col>
            <Col span={12}>
              <p><strong>Status:</strong> <Tag color={selectedTransaction.status === "completed" ? "green" : selectedTransaction.status === "cancelled" ? "red" : "orange"} style={{ marginLeft: 8 }}>{(selectedTransaction.status || "pending").toUpperCase()}</Tag></p>
              <p><strong>Buyer:</strong> {selectedTransaction.buyerUsername || "Unknown Buyer"}</p>
              <p><strong>Seller:</strong> {selectedTransaction.sellerUsername || "Unknown Seller"}</p>
              <p><strong>Date:</strong> {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : "Unknown"}</p>
            </Col>
            <Col span={24}><Divider /><p><strong>Location:</strong> {selectedTransaction.buyerLocation || selectedTransaction.location || "Not specified"}</p></Col>
          </Row>
        )}
      </Modal>
    </div>
  );
}
