import React from "react";
import { Button } from "react-bootstrap";

type Props = {
  size: "small" | "mid" | "large";
  children: React.ReactChildren;
  onclick: () => void;
};

export default (props: Props) => (
  <Button className={props.size} onClick={props.onclick}>
    {props.children}
  </Button>
);