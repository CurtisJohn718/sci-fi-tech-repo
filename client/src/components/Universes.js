import { useEffect, useState } from "react";
import { useFormik} from "formik";
import * as yup from "yup";


function Universes() {
    const [universes, setUniverses] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5555/universes")
            .then((response) => response.json())
            .then((data) => setUniverses(data));
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required("Universe name is required"),
    });

    const formik =useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/universes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values), 
            })
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new Error("Failed to create universe");
                })
                .then((newUniverse) => {
                    setUniverses((prev) => [...prev, newUniverse]);
                    resetForm();
                })
                .catch((error) => console.error(error));
        },
    });

    return (
        <div>
            <h2>Universes</h2>
            <ul>
                {universes.map((universe) => (
                    <li key={universe.id}>{universe.name}</li>
                ))}
            </ul>

            <h3>Add a New Universe</h3>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Universe Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                <button type="submit">Add</button>
                {formik.errors.name && <p style={{ color: "red"}}>{formik.errors.name}</p>}
            </form>
        </div>
    );
}

export default Universes;