import { useState } from "react";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import SideBarMenu from "../SidebarMenu/SideBarMenu";
import BrowseCard from "../BrowseCard/BrowseCard";
import airJordan from "@/assets/air-jordan-1.png";
import FilterButton from "../FilterButton/FilterButton";
import SideBarMenu2 from "../SideBarMenu2/SideBarMenu2";
import GroupButton from "../GroupButton/GroupButton";
function BrowseContent() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id],
    }));
  };

  const menuItems = [
    {
      id: 1,
      title: "Mobiles & Tablets",
      category: [
        {
          id: 1,
          title: "All Mobile Phones",
          link: "/browse",
        },
        {
          id: 2,
          title: "All Mobile Accessories",
          link: "#",
        },
        {
          id: 3,
          title: "Cases & Covers",
          link: "#",
        },
        {
          id: 4,
          title: "Screen Protectors",
          link: "#",
        },
        {
          id: 5,
          title: "Power Banks",
          link: "#",
        },
        {
          id: 6,
          title: "Refurbished & Open Box",
          link: "#",
        },
      ],
    },
    {
      id: 2,
      title: "Electronics",
      category: [
        {
          id: 1,
          title: "Television",
          link: "/browse",
        },
        {
          id: 2,
          title: "Home Entertainment Systems",
          link: "#",
        },
        {
          id: 3,
          title: "Headphones",
          link: "#",
        },
        {
          id: 4,
          title: "Speakers",
          link: "#",
        },
        {
          id: 5,
          title: "Home Audio & Theater",
          link: "#",
        },
        {
          id: 6,
          title: "Cameras",
          link: "#",
        },
      ],
    },
    {
      id: 3,
      title: "Appliances",
      category: [
        {
          id: 1,
          title: "Air Conditioners",
          link: "/browse",
        },
        {
          id: 2,
          title: "Refrigerators",
          link: "#",
        },
        {
          id: 3,
          title: "Washing Machines",
          link: "#",
        },
        {
          id: 4,
          title: "Heating & Coating Appliances",
          link: "#",
        },
        {
          id: 5,
          title: "Kitchen & Home Appliances",
          link: "#",
        },
      ],
    },
    {
      id: 4,
      title: "Clothing & Fashion",
      category: [
        {
          id: 1,
          title: "Watches",
          link: "/browse",
        },
        {
          id: 2,
          title: "Bags & Luggage",
          link: "#",
        },
        {
          id: 3,
          title: "Sunglasses",
          link: "#",
        },
        {
          id: 4,
          title: "Jewellery",
          link: "#",
        },
        {
          id: 5,
          title: "Wallets",
          link: "#",
        },
      ],
    },
    {
      id: 5,
      title: "Furniture",
      category: [
        {
          id: 4,
          title: "Chairs",
          link: "#",
        },
        { id: 5, title: "Sofa", link: "#" },
        { id: 6, title: "Pillows", link: "#" },
        { id: 7, title: "Bed-sheets", link: "#" },
      ],
    },
    {
      id: 6,
      title: "Home Decor",
      category: [
        { id: 4, title: "Lamps", link: "#" },
        { id: 5, title: "Dinning Table", link: "#" },
        { id: 6, title: "Bin-bags", link: "#" },
        { id: 7, title: "Paintings", link: "#" },
      ],
    },
  ];

  const menuItems2 = [
    {
      id: 1,
      title: "Brand",
    },
    {
      id: 2,
      title: "Color",
    },
    {
      id: 3,
      title: "Price",
    },
  ];

  const cardData = [
    {
      cancelledPrice: "₹20,500",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/ff5e9061-0c6d-4dfd-87fc-344cf839291f/jordan-stadium-90-shoes-Jn6ZH4.png",
      title: "Air Jordan L1",
      originalPrice: "₹12,795",
      key: 1,
    },
    {
      cancelledPrice: "₹15,800",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/869dada1-afb5-45a5-b09e-a876e079bd38/jordan-max-aura-5-shoes-ZBZ4Pz.png",
      title: "Jordan Max Aura 5",
      originalPrice: "₹11,895",
      key: 2,
      onSale: true,
    },
    {
      cancelledPrice: "₹10,000",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a7ef34f4-4883-41ff-abe5-fe27c57866d7/jordan-nu-retro-1-low-shoes-8294mJ.png",
      title: "Jordan Nu Retro 1 Low",
      originalPrice: "₹9,195",
      key: 3,
    },
    {
      cancelledPrice: "₹5,000",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/f28a2eaf-84a1-40ca-82db-af03051bcc07/jordan-flight-mvp-t-shirt-WmFB3T.png",
      title: "Jordan Flight MVP",
      originalPrice: "₹2,295",
      key: 4,
      onSale: true,
    },
    {
      cancelledPrice: "₹18,000",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/33220c81-c71e-4b20-b39d-db46c56f4e85/jumpman-mvp-shoes-JV1HCs.png",
      title: "Jumpman MVP",
      originalPrice: "₹15,295",
      key: 5,
    },
    {
      cancelledPrice: "₹13,565",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7a332de6-e409-4ab0-a4b1-882d3bc3808a/luka-2-pf-basketball-shoes-N6gmH9.png",
      title: "Air Jordan L1",
      originalPrice: "₹12,795",
      key: 6,
      onSale: true,
    },
  ];

  const cardData2 = [
    {
      cancelledPrice: "₹20,500",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/64689f96-72e6-46c7-817a-55087e2a1fe4/air-jordan-1-mid-shoes-SQf7DM.png",
      title: "Air Jordan L1",
      originalPrice: "₹12,795",
      key: 1,
    },
    {
      cancelledPrice: "₹2,500",
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d23af4de-eaba-4e35-9e57-191f48756e46/jordan-one-take-5-pf-shoes-jNx9SV.png",
      title: "Air Jordan L1",
      originalPrice: "₹1,795",
      key: 2,
      onSale: true,
    },
  ];

  return (
    <>
      <div className="container">
        <Breadcrumbs title1={"Shoes"} title2={"Nike"} />

        <div className="row">
          <div className="col l3 s12 browse-wrapper">
            {/* <SideBarMenu header={"Shop by Department"} categories={menuItems} /> */}
            <SideBarMenu2
              header={"Shop by Department"}
              categories={menuItems}
            />
            <SideBarMenu header={"Refined By"} categories={menuItems2} />
          </div>
          <div className="col l9 m12 s12">
            <div className="sidebar-wrapper  sidebar--categories">
              <h5 className="sidebarBlock-heading">Recommended Shoes</h5>
              <div className="col">
                <div className="row">
                  {cardData2.map((card) => (
                    <>
                      <div className="col l4 m4 s12" key={card.key}>
                        <BrowseCard
                          cancelledPrice={card.cancelledPrice}
                          image={card.image}
                          title={card.title}
                          originalPrice={card.originalPrice}
                          onSale={card.onSale}
                        />
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className="sidebar-wrapper  sidebar--categories">
              <h5 className="sidebarBlock-heading">Shop All</h5>
              <div className="chips recommended-btn">
                <div className="chip chip-browse-content">All Recommended</div>
                <div className="chip chip-browse-content">Nike</div>
                <div className="chip chip-browse-content">Adidas</div>
                <div className="chip chip-browse-content">Puma</div>
                <div className="chip chip-browse-content">Vans</div>
              </div>
              {cardData.map((card) => (
                <div className="col l4 m4 s12" key={card.key}>
                  <BrowseCard
                    cancelledPrice={card.cancelledPrice}
                    image={card.image}
                    title={card.title}
                    originalPrice={card.originalPrice}
                    onSale={card.onSale}
                  />
                </div>
              ))}

              <div className="filter-button">
                <FilterButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BrowseContent;
