import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Technologies() {
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5555/technologies")
            .then((response) => response.json())
            .then((data) => setTechnologies(data));
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required("Technology name is required"),
        description: yup.string().required("Description is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/technologies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new Error("Failed to create technology.");
                })
                .then((newTech) => {
                    setTechnologies((previous) => [...previous, newTech]);
                    resetForm();
                })
                .catch((error) => console.error(error));
        },
    });

    return (
        <div>
            <h2>Technologies</h2>
            <ul>
                {technologies.map((technology) => (
                    <li key={technology.id}>{technology.name} - {technology.description}</li>
                ))}
            </ul>

            <h3>Add a New Technology</h3>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Technology Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.errors.name && <p style={{ color: "red" }}>{formik.errors.name}</p>}

                <input
                    type="text"
                    name="description"
                    placeholder="Technology Description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
                {formik.errors.description && 
                    <p style={{ color: "red" }}>{formik.errors.description}</p>}

                <button type="submit">Add Technology</button>
            </form>
        </div>
    );
}

export default Technologies;