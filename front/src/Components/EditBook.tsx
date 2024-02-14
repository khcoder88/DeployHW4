import { useEffect } from "react";

// import { getAxiosErrorMessages, Book } from "./utils.ts";
// import axios, { AxiosResponse } from "axios";
import { useNavigate } from 'react-router-dom';

function EditPanel() {
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            
            navigate("/table");
        })();
    }, []);

    return (
        <>
            
        </>
    );
}

export default EditPanel;