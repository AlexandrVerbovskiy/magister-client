import STATIC from "../static";

const HelloEmailLink = () => {
  return <a href={`mailto:${STATIC.HELLO_EMAIL}`}>{STATIC.HELLO_EMAIL}</a>;
};

export default HelloEmailLink;