const serviceWrapper = async (promise) => {
  try {
    const res = await promise;

    if (res.error) {
      throw res.error;
    }

    if (res.data.isError) throw new Error(res.data);

    return res.data;
  } catch (e) {
    if (e.response?.data?.isError) {
      throw new Error(e.response?.data?.message);
    } else {
      throw new Error(e.message);
    }
  }
};

export default serviceWrapper;
