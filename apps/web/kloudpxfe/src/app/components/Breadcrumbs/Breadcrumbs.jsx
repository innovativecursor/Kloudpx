import Link from "next/link";

function Breadcrumbs({ title1, title2 }) {
  return (
    <>
      <div className="bread-crumbs-container">
        <nav className="page-crumb">
          <div className="nav-wrapper">
            <div className="row">
              <div className="col s12">
                <Link href="#!" className="breadcrumb">
                  Home
                </Link>
                <Link href="#!" className="breadcrumb">
                  {title1}
                </Link>
                <Link href="#!" className="breadcrumb">
                  {title2}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Breadcrumbs;
