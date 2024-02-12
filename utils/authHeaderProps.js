const authHeaderProps = (token) => ({
  Authorization: `Bearer ${token}`,
});

export default authHeaderProps;
