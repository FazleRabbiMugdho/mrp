import React, { useState } from "react";
import { Card, Descriptions, Tag, Button, Modal, Form, Input, Row, Col, Select, message } from "antd";
import { motion } from "framer-motion";
import { EditOutlined } from "@ant-design/icons";
import { dummyUser, updateUserLocally } from "../state/userStore";
import profileImage from "../assets/profile.jpg"; 

const countryCodes = [
  { value: "+880", label: "+880" },
  { value: "+380", label: "+380" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];

export default function Dashboard() {
  const [user, setUser] = useState(dummyUser);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm] = Form.useForm();
  const [pwdForm] = Form.useForm();

  const openEdit = () => {
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
      const merged = updateUserLocally(user, {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        phone: `${values.phoneCode} ${values.phoneNumber}`,
        location: values.location,
      });
      setTimeout(() => {
        setUser(merged);
        setSaving(false);
        message.success("Profile updated (local/dummy).");
      }, 500);
    } catch (err) {
    }
  };

  const onChangePassword = async () => {
    try {
      const v = await pwdForm.validateFields();
      if (v.newPassword !== v.confirmPassword) {
        message.error("New password and confirm do not match.");
        return;
      }
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        message.success("Password updated (dummy).");
        pwdForm.resetFields();
      }, 600);
    } catch (err) {
    }
  };

  const onModalSave = async () => {
    await onSaveProfile();
    const pwdVals = pwdForm.getFieldsValue();
    if (pwdVals.oldPassword || pwdVals.newPassword || pwdVals.confirmPassword) {
      await onChangePassword();
    }
    setOpen(false);
  };

  return (
    <div>
      <h2 className="panel-title">Your personal profile info</h2>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
        <Card className="panel-card" bodyStyle={{ padding: 18 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 12 }}>
            <div className="avatar-large">
              <img 
                src={profileImage} 
                alt="Profile" 
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "50%", 
                  objectFit: "cover" 
                }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{user.firstName} {user.lastName}</h3>
                  <div style={{ color: "#6b7280", marginTop: 4 }}>{user.username} • {user.email}</div>
                </div>
                <Tag color="blue" style={{ borderRadius: 999, paddingInline: 12 }}>{user.role}</Tag>
              </div>
            </div>
          </div>

          <Descriptions
            column={{ xs: 1, sm: 1, md: 2 }}
            bordered
            size="small"
            labelStyle={{ width: 180, fontWeight: 600 }}
            contentStyle={{ fontSize: 14 }}
          >
            <Descriptions.Item label="First name">{user.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last name">{user.lastName}</Descriptions.Item>
            <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Your e-mail">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Phone number">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Location">{user.location}</Descriptions.Item>
          </Descriptions>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <Button type="primary" icon={<EditOutlined />} onClick={openEdit} size="large">
              Update profile
            </Button>
          </div>
        </Card>
      </motion.div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={920}
        closeIcon={<></>}
        bodyStyle={{ padding: 18, borderRadius: 14 }}
        destroyOnClose
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Edit profile</h3>
          <div style={{ color: "#9aa4b2" }}>Role: <strong style={{ color: "#111827" }}>{user.role}</strong></div>
        </div>

        <Row gutter={20}>
          <Col xs={24} md={12}>
            <Card size="small" style={{ borderRadius: 12 }}>
              <Form form={profileForm} layout="vertical">
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="firstName" label="First name" rules={[{ required: true }]}>
                      <Input placeholder="Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName" label="Last name" rules={[{ required: true }]}>
                      <Input placeholder="Surname" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="username" label="Username (not your e-mail)" rules={[{ required: true }]}>
                      <Input placeholder="Username" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="email" label="Your e-mail" rules={[{ type: "email", required: true }]}>
                      <Input placeholder="mail@example.com" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Personal phone number" style={{ marginBottom: 0 }}>
                      <Input.Group compact>
                        <Form.Item name="phoneCode" noStyle rules={[{ required: true }]}>
                          <Select options={countryCodes} style={{ width: "30%" }} />
                        </Form.Item>
                        <Form.Item name="phoneNumber" noStyle rules={[{ required: true }]}>
                          <Input style={{ width: "70%" }} placeholder="17 1234 5678" />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="location" label="Country, City" rules={[{ required: true }]}>
                      <Input placeholder="Dhaka, Bangladesh" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="Password" headStyle={{ fontWeight: 700 }} style={{ borderRadius: 12 }}>
              <Form form={pwdForm} layout="vertical">
                <Form.Item name="oldPassword" label="Old password">
                  <Input.Password placeholder="Leave empty to keep current password" />
                </Form.Item>

                <Form.Item name="newPassword" label="New password" rules={[{ min: 6 }]}>
                  <Input.Password placeholder="At least 6 characters" />
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm new password">
                  <Input.Password placeholder="Retype new password" />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
          <Button onClick={() => setOpen(false)} size="large">Cancel</Button>
          <Button type="primary" loading={saving} onClick={onModalSave} size="large">
            Save changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
