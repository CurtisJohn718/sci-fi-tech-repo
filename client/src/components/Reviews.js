import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Reviews() {
   const [reviews, setReviews] = useState([]);

   useEffect(() => {
    fetch("http://localhost:5555/reviews")
        .then((response) => response.json())
        .then((data) => setReviews(data));
    }, []);

    const formSchema = yup.object().shape({
        comment: yup.string().required("Comment is required"),
        rating: yup.number().required("Rating is required").min(1).max(5),   
        character_id: yup.number().required("Character ID is required"),
        technology_id: yup.number().required("Technology is required"),
    });

    const formik = useFormik({
        initialValues: {
            comment: "",
            rating: "",
            character_id: "",
            technology_id: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("http://localhost:5555/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new Error("Failed to submit review");
                })
                .then((newReview) => {
                    setReviews((previous) => [...previous, newReview]);
                    resetForm();
                })
                .catch((error) => console.error(error));
        },
    });

    const handleDelete = (id) => {
        fetch('http://localhost:5555/reviews/${review.id}', {
            method: "DELETE",
        })
            .then((response) => {
            if(response.ok) {
                setReviews((previousReviews) => previousReviews.filter((review) => review.id !== id)
            );
            } else {
               throw new Error("Failed to delete review");
            }
        })
        .catch((error) => {
            console.error("Delete failed", error);
        });
    };

    return (
        <div>
            <h2>Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        {review.comment} (Rating: {review.rating}) - Character: {review.character.name} | Tech: {review.technology.name}
                        <button onClick={() => handleDelete(review.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Add a Review</h3>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="comment"
                    placeholder="Comment"
                    onChange={formik.handleChange}
                    value={formik.values.comment}
                />
                {formik.errors.comment && <p style={{ color: "red" }}>{formik.errors.comment}</p>}

                <input
                    type="number"
                    name="rating"
                    placeholder="Rating (1-5)"
                    onChange={formik.handleChange}
                    value={formik.values.rating}
                />
                {formik.errors.rating && <p style={{ color: "red" }}>{formik.errors.rating}</p>}

                <input
                    type="number"
                    name="character_id"
                    placeholder="Character ID"
                    onChange={formik.handleChange}
                    value={formik.values.character_id}
                />
                {formik.errors.technology_id && <p style={{ color: "red" }}>{formik.errors.technology_id}</p>}

                <input 
                    type="number"
                    name="technology_id"
                    placeholder="Technology ID"
                    onChange={formik.handleChange}
                    value={formik.values.technology_id}
                />
                {formik.errors.technology_id && <p style={{ color: "red" }}>{formik.errors.technology_id}</p>}

                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default Reviews;