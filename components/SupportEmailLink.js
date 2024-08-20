import STATIC from "../static";

const SupportEmailLink = () => {
  return <a href={`mailto:${STATIC.SUPPORT_EMAIL}`}>{STATIC.SUPPORT_EMAIL}</a>;
};

export default SupportEmailLink;