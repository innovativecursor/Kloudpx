import { createContext, useContext, useState } from "react";

export const FormDataContext = createContext();

const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    power: "",
    productDiscount: "",
    supplierDiscount: "",
    minThreshold: "",
    maxThreshold: "",
    leadTime: "",
    categorySubclass: "",
    dosageForm: "",
    packaging: "",
    marketer: "",
    description: "",
    benefits: "",
    keyingredients: "",
    recommendeddailyallowance: "",
    directionsforuse: "",
    safetyinformation: "",
    storage: ""
  });

  const [isBranded, setIsBranded] = useState(false);
  const [isPrescriptionRequired, setIsPrescriptionRequired] = useState(false);
  const [isInhouseBrand, setIsInhouseBrand] = useState(false);
  const [isfeature, setIsFeature] = useState(false);
  const [taxOption, setTaxOption] = useState(null);
  const [brandName, setBrandName] = useState("");

  const updateFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updateFormData,
        isBranded,
        setIsBranded,
        isPrescriptionRequired,
        setIsPrescriptionRequired,
        isInhouseBrand,
        setIsInhouseBrand,
        taxOption,
        setTaxOption,
        brandName,
        setBrandName,
        setFormData,
        isfeature,
        setIsFeature,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;
export const useFormDataContext = () => useContext(FormDataContext);
