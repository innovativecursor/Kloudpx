function NavigationComponent({ categories }) {
  return (
    <div className="navigation category-5">
      <div className="navigation-category-5">
        {categories.map((category, index) => (
          <span key={index}>{category}</span>
        ))}
      </div>
    </div>
  );
}

export default NavigationComponent;
