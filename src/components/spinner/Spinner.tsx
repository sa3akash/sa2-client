import '@components/spinner/spinner.scss';

const Spinner = ({ bgColor }: { bgColor?: string }) => {
  return (
    <>
      <div className="spinner">
        <div className="bounce1" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
        <div className="bounce2" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
        <div className="bounce3" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
      </div>
    </>
  );
};

export default Spinner;
