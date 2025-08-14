import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext.jsx";
// import ImageProvider from "./contexts/ImageContext.jsx";
import { ImageProvider } from "./contexts/ImageContext.jsx";
import DropdownProvider from "./contexts/DropdownContext.jsx";
import CategoryProvider from "./contexts/CategoryContext.jsx";
import CarouselProvider from "./contexts/CarouselContext.jsx";
import GalleryProvider from "./contexts/GalleryContext.jsx";
import AddItemsProvider from "./contexts/AddItemsContext.jsx";
import { MeasurementProvider } from "./contexts/MeasurementContext.jsx";
import FormDataProvider from "./contexts/FormDataContext.jsx";
import GetDataProvider from "./contexts/GetDataContext.jsx";
import OrderProvider from "./contexts/OrderContext.jsx";
import ThresholdProvider from "./contexts/ThresholdContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <MeasurementProvider>
              <ImageProvider>
                <FormDataProvider>
                  <CategoryProvider>
                    <DropdownProvider>
                      <AddItemsProvider>
                        <GetDataProvider>
                          <CarouselProvider>
                            <GalleryProvider>
                              <OrderProvider>
                                <ThresholdProvider>
                                <App />
                                </ThresholdProvider>
                              </OrderProvider>
                            </GalleryProvider>
                          </CarouselProvider>
                        </GetDataProvider>
                      </AddItemsProvider>
                    </DropdownProvider>
                  </CategoryProvider>
                </FormDataProvider>
              </ImageProvider>
            </MeasurementProvider>
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
