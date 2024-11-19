import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './EbooksPage.css';

const EbooksPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const ebookUrl = import.meta.env.VITE_SPRING_MANAGEMENT_GET_ALL_EBOOKS;

    useEffect(() => {
        fetch(ebookUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Basic YWRtaW46cGFzc3dvcmQxMjM='
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data.folderMap);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    // Function to handle file opening
    const openFile = (url) => {
        console.log(`Opening file from URL: ${url}`);
        // Open the file in a new tab
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const renderFolders = (folder) => {
        if (!folder || !folder.subfolders) return null;

        return (
            <div className="subfolders-grid">
                {folder.subfolders.map((subfolder, index) => (
                    <div key={index} className="subcategory-card">
                        <h3>{subfolder.folderName}</h3>
                        {/* Display files if any */}
                        {subfolder.files && subfolder.files.length > 0 && (
                            <div className="files-grid">
                                {subfolder.files.map((file, fileIndex) => (
                                    <div
                                        key={fileIndex}
                                        className="file-card"
                                        onClick={() => openFile(`http://localhost:8088/files/${file}`)} // Pass the file URL
                                    >
                                        <p>{file}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Recursively render nested subfolders */}
                        {subfolder.subfolders && subfolder.subfolders.length > 0 && renderFolders(subfolder)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="ebooks-page">
            <Navbar />
            <div className="page-content">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="categories-grid">
                        {renderFolders(data)}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default EbooksPage;
