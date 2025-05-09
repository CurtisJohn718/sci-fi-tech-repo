import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Characters() {
    const [characters, setCharacters] = useState([]);
    const [universes, setUniverses] = useState([]);

    // Fetch characters
    useEffect(() => {
        fetch("http://localhost:5555/characters")
            .then((response) => response.json())
            .then((data) => setCharacters(data));
    }, []);

    // Fetch universes for dropdown
    useEffect(() => {
        fetch("http://localhost:5555/universes")
            .then((response) => response.json())
            .then((data) => setUniverses(data));
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string(),
        universe_id: yup.number().required("Universe is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            universe_id: "",
        },
        validationSchema: formSchema, 
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) 
                    return response.json();
                throw new Error("Failed to add character");
            })
            .then((newCharacter) => {
            setCharacters([...characters, newCharacter]);
            resetForm();
        })
        .catch(console.error);
    },
});

    return (
        <div>
            <h2>Characters</h2>
            <ul>
                {characters.map((character) => (
                    <li key={character.id}>
                        {character.name} - {character.description}
                    </li>
                ))}
            </ul>

            <h3>Add a New Character</h3>
            <form onSubmit={formik.handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.errors.name && <p style={{ color: "red" }}>{formik.errors.name}</p>}

                <input
                    name="description"
                    type="text"
                    placeholder="Description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />

                <select
                    name="universe_id"
                    onChange={formik.handleChange}
                    value={formik.values.universe_id}
                >
                    <option value="">Select Universe</option>
                    {universes.map((universe) => (
                        <option key={universe.id} value={universe.id}>
                            {universe.name}
                        </option>
                    ))}
                </select>
                {formik.errors.universe_id && (
                    <p style={{ color: "red" }}>{formik.errors.universe_id}</p>
                )}

                <button type="submit">Add Character</button>
            </form>
        </div>
    );
}

export default Characters;