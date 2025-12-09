import { useState, useEffect } from "react";
import axiosInst from "../../../api/apiClient";

const authData = () => {
  const [featureList, setFeatureList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [jbgdList, setJbgdList] = useState([]);

  const getData = () => {
    axiosInst.get("/comm-features")
      .then(({ data }) => setFeatureList(data))
      .catch(err => {
        console.log(err);
        setFeatureList([]);
      });

    axiosInst.get("/comm-depart")
      .then(({ data }) => setDeptList(data))
      .catch(err => {
        console.log(err);
        setDeptList([]);
      });

    axiosInst.get("/comm-job")
      .then(({ data }) => setJbgdList(data))
      .catch(err => {
        console.log(err);
        setJbgdList([]);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return { featureList, deptList, jbgdList, getData };
};

export default authData;
