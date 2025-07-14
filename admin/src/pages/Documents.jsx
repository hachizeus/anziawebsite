import { useEffect, useState } from 'react';
import axios from 'axios';

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(response.data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>Sent Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <p>Title: {doc.title}</p>
            <p>Tenant: {doc.tenantId.name}</p>
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documents;