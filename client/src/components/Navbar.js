import { NavLink } from "react-router-dom"; 

const linkstyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "blue",
};

function NavBar() {
    return (
        <nav>
            <NavLink to="/" style={linkstyle}>Home</NavLink>
            <NavLink to="/universes" style={linkstyle}>Universes</NavLink>
            <NavLink to="/characters" style={linkstyle}>Characters</NavLink>
            <NavLink to="/technologies" style={linkstyle}>Tehcnologies</NavLink>
            <NavLink to="/reviews" style={linkstyle}>Reviews</NavLink>
        </nav>
    );
}

export default NavBar;