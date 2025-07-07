export default function FormSectionWrapper({ children, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      // className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-5"
      className="mt-8 px-5 space-y-6"
    >
      {children}
    </form>
  );
}
