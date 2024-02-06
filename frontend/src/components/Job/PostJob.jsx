
import React, { useContext, useState } from 'react'
import { Context } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [title,setTitle]=useState('');
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryForm] = useState("");
  const [salaryTo,setSalaryTo]=useState('');
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("");

  const {isAuthorized,user} =useContext(Context);
  const handleJobPost=async(e)=>{
    e.preventDefault();
    if(salaryType === "Fixed Salary"){
      setSalaryForm("");
      setSalaryTo("");
    }else if(salaryType==="Ranged Salary"){
      setFixedSalary("");
    }else{
      setSalaryForm("");
      setSalaryTo("");
      setFixedSalary("");
    }

    await axios
      .post(
        "https://jobseeking-app.onrender.com/api/v1/job/postJob",
        fixedSalary.length >= 4
          ? {
              title,
              category,
              country,
              city,
              location,
              fixedSalary,
              description,
            }
          : {
              title,
              category,
              country,
              city,
              location,
              salaryFrom,
              description,
              salaryTo,
            },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setCategory("");
        setCity("");
        setDescription("");
        setSalaryForm("");
        setSalaryTo("");
        setTitle("");
        setLocation("");
        setCity("");
        setCountry("");
        setFixedSalary("");
        setSalaryType("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const navigateTo=useNavigate();
  if(!isAuthorized || user && user.role!=="Employee"){
    navigateTo("/")
  }
  return (
    <div className="job_post page">
      <div className="container">
        <h1>POST NEW JOB</h1>
        <form onSubmit={handleJobPost}>
          <div className="wrapper">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Job title"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Frontend Web Development">
                Frontend Web Development
              </option>
              <option value="MERN Stack Development">
                MERN STACK Development
              </option>
              <option value="Account & Finance">Account & Finance</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Video Animation">Video Animation</option>
              <option value="MEAN Stack Development">
                MEAN STACK Development
              </option>
              <option value="MEVN Stack Development">
                MEVN STACK Development
              </option>
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div className="wrapper">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter Country"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter City"
            />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
          />
          <div className="salary_wrapper">
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
            >
              <option value="default">Select Salary Type</option>
              <option value="fixedSalary">Fixed Salary</option>
              <option value="rangedSalary">Ranged Salary</option>
            </select>
            <div>
              {salaryType === "default" ? (
                <p>Please Provide Salary Type</p>
              ) : salaryType === "fixedSalary" ? (
                <input
                  type="number"
                  placeholder="Enter Fixed Salary"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                />
              ) : (
                <div className="ranged_salary">
                  <input
                    type="number"
                    placeholder="Salary form"
                    value={salaryFrom}
                    onChange={(e) => setSalaryForm(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Salary To"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <textarea
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          ></textarea>
          <button type="submit">Create Job</button>
        </form>
      </div>
    </div>
  );
}

export default PostJob