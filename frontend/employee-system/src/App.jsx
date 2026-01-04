
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/employees";

const EMPTY_FORM = {
  employeeCode: "",
  name: "",
  age: "",
  phone: "",
  address: "",
};

const EMPTY_UPDATE = { employeeCode: "", phone: "", address: "" };

function App() {
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState("read");
  const [form, setForm] = useState(EMPTY_FORM);
  const [upd, setUpd] = useState(EMPTY_UPDATE);
  const [delCode, setDelCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (view === "read") fetchAll();
  }, [view]);

  const fetchAll = async () => {
    try {
      const res = await axios.get(API_BASE);
      setEmployees(res.data);
    } catch {
      setMessage("Error fetching employees");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeCode: form.employeeCode.trim(),
        name: form.name.trim(),
        age: Number(form.age),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      const res = await axios.post(API_BASE, payload);
      setMessage("Created: " + res.data.employeeCode);
      setForm(EMPTY_FORM);
      setView("read");
    } catch (err) {
      setMessage(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!upd.employeeCode) {
      setMessage("Provide employeeCode to update");
      return;
    }

    try {
      const payload = {};
      if (upd.phone) payload.phone = upd.phone;
      if (upd.address) payload.address = upd.address;

      const res = await axios.patch(
        `${API_BASE}/${encodeURIComponent(upd.employeeCode)}`,
        payload
      );

      setMessage("Updated: " + res.data.employeeCode);
      setUpd(EMPTY_UPDATE);
      setView("read");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!delCode) {
      setMessage("Provide employeeCode to delete");
      return;
    }

    try {
      const res = await axios.delete(
        `${API_BASE}/${encodeURIComponent(delCode)}`
      );

      setMessage(res.data.message || "Deleted");
      setDelCode("");
      setView("read");
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
          Employee Manager
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          {["create", "read", "update", "delete"].map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setMessage("");
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                view === v
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 text-center text-red-700 font-medium">
            {message}
          </div>
        )}

        {view === "create" && (
          <form onSubmit={handleCreate} className="max-w-xl mx-auto space-y-4">
            <Input label="Employee Code" value={form.employeeCode} onChange={(v) => setForm({ ...form, employeeCode: v })} />
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Age" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Create Employee
            </button>
          </form>
        )}

        {view === "read" && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-300">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-600">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id} className="border-t hover:bg-gray-100">
                      <td className="p-3">{emp.employeeCode}</td>
                      <td className="p-3">{emp.name}</td>
                      <td className="p-3">{emp.age}</td>
                      <td className="p-3">{emp.phone}</td>
                      <td className="p-3">{emp.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {view === "update" && (
          <form onSubmit={handleUpdate} className="max-w-xl mx-auto space-y-4">
            <Input label="Employee Code" value={upd.employeeCode} onChange={(v) => setUpd({ ...upd, employeeCode: v })} />
            <Input label="Phone" value={upd.phone} onChange={(v) => setUpd({ ...upd, phone: v })} />
            <Input label="Address" value={upd.address} onChange={(v) => setUpd({ ...upd, address: v })} />
            <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">
              Update Employee
            </button>
          </form>
        )}

        {view === "delete" && (
          <form onSubmit={handleDelete} className="max-w-xl mx-auto space-y-4">
            <Input label="Employee Code" value={delCode} onChange={setDelCode} />
            <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
              Delete Employee
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

export default App;

