

const loading = () => {
  const center = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={{ ...center }}>
      <div className="text-3xl font-bold mb-4">
        <span className="text-primary">Muslim </span>
        <span>School</span>
      </div>
     
    </div>
  );
};

export default loading;
