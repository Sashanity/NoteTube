import React from 'react';
import './modal.css';
import {useDropzone} from "react-dropzone"

export const Form = ({ onSubmit }) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <div className="form_section">
    <form className="form" onSubmit={onSubmit}>
      <div className="form_section">
        <label htmlFor="name">Course Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Semester </label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Instructor Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">File Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Course Name</label>
        <input className="form-input" id="name" />
      </div>

      <section className="dropzone_container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Click here to Upload Notes</p>
      </div>
    </section>

      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
    </div>
  );
};
export default Form;
