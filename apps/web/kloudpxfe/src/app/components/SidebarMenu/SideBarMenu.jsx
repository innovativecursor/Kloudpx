import Dropdown1 from "./components/Dropdown1";

function SideBarMenu({ header, categories }) {
  return (
    <div className="sidebar-wrapper  sidebar--categories">
      <h5 className="sidebarBlock-heading">{header}</h5>
      <div className="block-content clearfix">
        {categories?.length > 0 &&
          categories.map((_category) => {
            return (
              <>
                <Dropdown1 category={_category} />
              </>
            );
          })}
      </div>
    </div>
  );
}

export default SideBarMenu;
