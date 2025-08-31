import React, { useState, useEffect } from "react";
import { Card, Descriptions, Tag, Button, Modal, Form, Input, Row, Col, Select, message, Spin } from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { useUser } from "../state/UserProvider";
import profileImage from "../assets/profile.jpg";

const countryCodes = [
  { value: "+880", label: "+880" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];

export default function Dashboard() {
  const { user, loading, updateUser, changePassword, refreshUser } = useUser();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileForm] = Form.useForm();
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    console.log('Current user data:', user);
  }, [user]);

  const refreshUserData = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error("Failed to refresh data:", error);
      message.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const openEdit = () => {
    if (!user) return;
    
    const [code, ...rest] = (user.phone || "").split(" ");
    profileForm.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneCode: code || "+880",
      phoneNumber: rest.join(" ") || "",
      location: user.location,
    });
    pwdForm.resetFields();
    setOpen(true);
  };

  const onSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields();
      setSaving(true);
      
      const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        phone: `${values.phoneCode} ${values.phoneNumber}`.trim(),
        location: values.location,
      };
      
      console.log('Attempting to update with:', updatedData);
      
      const result = await updateUser(updatedData);
      console.log('Update successful:', result);
      
      setOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    try {
      const v = await pwdForm.validateFields();
      if (v.newPassword !== v.confirmPassword) {
        message.error("Passwords don't match");
        return;
      }
      
      setSaving(true);
      await changePassword({
        oldPassword: v.oldPassword,
        newPassword: v.newPassword
      });
    } catch (err) {
      console.error("Password error:", err);
    } finally {
      setSaving(false);
    }
  };

  const onModalSave = async () => {
    try {
      await onSaveProfile();
      const pwdVals = pwdForm.getFieldsValue();
      if (pwdVals.oldPassword && pwdVals.newPassword) {
        await onChangePassword();
      }
    } catch (error) {
      console.error('Modal save error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2>Your personal profile info</h2>
        <Card>
          <p>No user data available</p>
          <Button type="primary" onClick={refreshUserData} icon={<SyncOutlined />}>
            Refresh Data
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Your personal profile info</h2>
        <Button icon={<SyncOutlined />} loading={refreshing} onClick={refreshUserData}>
          Refresh
        </Button>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 12 }}>
          <img src={profileImage} alt="Profile" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h3>
            <div style={{ color: "#6b7280" }}>{user.username} • {user.email}</div>
          </div>
          <Tag color="blue">{user.role}</Tag>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="First name">{user.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last name">{user.lastName}</Descriptions.Item>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Location">{user.location}</Descriptions.Item>
          <Descriptions.Item label="User ID">{user._id}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown'}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 18 }}>
          <Button type="primary" icon={<EditOutlined />} onClick={openEdit}>
            Update profile
          </Button>
        </div>
      </Card>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onModalSave}
        confirmLoading={saving}
        width={800}
      >
        <h3>Edit Profile</h3>
        
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <Form form={profileForm} layout="vertical">
              <Form.Item name="firstName" label="First name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ type: "email", required: true }]}>
                <Input />
              </Form.Item>
              
              <Form.Item label="Phone number">
                <Input.Group compact>
                  <Form.Item name="phoneCode" noStyle rules={[{ required: true }]}>
                    <Select options={countryCodes} style={{ width: "30%" }} />
                  </Form.Item>
                  <Form.Item name="phoneNumber" noStyle rules={[{ required: true }]}>
                    <Input style={{ width: "70%" }} placeholder="Phone number" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} md={12}>
            <h4>Change Password</h4>
            <Form form={pwdForm} layout="vertical">
              <Form.Item name="oldPassword" label="Old Password">
                <Input.Password />
              </Form.Item>
              <Form.Item name="newPassword" label="New Password">
                <Input.Password />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm Password">
                <Input.Password />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}