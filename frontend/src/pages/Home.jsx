import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Home = () => {
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    
    const getFiles = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/gallery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "userId": id }),  // Send as JSON
        });

        if (response.ok) {
            const data = await response.json();
            setFiles(data.Files);  // Access "Files" property
        } else {
            console.error("Error fetching files");
        }
    };

    useEffect(() => {
        getFiles();
    }, [id]); // Adding id as a dependency to refetch when it changes

    return (
        <div>
            {files.length > 0 ? (
                <div>
                    <h2>Files Uploaded</h2>
                    {files.map((file) => (
                        <div key={file._id}>
                            <h3>{file.fileName}</h3>
                            <img src={file.fileUrl} alt={file.fileName} width="300" />
                            <p>Type: {file.fileType}</p>
                            <p>Uploaded at: {new Date(file.createdAt).toLocaleString()}</p>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No files uploaded yet</p>
            )}
        </div>
    );
};

export default Home;
