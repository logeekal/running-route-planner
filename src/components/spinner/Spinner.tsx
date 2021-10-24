import { FC } from "react";
import './Spinner.scss'

interface SpinnerProps {
  loading: boolean;
}

const Spinner: FC<SpinnerProps> = (props) => {
  const { loading } = props;

  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen bg-primary opacity-80 place-items-center spinner__container ${
        loading ? "grid" : "none invisible"
      } z-20`}
    >
      <div className="w-20 h-20 border-t-2 border-blue-600 rounded-full spinner"></div>
    </div>
  );
};

export default Spinner;
