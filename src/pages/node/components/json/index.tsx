import { useContext } from "react";
import { Context } from "../..";

function Json() {
  const store = useContext(Context);

  return (
    <h3 color="#fff">Json</h3>
  );
}

export default Json;