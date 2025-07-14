// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { message, Input, Form, Spin, Row, Col } from "antd";
// import Title from "../comman/Title";
// import { getAxiosCall, updateAxiosCall } from "../../Axios/UniversalAxiosCalls";
// import Button from "../comman/Button";

// const UpdateMedicine = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(false);
//     const [form] = Form.useForm();

//     const fetchMedicine = async () => {
//         setLoading(true);
//         try {
//             const res = await getAxiosCall(`/medicine/get/${id}`);
//             if (res?.data) {
//                 const data = res.data;
//                 form.setFieldsValue({
//                     brandName: data.brandName || "",
//                     genericName: data.genericName?.label || "",
//                     description: data.description || "",
//                     unitType: data.unitType?.label || "",
//                     measurementValue: data.measurementValue || "",
//                     piecesPerBox: data.piecesPerBox || "",
//                     spPerBox: data.spPerBox || "",
//                     spPerPiece: data.spPerPiece || "",
//                     cpPerBox: data.cpPerBox || "",
//                     cpPerPiece: data.cpPerPiece || "",
//                     category: data.category || "",
//                     supplier: data.supplier?.label || "",
//                     taxType: data.taxType?.label || "",
//                     minThreshold: data.minThreshold || "",
//                     maxThreshold: data.maxThreshold || "",
//                     leadTime: data.leadTime || "",
//                 });
//             } else {
//                 message.error("Failed to fetch medicine data");
//             }
//         } catch (error) {
//             message.error("Error fetching medicine");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMedicine();
//     }, [id]);

//     const onFinish = async (values) => {
//         setLoading(true);
//         try {
//             const payload = {
//                 ...values,
//                 genericName: { label: values.genericName },
//                 unitType: { label: values.unitType },
//                 supplier: { label: values.supplier },
//                 taxType: { label: values.taxType },
//             };

//             const res = await updateAxiosCall(`/medicine/update/${id}`, payload);

//             if (res?.data?.success) {
//                 message.success("Medicine updated successfully");
//                 navigate("/all-medicines");
//             } else {
//                 message.error("Failed to update medicine");
//             }
//         } catch (error) {
//             message.error("Error updating medicine");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//             style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 padding: 24,
//                 background: "#f5f5f7",
//                 minHeight: "100vh",
//             }}
//             className="mb-20"

//         >
//             <div
//                 style={{
//                     maxWidth: 900,
//                     width: "100%",
//                     background: "#fff",
//                     padding: 30,
//                     borderRadius: 8,
//                     boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
//                 }}
//                 className="border border-[#0070BA] mt-12"
//             >
//                 <div className="mb-8">
//                     <Title text="Update Medicine" />
//                 </div>

//                 {loading ? (
//                     <div style={{ textAlign: "center", marginTop: 50 }}>
//                         <Spin size="large" />
//                     </div>
//                 ) : (
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={onFinish}
//                         scrollToFirstError
//                         size="middle"
//                     >
//                         <Row gutter={24}>
//                             <Col xs={24} sm={12}>
//                                 <Form.Item
//                                     label="Brand Name"
//                                     name="brandName"
//                                     rules={[{ required: true, message: "Please enter brand name" }]}
//                                 >
//                                     <Input placeholder="Brand Name" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item
//                                     label="Generic Name"
//                                     name="genericName"
//                                     rules={[{ required: true, message: "Please enter generic name" }]}
//                                 >
//                                     <Input placeholder="Generic Name" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24}>
//                                 <Form.Item label="Description" name="description">
//                                     <Input.TextArea rows={3} placeholder="Description" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item
//                                     label="Unit Type"
//                                     name="unitType"
//                                     rules={[{ required: true, message: "Please enter unit type" }]}
//                                 >
//                                     <Input placeholder="Unit Type" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Measurement Value" name="measurementValue">
//                                     <Input placeholder="Measurement Value" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Pieces Per Box" name="piecesPerBox">
//                                     <Input type="number" placeholder="Pieces Per Box" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="SP Per Box" name="spPerBox">
//                                     <Input type="number" placeholder="SP Per Box" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="SP Per Piece" name="spPerPiece">
//                                     <Input type="number" placeholder="SP Per Piece" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="CP Per Box" name="cpPerBox">
//                                     <Input type="number" placeholder="CP Per Box" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="CP Per Piece" name="cpPerPiece">
//                                     <Input type="number" placeholder="CP Per Piece" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Category" name="category">
//                                     <Input placeholder="Category" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Supplier" name="supplier">
//                                     <Input placeholder="Supplier" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Tax Type" name="taxType">
//                                     <Input placeholder="Tax Type" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Min Threshold" name="minThreshold">
//                                     <Input type="number" placeholder="Min Threshold" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Max Threshold" name="maxThreshold">
//                                     <Input type="number" placeholder="Max Threshold" />
//                                 </Form.Item>
//                             </Col>

//                             <Col xs={24} sm={12}>
//                                 <Form.Item label="Lead Time (days)" name="leadTime">
//                                     <Input type="number" placeholder="Lead Time" />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                         <div className="flex justify-center items-center gap-6">
//                             <Button
//                                 type="submit"
//                                 text="Update"
//                                 loading={loading}
//                                 disabled={loading}
//                                 className="w-52"
//                             />

//                             <Button
//                                 text="Cancel"
//                                 onClick={() => navigate("/all-medicines")}
//                                 disabled={loading}
//                                 type="button"
//                                 className="bg-[#8098a8] text-[#0070BA] border border-[#0070BA] w-52"
//                             />
//                         </div>

//                     </Form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UpdateMedicine;












































import React from 'react'

const UpdateMedicine = () => {
  return (
    <div>UpdateMedicine</div>
  )
}

export default UpdateMedicine