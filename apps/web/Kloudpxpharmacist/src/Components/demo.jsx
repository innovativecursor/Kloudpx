  const handleSaveAndProceed = () => {
    if (!checkoutData?.items || checkoutData.items.length === 0) {
      toast.error("No items in checkout. Add items first!");
      return;
    }

    let selectedAddressId = selectedId;

    if (!selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.IsDefault === true);
      if (defaultAddress) {
        selectedAddressId = defaultAddress.ID;
      }
    }

    if (selectedAddressId) {
      startLoader();
      selectedAddress(selectedAddressId);
      setSelectedId(selectedAddressId);
      router.push("Delivery");
    } else {
      toast.error("Please select an address");
    }
  };
