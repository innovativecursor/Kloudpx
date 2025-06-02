import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import OrderPackageCard from "../OrderPackageCard/OrderPackageCard";
import "./CustomerServiceContent.css";
import logo from "@/assets/quiksie-logo.svg";

function CustomerServiceContent() {
  const secondRowData = [
    {
      title: "Your Orders",
      content: ["Track packages", "Edit or cancel orders"],
      imageUrl:
        "https://aiglekart.com/wp-content/uploads/2021/10/Buy-Online-%E2%80%93-Monthly-Grocery-Pack-1.png",
    },
    {
      title: "Returns and Refunds",
      content: ["Return or exchange items", "Print return mailing labels"],
      imageUrl:
        "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/returns-box-blue.png",
    },
    {
      title: "Manage Addresses",
      content: ["Update your address", "Add address, landmark details"],
      imageUrl:
        "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/manage-address.png",
    },
    {
      title: "Manage Quiksie",
      content: ["View your benefits", "Membership details"],
      imageUrl: { logo },
    },
    {
      title: "Payment Settings",
      content: ["Add or edit payment methods", "Change expired debit card"],
      imageUrl:
        "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Payments_clear-bg-t3.png",
    },
    {
      title: "Account Settings",
      content: ["Change your email or password", "Update login information"],
      imageUrl:
        "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/IN-your-account.png",
    },
    {
      title: "Digital and Device",
      content: ["Find device help and support", "Troubleshoot device issues"],
      imageUrl:
        "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/family_device.png",
    },
  ];

  return (
    <div className="container">
      <Breadcrumbs title1={"Customer Service"} title2={"Account Details"} />
      <div className="product_description">
        <div>
          <div className="col l12 s6 m9">
            <h4 className="cartItemsBlock-heading">
              Hello. What can we help you with?
            </h4>
          </div>
        </div>
        {/* Render second row components using mapping */}
        <div className="row">
          {secondRowData.map((item, index) => (
            <div key={index} className="col l3 m6 s12">
              <OrderPackageCard
                title={item.title}
                content={item.content}
                imageUrl={item.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerServiceContent;
