import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTicket, saveTicket } from "../services/ticketsService";
import Input from "./common/Input";

const NewTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    price: "",
  });

  const populateTicket = async () => {
    if (id === "new") return;
    try {
      const { data: ticket } = await getTicket(id);
      setFormData({
        title: ticket.title,
        price: ticket.price,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) navigate("/404");
    }
  };

  useEffect(() => {
    async function fetchData() {
      await populateTicket();
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validate = () => {
    const errors = {};
    if (formData.title.trim() === "") errors.title = "Title is requried";

    return Object.keys(errors).length === 0 ? null : errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors || {});
    if (errors) return;
    try {
      await saveTicket(formData, id);
      navigate("/tickets");
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.errors
      ) {
        const errorsObject = err.response.data.errors.reduce((acc, curr) => {
          acc[curr.field] = curr.message;
          return acc;
        }, {});
        setErrors(errorsObject);
      } else {
        setErrors({ title: err.message });
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Ticket Form
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            name="title"
            stateData={formData.title}
            label="Title"
            onChange={handleChange}
            error={errors.title}
          />
          <Input
            name="price"
            stateData={formData.price}
            label="Price"
            onChange={handleChange}
            error={errors.price}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
