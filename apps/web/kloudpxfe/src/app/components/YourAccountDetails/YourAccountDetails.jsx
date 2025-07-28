import { useEffect } from "react";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import M from "materialize-css";
import OrdersTabContent from "../OrdersTabContent/OrdersTabContent";
import MessagesTabContent from "../MessagesTabContent/MessagesTabContent";
import AddressesTabContent from "../AddressesTabContent/Address";
import WishListsTabContent from "../WishListsTabContent/WishListsTabContent";
import AccountSettingsTabContent from "../AccountSettingsTabContent/AccountSettingsTabContent";
import Link from "next/link";

function YourAccountDetails() {
  useEffect(() => {
    // Initialize Materialize Tabs
    const tabs = document.querySelectorAll(".tabs");
    M.Tabs.init(tabs, {
      //   swipeable: true,
    });
  }, []);

  return (
    <>
      <div className="container">
        <Breadcrumbs title1={"Your Account"} title2={"Account Details"} />
        <div className="product_description">
          <div className="row">
            <div className="col l12 s12 m9">
              <h4 className="cartItemsBlock-heading">Account Details</h4>
              <div className="row">
                <div className="col s12">
                  <ul className="tabs tabs-fixed-width">
                    <li className="tab col l2 s1">
                      <Link href="#tab6">Profile</Link>
                    </li>
                    <li className="tab col l2 s1">
                      <Link href="#tab1">Orders</Link>
                    </li>
                    <li className="tab col l2 s1">
                      <Link href="#tab2">Messages(0)</Link>
                    </li>
                    <li className="tab col l2 s1">
                      <Link href="#tab3">Addresses</Link>
                    </li>
                    <li className="tab col l2 s1">
                      <Link href="#tab4">Wish Lists(1)</Link>
                    </li>
                    <li className="tab col l2 s1">
                      <Link href="#tab5">Account Settings</Link>
                    </li>
                  </ul>
                </div>
                <div id="tab1" className="col s12">
                  <OrdersTabContent />
                </div>
                <div id="tab2" className="col s12">
                  <MessagesTabContent />
                </div>
                <div id="tab3" className="col s12">
                  <LinkddressesTabContent />
                </div>
                <div id="tab4" className="col s12">
                  <WishListsTabContent />
                </div>
                <div id="tab5" className="col s12">
                  <LinkccountSettingsTabContent />
                </div>
                <div id="tab6" className="col s12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YourAccountDetails;
