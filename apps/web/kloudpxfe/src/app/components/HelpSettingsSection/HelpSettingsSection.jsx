import Link from "next/link";

const HelpSettingsSection = () => {
  const menuItems = [
    { id: 1, title: "Your Account", link: "/account-details" },
    { id: 2, title: "Customer Service", link: "/customer-service" },
    { id: 3, title: "Sign Out", link: "#" },
  ];

  return (
    <>
      <div
        style={{ fontWeight: 800, fontSize: "20px" }}
        className="collapsible-header"
      >
        Help & Settings
      </div>
      <ul className="collapsible">
        {menuItems.map((menuItem) => (
          <li key={menuItem.id}>
            <div className="collapsible-header">
              <Link
                style={{ color: "black", fontSize: "13px", fontWeight: 500 }}
                href={menuItem.link}
              >
                {menuItem.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default HelpSettingsSection;
