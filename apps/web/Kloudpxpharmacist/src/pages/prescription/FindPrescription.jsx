import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";

import AllPrescription from "./AllPrescription";

const FindPrescription = () => {
  const navigate = useNavigate();

  const {
    prescriptions,
    fetchPrescriptions,
    loading,
    getPrescriptionDetails,
    setPrescriptionDetails,
  } = usePrescriptionContext();

  useEffect(() => {
    fetchPrescriptions("unsettled");
  }, []);

  const handleClick = (statusParam) => {
    navigate(`?status=${statusParam}`);
    fetchPrescriptions(statusParam);
    setPrescriptionDetails(null);
  };

  return (
    <div className="responsive-mx py-4">
      <AllPrescription
        loading={loading}
        prescriptions={prescriptions}
        handleClick={handleClick}
        getPrescriptionDetails={getPrescriptionDetails}
      />
    </div>
  );
};

export default FindPrescription;
