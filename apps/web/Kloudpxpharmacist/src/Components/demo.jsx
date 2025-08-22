       <div className="md:hidden max-h-64 sm:max-h-72 overflow-y-auto flex flex-col sm:gap-6 gap-4">
                    {Array.isArray(allPrescription) &&
                    allPrescription.length > 0
                      ? allPrescription.map(({ ID, UploadedImage }) => (
                          <div
                            key={ID}
                            className="relative  flex-shrink-0 cursor-pointer"
                          >
                            <img
                              src={UploadedImage || fallbackImage}
                              alt="Prescription"
                              className={`w-full h-32 sm:h-40 object-cover rounded-lg shadow`}
                              onClick={() => {
                                setSelectedPrescriptionId(ID);
                                handleSelectedPrescription(ID);
                              }}
                            />
                            {selectedPrescriptionId === ID && (
                              <div className="absolute top-2 right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                                ✔
                              </div>
                            )}
                          </div>
                        ))
                      : null}
                  </div>