import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import PageWrapper from "../PageContainer/PageWrapper";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Slider,
  Space,
  Spin,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import Creatable from "react-select/creatable";
import Select from "react-select";
import {
  deleteAxiosCall,
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
function GlobalForm(props) {
  const [loading, setLoading] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [imageArray2, setImageArray2] = useState([]);
  const [imageArray3, setImageArray3] = useState([]);
  const [inputs, setInputs] = useState({});
  const [location, setLocation] = useState({});
  const [stationOptions, setStationOptions] = useState();
  const [imageClone, setImageClone] = useState(props?.record?.pictures || []);
  const [imageClone2, setImageClone2] = useState([]);
  const [imageClone3, setImageClone3] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
  const [projects, setProjects] = useState();
  const [check, setcheck] = useState(true);

  const NavigateTo = useNavigate();
  useEffect(() => {
    setInputs(props?.record);
  }, [props?.record]);
  useEffect(() => {
    callAboutus();
  }, []);

  const callAboutus = async () => {
    if (props?.type === "About") {
      const fetchAboutDetails = await getAxiosCall("/aboutpage");
      setInputs(fetchAboutDetails?.data);
      setImageClone(fetchAboutDetails?.data?.about_image1);
      setImageClone2(fetchAboutDetails?.data?.about_image2);
      setImageClone3(fetchAboutDetails?.data?.about_image3);
    }
    if (props?.type === "Achievements") {
      const fetchAboutDetails = await getAxiosCall("/getachivements");
      setInputs(fetchAboutDetails?.data);
    }
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async () => {
    if (props.pageMode === "Add") {
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray?.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { pictures: [...B64Array] };

        asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
        setInputs({ ...inputs, pictures: asd });
      }
    } else {
      if (imageArray?.length != 0 && props?.type != "About") {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { pictures: [...B64Array] };
        asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
        setInputs({ ...inputs, pictures: asd });
      }

      if (props?.type === "About") {
        let B64Array = [];
        let asd;
        if (imageArray?.length !== 0 || imageClone === undefined) {
          for (let i = 0; i < imageArray.length; i++) {
            const base64String = await getBase64(imageArray[i]?.originFileObj);
            B64Array.push(base64String);
          }
          let dummyObj = { about_image1: [...B64Array] };
          asd = Object.assign(inputs, { about_image1: dummyObj?.about_image1 });
          setInputs({ ...inputs, about_image1: asd });
          B64Array = [];
        }
        if (imageArray2?.length !== 0 || imageClone2 === undefined) {
          for (let i = 0; i < imageArray2.length; i++) {
            const base64String = await getBase64(imageArray2[i]?.originFileObj);
            B64Array.push(base64String);
          }
          let dummyObj2 = { about_image2: [...B64Array] };
          asd = Object.assign(inputs, {
            about_image2: dummyObj2?.about_image2,
          });
          setInputs({ ...inputs, about_image2: asd });
          B64Array = [];
        }
        if (imageArray3?.length !== 0 || imageClone3 === undefined) {
          for (let i = 0; i < imageArray3.length; i++) {
            const base64String = await getBase64(imageArray3[i]?.originFileObj);
            B64Array.push(base64String);
          }
          let dummyObj3 = { about_image3: [...B64Array] };
          asd = Object.assign(inputs, {
            about_image3: dummyObj3?.about_image3,
          });
          setInputs({ ...inputs, about_image3: asd });
          B64Array = [];
        }
      }
    }
  };
  // A submit form used for both (i.e.. Products & Awards)
  const submitForm = async () => {
    try {
      switch (props.pageMode) {
        case "Add":
          if (imageArray?.length == 0 && props?.type !== "Testimonials") {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          } else {
            // Converting images to base64
            await convertAllToBase64();
          }
          if (props.type === "Projects") {
            let answer;

            answer = await postAxiosCall("/createProject", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type === "Services") {
            let answer;
            answer = await postAxiosCall("/createServices", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type === "Testimonials") {
            let answer;
            answer = await postAxiosCall("/createTestimonial", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type === "Staff") {
            let answer;
            answer = await postAxiosCall("/createStaff", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          break;
        case "Update":
          if (
            imageArray?.length == 0 &&
            (imageClone?.length == 0 || imageClone?.length == undefined) &&
            props?.type != "Achievements" &&
            props?.type != "Testimonials"
          ) {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          }

          if (
            props?.type === "About" &&
            imageArray2?.length == 0 &&
            (imageClone2?.length == 0 || imageClone2?.length == undefined) &&
            imageArray3?.length == 0 &&
            (imageClone3?.length == 0 || imageClone3?.length == undefined)
          ) {
            Swal.fire({
              title: "error",
              text: "Please add all required Images",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          } else {
            //merging the new images (if uploaded)
            await convertAllToBase64();
          }
          if (props.type === "About") {
            const updatedResult = await updateAxiosCall(
              "/updateAbout",
              1,
              inputs
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs({});
                window.location.reload(true);
              });
            }
          }
          if (props.type === "Projects") {
            const updatedResult = await updateAxiosCall(
              "/updateProject",
              props?.record?.project_id,
              inputs
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs();
                NavigateTo("/updateProjects");
              });
            }
          }
          if (props.type === "Services") {
            const updatedResult = await updateAxiosCall(
              "/updateServices",
              props?.record?.service_id,
              inputs
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs();
                NavigateTo("/updateServices");
              });
            }
          }
          if (props.type === "Achievements") {
            const updatedResult = await updateAxiosCall(
              "/updateAchievements",
              1,
              {
                ...inputs,
                // isActive: check,
              }
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs({});
                window.location.reload(true);
              });
            }
          }
          if (props.type === "Testimonials") {
            const updatedResult = await updateAxiosCall(
              "/updateTestimonial",
              props?.record?.testimonial_id,
              inputs
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs();
                NavigateTo("/updateTestimonial");
              });
            }
          }
          if (props.type === "Staff") {
            const updatedResult = await updateAxiosCall(
              "/updateStaff",
              props?.record?.staff_id,
              inputs
            );
            if (updatedResult) {
              Swal.fire({
                title: "Success",
                text: updatedResult?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                setInputs();
                NavigateTo("/updateStaff");
              });
            }
          }
          break;
        case "Delete":
          Swal.fire({
            title: "info",
            text: "Are You Sure You want to Delete This Product",
            icon: "info",
            confirmButtonText: "Delete",
            showCancelButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              remove();
            }
          });
          break;
        default:
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };
  const remove = async () => {
    let answer;
    if (props?.type === "Projects" && props?.type) {
      answer = await deleteAxiosCall(
        "/deleteProject",
        props?.record?.project_id
      );
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        });
        setInputs();
        NavigateTo("/deleteProjects");
      }
    }
    if (props?.type === "Services" && props?.type) {
      answer = await deleteAxiosCall(
        "/deleteServices",
        props?.record?.service_id
      );
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        });
        setInputs();
        NavigateTo("/deleteServices");
      }
    }
    if (props?.type === "Testimonials" && props?.type) {
      answer = await deleteAxiosCall(
        "/deleteTestimonial",
        props?.record?.testimonial_id
      );
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        });
        setInputs();
        NavigateTo("/deleteTestimonial");
      }
    }
    if (props?.type === "Staff" && props?.type) {
      answer = await deleteAxiosCall("/deleteStaff", props?.record?.staff_id);
      if (answer) {
        Swal.fire({
          title: "Success",
          text: answer?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        });
        setInputs();
        NavigateTo("/deleteStaff");
      }
    }
  };
  const deleteImage = async (imageIndex) => {
    let answer = await deleteAxiosCall(
      "/deleteHero",
      imageClone[imageIndex]?.public_id
    );

    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload(true);
      });
      setInputs({});
    }
  };
  const deleteFnc = async (imageIndex) => {
    const dupli = inputs?.pictures;
    dupli?.splice(imageIndex, 1);
    setInputs({ ...inputs, pictures: dupli });
  };
  const deleteModal = (index) => {
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Delete This Picture",
      icon: "info",
      confirmButtonText: "Delete",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (props?.type == "Hero") {
          deleteImage(index);
        } else {
          deleteFnc(index);
        }
      }
    });
  };
  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10; // Size in MB
    if (!isLt10M) {
      Swal.fire({
        title: "Error",
        text: "Image must be smaller than 10MB!",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
    return isLt10M || Upload.LIST_IGNORE; // Prevent upload if file size exceeds limit
  };
  return (
    <>
      {props?.type === "Projects" ? (
        <PageWrapper title={`${props?.pageMode} Projects`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Project <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, project_name: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.project_name}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    location
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, location: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.location}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Features
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, keyFeatures: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.keyFeatures}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Execution Time
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, executionTime: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.executionTime}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Turn Over
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, turnOver: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.turnOver}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="project_desc"
                  name="project_desc"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.project_desc}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures (Max size upto 10 MB){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    beforeUpload={beforeUpload}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type === "About" ? (
        <PageWrapper title={`${props?.pageMode} About Us`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, about_title: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.about_title}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Our Values 1 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, our_values1: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.our_values1}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Our Values 2 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, our_values2: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.our_values2}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Our Values 3 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, our_values3: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.our_values3}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Our Values 4 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, our_values4: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.our_values4}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="description"
                  name="description"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.description}
                  required
                />
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Our Mission <span className="text-red-500">*</span>
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="subdescription"
                  name="subdescription"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.subdescription}
                  required
                />
              </div>
              {/* Upload Pictures */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  About Image 1 (Max size upto 10 MB){" "}
                  <span className="text-red-600">*</span>
                </label>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  // action="/upload.do"
                  listType="picture-card"
                  multiple={false}
                  name="imageArray"
                  fileList={imageArray}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  onChange={(e) => {
                    setImageArray(e.fileList);
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                </Upload>
              </div>
              {/* Pictures */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {imageClone?.map((el, index) => (
                    <div className="card" key={index}>
                      <div className="flex h-60 max-w-md  justify-center">
                        <img
                          src={el?.url}
                          alt="asd4e"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Upload Pictures 2 */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  About Image 2 (Max size upto 10 MB){" "}
                  <span className="text-red-600">*</span>
                </label>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  // action="/upload.do"
                  listType="picture-card"
                  multiple={false}
                  name="imageArray2"
                  fileList={imageArray2}
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  onChange={(e) => {
                    setImageArray2(e.fileList);
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                </Upload>
              </div>
              {/* Pictures */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {imageClone2?.map((el, index) => (
                    <div className="card" key={index}>
                      <div className="flex h-60 max-w-md justify-center">
                        <img
                          src={el?.url}
                          alt="asd4e"
                          className="object-contain"
                        />
                      </div>
                      {/* {props.pageMode !== "View" &&
                      props.pageMode !== "Delete" ? (
                        <div className="flex flex-row justify-center items-end">
                          <button
                            className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                            onClick={() => deleteModal(index)}
                            type="button"
                          >
                            Delete Picture
                          </button>
                        </div>
                      ) : (
                        ""
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
              {/* Upload Pictures 3 */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  About Image 3 (Max size upto 10 MB){" "}
                  <span className="text-red-600">*</span>
                </label>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  // action="/upload.do"
                  listType="picture-card"
                  multiple={false}
                  name="imageArray3"
                  fileList={imageArray3}
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  onChange={(e) => {
                    setImageArray3(e.fileList);
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                </Upload>
              </div>
              {/* Pictures */}
              <div className="my-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pictures
                </label>
                <div className="w-full flex flex-row">
                  {imageClone3?.map((el, index) => (
                    <div className="card" key={index}>
                      <div className="flex h-60 max-w-md justify-center">
                        <img
                          src={el?.url}
                          alt="asd4e"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type === "Services" ? (
        <PageWrapper title={`${props?.pageMode} Services`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, service_name: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.service_name}
                  />
                </div>
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Picture (Max size upto 10 MB){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    name="imageArray"
                    fileList={imageArray}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                <></>
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 max-w-md  justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type === "Achievements" ? (
        <PageWrapper title={`${props?.pageMode} Achievements`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Label 1 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, label1: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.label1}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Counter 1 <span className="text-red-600">*</span>
                  </label>
                  <InputNumber
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, counter1: e });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.counter1}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Label 2 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, label2: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.label2}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Counter 2 <span className="text-red-600">*</span>
                  </label>
                  <InputNumber
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, counter2: e });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.counter2}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Label 3 <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, label3: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.label3}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Counter 3 <span className="text-red-600">*</span>
                  </label>
                  <InputNumber
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, counter3: e });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.counter3}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="description"
                  name="description"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.description}
                  required
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Show on Landing Page?
                </label>
                <Checkbox
                  name="isActive"
                  disabled={props?.pageMode === "Delete"}
                  checked={inputs?.isActive}
                  onChange={() => {
                    setcheck(!check),
                      setInputs({
                        ...inputs,
                        isActive: !inputs?.isActive,
                      });
                  }}
                />
              </div>
              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type === "Testimonials" ? (
        <PageWrapper title={`${props?.pageMode} Testimonials`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Client's Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    required
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, reviewer_name: e.target.value });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.reviewer_name}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Client's location <span className="text-red-600">*</span>
                  </label>
                  <Input
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({
                        ...inputs,
                        reviewer_location: e.target.value,
                      });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    required
                    value={inputs?.reviewer_location}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Client's Rating (Type a number from 1-5){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <InputNumber
                    min={1}
                    max={5}
                    required
                    disabled={
                      props?.pageMode === "Delete" || props?.pageMode === "View"
                        ? true
                        : false
                    }
                    isMulti={false}
                    onChange={(e) => {
                      setInputs({ ...inputs, client_rating: e });
                    }}
                    isClearable
                    options={projects?.length != 0 ? projects : []}
                    isSearchable
                    value={inputs?.client_rating}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Review <span className="text-red-600">*</span>
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="review"
                  name="review"
                  required
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.review}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures (Max size upto 10 MB){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    beforeUpload={beforeUpload}
                    name="pictures"
                    fileList={imageArray}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type == "Staff" ? (
        <PageWrapper title={`${props?.pageMode} Staff`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Staff
                  </label>
                  <Input
                    name="staff_name"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.staff_name}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Staff Designation
                  </label>
                  <Input
                    name="staff_position"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.staff_position}
                  />
                </div>
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    multiple={false}
                    name="pictures"
                    fileList={imageArray}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : (
        <></>
      )}
    </>
  );
}

export default GlobalForm;
